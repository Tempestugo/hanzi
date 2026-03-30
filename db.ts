/**
 * server/db.ts
 * Conexão com MySQL da Hostinger via mysql2
 *
 * Variáveis de ambiente necessárias (.env):
 *   DB_HOST     — geralmente "localhost" na Hostinger
 *   DB_USER     — usuário criado no hPanel > Databases
 *   DB_PASSWORD — senha do usuário do banco
 *   DB_NAME     — nome do banco criado no hPanel
 *   DB_PORT     — 3306 (padrão MySQL)
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? "localhost",
  user:               process.env.DB_USER     ?? "",
  password:           process.env.DB_PASSWORD ?? "",
  database:           process.env.DB_NAME     ?? "",
  port:               Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit:    10,       // conexões simultâneas máximas
  queueLimit:         0,
  charset:            "utf8mb4",
  timezone:           "Z",
});

// Testa a conexão ao iniciar
pool.getConnection()
  .then((conn) => {
    console.log("✅ MySQL conectado com sucesso");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Falha na conexão MySQL (Verifique o arquivo .env na Hostinger):", err.message);
  });

export default pool;
