import axios from "axios";

const translateText = async () => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('in', 'What\'s 2 plus 5?'); // Corrected the single quote
  encodedParams.set('op', 'in');
  encodedParams.set('cbot', '1');
  encodedParams.set('SessionID', 'RapidAPI1');
  encodedParams.set('cbid', '1');
  encodedParams.set('key', 'RHMN5hnQ4wTYZBGCF3dfxzypt68rVP');
  encodedParams.set('ChatSource', 'RapidAPI');
  encodedParams.set('duration', '1');

  const options = {
    method: 'POST',
    url: 'https://robomatic-ai.p.rapidapi.com/api',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '73fe7ba568mshf4211a6ccb584eap1b5bb7jsndabef17029f1',
      'X-RapidAPI-Host': 'robomatic-ai.p.rapidapi.com'
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    const chatbotResponse = response.data; // Assuming the response format includes the chatbot's reply

    // Add code to convert chatbotResponse to speech audio using a text-to-speech API/service
    // For example, you can use Google Text-to-Speech API

    console.log('Chatbot Response:', chatbotResponse);

  } catch (error) {
    console.error(error);
  }
};

export default translateText;
