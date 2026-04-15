import 'dotenv/config';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

const port = Number(process.env.PORT) || 4000;
const app = createApp();

async function main() {
  await connectDb();
  app.listen(port, () => {
    // Bind address is implicit (all interfaces). Render/proxies route public HTTPS to this port.
    console.log(`Little Stories API listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
