import app from './app';
import { config, validateEnv } from './config/env';

// Verify all required env vars are loaded before starting
validateEnv();

app.listen(config.port, () => {
  console.log(`==================================================`);
  console.log(`🔐 BGV Platform Server is running!`);
  console.log(`PORT: ${config.port}`);
  console.log(`ENV:  ${config.nodeEnv}`);
  console.log(`URL:  http://localhost:${config.port}`);
  console.log(`==================================================`);
});
