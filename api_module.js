import axios from 'axios';

class VoiceflowAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.voiceflow.com';
  }

  async sendMessage(userInput) {
    try {
      const response = await axios.post(`${this.baseUrl}/interact`, {
        userInput,
      }, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error communicating with Voiceflow API:', error);
      throw error;
    }
  }
}

export { VoiceflowAPI };