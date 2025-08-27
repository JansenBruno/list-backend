// server.ts (CommonJS style)
const { app } = require('./app');
require('./infra/db');

const PORT = Number(process.env.PORT || 3334);
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
