const bcrypt = require('bcrypt');
const { User, Part } = require('../models');

module.exports = async function seed() {
  // create admin user if not exists
  const adminEmail = 'admin@auto.com';
  const exists = await User.findOne({ where: { email: adminEmail } });
  if (!exists) {
    const hash = await bcrypt.hash('password123', 10);
    await User.create({ name: 'Admin', email: adminEmail, password_hash: hash });
    console.log('Admin user created: admin@auto.com / password123');
  }

  const partsCount = await Part.count();
  if (partsCount === 0) {
    await Part.bulkCreate([
      { name: 'Brake Pad', brand: 'Brembo', price: 29.99, stock: 120, category: 'Brakes' },
      { name: 'Oil Filter', brand: 'Bosch', price: 9.5, stock: 340, category: 'Engine' },
      { name: 'Air Filter', brand: 'K&N', price: 19.0, stock: 200, category: 'Engine' },
      { name: 'Spark Plug', brand: 'NGK', price: 5.5, stock: 500, category: 'Ignition' }      
    ]);
    console.log('Seeded parts.');
  }
};
