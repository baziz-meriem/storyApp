import 'dotenv/config';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

const port = Number(process.env.PORT) || 4000;
const app = createApp();

async function main() {
  await connectDb();
  app.listen(port, () => {
    console.log(`Little Stories API listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
