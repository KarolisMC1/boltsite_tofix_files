import { ResponseRenderer } from './response_renderer.js';

const apiKey = 'VF.DM.675163674b8f35d94c2d913e.up0uX7UlIHE1pugE';
const responseRenderer = new ResponseRenderer(apiKey);

// Simulate capturing user input from the Koučas window
function simulateUserInput(input) {
  console.log('User input:', input);
  responseRenderer.handleUserInput(input);
}

// Example usage
simulateUserInput('Hello, how can I help you today?');