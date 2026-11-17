/**
 * Creates the database + tables (safe to run again) and adds starter users.
 *
 *   npm run migrate            → create anything that's missing, add starter users if there are none
 *   npm run migrate -- --demo  → also add a few sample accounts and transactions
 *   npm run migrate:fresh      → ⚠ DROPS every table first, then rebuilds (all data is lost)
 *
 * Already imported config/bank_app_full.sql from your PHP project? You don't need to run this at all.
 */
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { DB } from "./models/db.js";
import { sequelize, User, Account, AccountHolder, BankTransaction } from "./models/index.js";

const fresh = process.argv.includes("--fresh");
const demo = process.argv.includes("--demo");

try {
  const conn = await mysql.createConnection({ host: DB.host, port: DB.port, user: DB.user, password: DB.pass });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
  console.log(`✅ Database "${DB.name}" is ready.`);

  await sequelize.authenticate();
  await sequelize.sync({ force: fresh });
  console.log(fresh ? "✅ Tables dropped and rebuilt." : "✅ Tables are up to date.");

  if ((await User.count()) === 0) {
    const starters = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "user1", password: "user123", role: "user" },
      { username: "guest", password: "guest123", role: "guest" },
    ];
    for (const u of starters) await User.create({ ...u, password: await bcrypt.hash(u.password, 10) });
    console.log("✅ Starter users created (change these passwords after signing in!):");
    starters.forEach((u) => console.log(`     ${u.role.padEnd(5)}  ${u.username} / ${u.password}`));
  } else {
    console.log("ℹ️  Users already exist — leaving them alone.");
  }

  if (demo && (await Account.count()) === 0) {
    const sample = [
      ["ACC-10001", "1234", 5000, "active", "Maria Santos", "maria@example.com", "09171234567", "Calapan City"],
      ["ACC-10002", "1234", 12500.5, "active", "Juan Dela Cruz", "juan@example.com", "09181234567", "Roxas, Oriental Mindoro"],
      ["ACC-10003", "1234", 750, "inactive", "Ana Reyes", null, null, null],
      ["ACC-10004", "1234", 320, "suspended", "Pedro Lim", null, "09191234567", null],
    ];
    for (const [num, pin, bal, status, name, email, phone, addr] of sample) {
      const a = await Account.create({ AccountNumber: num, PIN: await bcrypt.hash(pin, 10), TotalBalance: bal, status });
      await AccountHolder.create({ account_id: a.id, full_name: name, email, phone, address: addr });
    }
    const first = await Account.findOne({ where: { AccountNumber: "ACC-10001" } });
    await BankTransaction.bulkCreate([
      { account_id: first.id, type: "deposit", amount: 1000, description: "Salary" },
      { account_id: first.id, type: "withdrawal", amount: 250, description: "Groceries" },
      { account_id: first.id, type: "transfer", amount: 100, description: "Rent share" },
    ]);
    console.log("✅ Sample accounts and transactions added.");
  }
} catch (err) {
  console.error("❌ Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await sequelize.close().catch(() => {});
}
