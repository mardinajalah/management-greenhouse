import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const fallbackUrl = "mysql://root:root@localhost:3306/greenhouse_dashboard";
  const databaseUrl = process.env.DATABASE_URL || fallbackUrl;
  const parsedUrl = new URL(databaseUrl);
  const databaseName = parsedUrl.pathname.replace("/", "");

  if (!databaseName) {
    throw new Error("Nama database tidak ditemukan di DATABASE_URL.");
  }

  const connection = await mysql.createConnection({
    host: parsedUrl.hostname,
    port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await connection.end();

  console.log(`Database "${databaseName}" siap digunakan.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
