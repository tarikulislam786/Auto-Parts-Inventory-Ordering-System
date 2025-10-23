const app = require('./app');
const { sequelize } = require('./models');
const seed = require('./utils/seed');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    // Sync DB — in prod use migrations; for demo, sync is fine
    await sequelize.sync({ alter: false });
    console.log('DB synced.');

    // optional: seed default data
    await seed();

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
