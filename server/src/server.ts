import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 PHARMORA API server running on port ${env.PORT} [${env.NODE_ENV}]`);
  console.log(`📡 Healthcheck: http://localhost:${env.PORT}/api/health`);
});
