# FunctionAgents
Call Function from LLM

<img width="333" alt="Screen Shot 2024-10-08 at 10 16 32 AM" src="https://github.com/user-attachments/assets/f0099867-a423-4bbe-9ae8-5681429f91f2">


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9wDnMTRl)
# FunctionAgents
Call Function from LLM
# AI Memory Assistant

This project demonstrates the power of "tools" and "tool_calling" in AI applications by implementing a system that can store and analyze memories using OpenAI's GPT model.

## Overview

The AI Memory Assistant is capable of:
1. Storing memories in a simple CSV file
2. Retrieving stored memories
3. Analyzing memories for word count, character count, and sentiment

The system uses OpenAI's GPT model to interpret user requests and decide which functions to call.

## Components

1. `server.js`: The main server file that handles API routes and interactions with OpenAI.
2. `functions/scratchpad.js`: A function for storing and retrieving memories.
3. `functions/analyzeMemory.js`: A function for analyzing the content of memories.
4. `public/index.html`: A simple front-end interface for interacting with the AI.

## New Functionality

We've added the following new features:

1. **Memory Analysis**: The `analyzeMemory` function can now provide word count, character count, and sentiment analysis for a given memory.
2. **Multi-step Function Calling**: The system can now chain multiple function calls together, allowing for more complex operations.

# Text Analysis Function

This project demonstrates a simple yet powerful text analysis function that can analyze given text for various metrics and sentiment. It's designed to work with OpenAI's GPT model as a tool for more complex AI interactions.

## Overview

The `analyzeMemory` function is capable of:
1. Counting the number of words in a text
2. Counting the total number of characters in a text
3. Performing basic sentiment analysis on the text

## How It Works

### Word and Character Count

The function uses simple JavaScript string methods to analyze the text:

- Word count is determined by splitting the text on whitespace (`text.split(/\s+/).length`).
- Character count is simply the length of the string (`text.length`).

### Sentiment Analysis

The sentiment analysis is performed using a basic keyword matching approach:

1. The text is converted to lowercase and split into individual words.
2. Each word is compared against predefined lists of positive and negative words.
3. A score is calculated by incrementing for positive words and decrementing for negative words.
4. The final sentiment is determined based on the overall score:
   - Positive if the score is greater than 0
   - Negative if the score is less than 0
   - Neutral if the score is 0

### Function Structure

The `execute` function is the main entry point:

```javascript
const execute = async (memory) => {
    const wordCount = memory.split(/\s+/).length;
    const charCount = memory.length;
    const sentiment = analyzeSentiment(memory);

    return {
        wordCount,
        charCount,
        sentiment,
        summary: `The memory contains ${wordCount} words and ${charCount} characters. The overall sentiment is ${sentiment}.`
    };
};
```

The `analyzeSentiment` helper function performs the sentiment analysis:

```javascript
function analyzeSentiment(text) {
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'love'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike'];

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) score++;
        if (negativeWords.includes(word)) score--;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}
```

## Usage with OpenAI API

The function is designed to be used as a tool with OpenAI's GPT models. The `details` object provides the necessary metadata for the OpenAI API to understand how to use this function:

```javascript
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
```
## Sample Prompts and Results

Sample prompt:
analyze the favorite_food memory

Sample output: "Final result: \"The analysis of the \\\"favorite_food\\\" memory, \\\"John likes ice cream,\\\" shows that it contains 4 words and 20 characters. The overall sentiment of this memory is neutral.\""
<img width="1440" alt="Screen Shot 2024-10-17 at 3 35 13 PM" src="https://github.com/user-attachments/assets/d15a4db3-9f7b-41ab-beca-7deb9a6355a4">

Sample prompt: 
analyze this: a dog went to the park

Sample output: 
"Final result: \"The memory you provided contains 6 words and 22 characters, and it conveys a neutral sentiment.\""

<img width="1440" alt="Screen Shot 2024-10-17 at 3 33 11 PM" src="https://github.com/user-attachments/assets/2f091a36-261f-4bd7-8cd9-7fe49c1f39e1">

## Limitations and Potential Improvements

1. The sentiment analysis is very basic and may not capture nuanced or context-dependent sentiments.
2. The lists of positive and negative words are limited and may not cover all scenarios.
3. The function doesn't handle edge cases like empty strings or very long texts.

Potential improvements could include:
- Using a more sophisticated sentiment analysis library
- Expanding the lists of positive and negative words
- Adding error handling for edge cases
- Implementing more advanced text analysis features like keyword extraction or topic modeling

## Conclusion

This text analysis function provides a simple yet effective way to extract basic metrics and sentiment from text. When used in conjunction with AI models like GPT, it can enable more complex text processing and analysis tasks.
