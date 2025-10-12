import mysql from "mysql2/promise"

function getConfig() {
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env

  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
    throw new Error(
      "Missing MySQL environment variables. Please set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE in Vars.",
    )
  }

  return {
    host: MYSQL_HOST,
    port: MYSQL_PORT ? Number.parseInt(MYSQL_PORT, 10) : 3306,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    multipleStatements: false,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  }
}

export function getPool() {
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool(getConfig())
  }
  return global.__mysqlPool
}

export async function query(sql, params = []) {
  const pool = getPool()
  const [rows] = await pool.query(sql, params)
  return rows
}

export async function exec(sql, params = []) {
  const pool = getPool()
  const [result] = await pool.execute(sql, params)
  return result
}
