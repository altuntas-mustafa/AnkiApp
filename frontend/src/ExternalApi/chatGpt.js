const { Configuration, OpenAIApi } = require('openai');


// const apiKey = "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";

const configuration = new Configuration ({
    apiKey: "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",
})

const openai = new OpenAIApi(configuration);

const generateResponse = async (text) => {
    try {
      const response = await openai.createCompletion({
        engine: 'text-davinci-003', // Choose an appropriate engine
        prompt: text,
        max_tokens: 500, // Adjust as needed
        temperature: 0, // Set the temperature to 0 for deterministic output
        model: 'text-davinci-003', // Use the GPT-3.5 model
      });
  
      return response.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating sentence:', error);
      return null;
    }
  };

export default generateResponse;