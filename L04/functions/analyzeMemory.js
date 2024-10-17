// This function analyzes a given memory text and returns various metrics
const execute = async (memory) => {
    // Count the number of words by splitting on whitespace and counting the resulting array
    const wordCount = memory.split(/\s+/).length;
    
    // Count the total number of characters in the memory
    const charCount = memory.length;
    
    // Analyze the sentiment of the memory using a helper function
    const sentiment = analyzeSentiment(memory);

    // Return an object containing the analysis results
    return {
        wordCount,
        charCount,
        sentiment,
        // Provide a human-readable summary of the analysis
        summary: `The memory contains ${wordCount} words and ${charCount} characters. The overall sentiment is ${sentiment}.`
    };
};

// This function performs a simple sentiment analysis on the given text
function analyzeSentiment(text) {
    // Define lists of positive and negative words for sentiment analysis
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'love'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike'];

    // Convert the text to lowercase and split it into individual words
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;

    // Iterate through each word in the text
    words.forEach(word => {
        // Increment the score for each positive word found
        if (positiveWords.includes(word)) score++;
        // Decrement the score for each negative word found
        if (negativeWords.includes(word)) score--;
    });

    // Determine the overall sentiment based on the final score
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

// This object defines the structure and metadata for the analyzeMemory function
// It's used by the OpenAI API to understand how to call this function
const details = {
    type: "function",
    function: {
        name: "analyzeMemory",
        parameters: {
            type: "object",
            properties: {
                memory: {
                    type: "string",
                    description: "The memory text to analyze"
                }
            },
            required: ["memory"]
        }
    },
    description: "Analyzes a given memory text, providing word count, character count, and sentiment analysis."
};

// Export the execute function and details object for use in other files
export { execute, details };
