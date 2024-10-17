import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI} from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Initialize Express server
const app = express();
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(process.cwd(), './public')));

// OpenAI API configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
let state = {
    chatgpt:false,
    assistant_id: "",
    assistant_name: "",
    dir_path: "",
    news_path: "",
    thread_id: "",
    user_message: "",
    run_id: "",
    run_status: "",
    vector_store_id: "",
    tools:[],
    parameters: []
  };
// Default route to serve index.html for any undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), './public/index.html'));
});
async function getFunctions() {
   
    const files = fs.readdirSync(path.resolve(process.cwd(), "./functions"));
    const openAIFunctions = {};

    for (const file of files) {
        if (file.endsWith(".js")) {
            const moduleName = file.slice(0, -3);
            const modulePath = `./functions/${moduleName}.js`;
            const { details, execute } = await import(modulePath);

            openAIFunctions[moduleName] = {
                "details": details,
                "execute": execute
            };
        }
    }
    return openAIFunctions;
}

// Route to interact with OpenAI API
app.post('/api/execute-function', async (req, res) => {
    const { functionName, parameters } = req.body;

    // Import all functions
    const functions = await getFunctions();

    if (!functions[functionName]) {
        return res.status(404).json({ error: 'Function not found' });
    }

    try {
        // Call the function
        const result = await functions[functionName].execute(...Object.values(parameters));
        console.log(`result: ${JSON.stringify(result)}`);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Function execution failed', details: err.message });
    }
});

// Example to interact with OpenAI API and get function descriptions
// Updated
// This route handles interactions with the OpenAI API
app.post('/api/openai-call', async (req, res) => {
    // Extract the user's message from the request body
    const { user_message } = req.body;

    // Get all available functions from the functions directory
    const functions = await getFunctions();
    // Extract the details of each function for use with the OpenAI API
    const availableFunctions = Object.values(functions).map(fn => fn.details);
    
    // Initialize the conversation with a system message and the user's input
    let messages = [
        { role: 'system', content: 'You are a helpful assistant capable of storing and analyzing memories. Use the provided functions to assist the user.' },
        { role: 'user', content: user_message }
    ];

    try {
        let finalResult = null;
        let stepCount = 0;
        const maxSteps = 3; // Limit the number of function calls to prevent infinite loops

        // Continue the conversation until we reach a final result or hit the max steps
        while (stepCount < maxSteps) {
            // Make a request to the OpenAI API
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: messages,
                tools: availableFunctions
            });

            // Get the assistant's response
            const assistantMessage = response.choices[0].message;
            // Add the assistant's message to the conversation history
            messages.push(assistantMessage);

            // If the assistant didn't call a function, we're done
            if (!assistantMessage.tool_calls) {
                finalResult = assistantMessage.content;
                break;
            }

            // Process each function call made by the assistant
            for (const toolCall of assistantMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const parameters = JSON.parse(toolCall.function.arguments);

                // Execute the called function with the provided parameters
                const result = await functions[functionName].execute(...Object.values(parameters));

                // Add the function result to the conversation history
                messages.push({
                    role: "tool",
                    content: JSON.stringify(result),
                    tool_call_id: toolCall.id
                });

                finalResult = result;
            }

            stepCount++;
        }

        // Send the final result back to the client
        res.json({ message: `Final result: ${JSON.stringify(finalResult)}`, state: state });
    } catch (error) {
        // If an error occurs, send it back to the client
        res.status(500).json({ error: 'OpenAI API failed', details: error.message });
    }
});

app.post('/api/prompt', async (req, res) => {
    // just update the state with the new prompt
    state = req.body;
    try {
        res.status(200).json({ message: `got prompt ${state.user_message}`, "state": state });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'User Message Failed', "state": state });
    }
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
