const Mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const db = Mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.DB_PORT,
  password: "",
  database: process.env.DATABASE,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function testConnection() {
  try {
    await db.getConnection();
    console.log("Koneksi ke database berhasil!!!");
  } catch (error) {
    console.log("koneksi gagal", error);
  }
}

async function query(query, value) {
  try {
    const [excekuteQuery] = await db.query(query, value ?? []);
    return excekuteQuery;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  testConnection,
  query,
};