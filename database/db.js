const sql = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()

const db = sql.createPool({
    host: mysql.railway.internal,
    user: root,
    password: PPZYYBtlQkSjNPBjVvNxeFxMNeQCRAaK,
    database: railway
})

async function testconnection() {
    try {
        await db.getConnection()
        console.log("Database connected");
    } catch (error) {
        console.log("Connection failed", error)
    }
}

async function query(command, value) {
    try {
        const [value] = await db.query(command, value ?? [])
        return value
    } catch (error) {
        console.log(error)
    }
}

module.exports = { testconnection, query }