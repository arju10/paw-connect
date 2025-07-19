import app from './app';

import { Server } from 'http';

const PORT = process.env.PORT || 3000;

// Start the server
async function main() {
  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();
