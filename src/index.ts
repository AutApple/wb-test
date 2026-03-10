import { WbTestApplication } from './app.js';
import { appConfiguration } from './config/app.config.js';

const app = new WbTestApplication(appConfiguration);
app.run().catch(console.error);
