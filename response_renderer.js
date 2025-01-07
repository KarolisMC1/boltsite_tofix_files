import { VoiceflowAPI } from './api_module.js';

class ResponseRenderer {
  constructor(apiKey) {
    this.voiceflowAPI = new VoiceflowAPI(apiKey);
  }

  async handleUserInput(userInput) {
    try {
      const response = await this.voiceflowAPI.sendMessage(userInput);
      this.renderResponse(response);
    } catch (error) {
      console.error('Failed to handle user input:', error);
    }
  }

  renderResponse(response) {
    const { text, buttons } = response;
    this.displayText(text);
    this.renderButtons(buttons);
  }

  displayText(text) {
    // Logic to display text in the Klientas (DI) window
    console.log('Displaying text:', text);
  }

  renderButtons(buttons) {
    // Logic to render buttons in the Klientas (DI) window
    buttons.forEach(button => {
      console.log('Rendering button:', button);
      // Attach event listeners to buttons for interaction
    });
  }
}

export { ResponseRenderer };