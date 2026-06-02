import "dotenv/config";
import mysql from "mysql2/promise";
import { hashPassword } from "../src/lib/password";

async function main() {
  const databaseUrl = process.env.DATABASE_URL || "mysql://root:root@localhost:3306/greenhouse_dashboard";
  const passwordHash = hashPassword("admin");
  const connection = await mysql.createConnection(databaseUrl);

  await connection.execute(
    `
      INSERT INTO users
        (name, email, username, password_hash, phone, role, is_active)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        username = VALUES(username),
        password_hash = VALUES(password_hash),
        phone = VALUES(phone),
        role = VALUES(role),
        is_active = VALUES(is_active),
        updated_at = CURRENT_TIMESTAMP
    `,
    ["admin", "admin", "admin", passwordHash, "admin", "admin", true],
  );

  await connection.end();

  console.log('Admin default siap. Login pakai username/email "admin" dan password "admin".');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
