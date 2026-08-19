require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/pool');
const userRepository = require('../src/repositories/user.repository');

const run = async () => {
  const email = process.env.SEED_ADMIN_EMAIL;
  const existing = await userRepository.findByEmail(email);

  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10);

  await userRepository.create({
    name: process.env.SEED_ADMIN_NAME,
    email,
    passwordHash,
    address: process.env.SEED_ADMIN_ADDRESS,
    role: 'ADMIN'
  });

  console.log(`Admin account created: ${email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
