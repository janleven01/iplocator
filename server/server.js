import express from "express"
import mysql from "mysql"
import cors from "cors"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3306,
})

db.connect((err) => {
  if (err) {
    console.log("Failed to connect:", err)
    return
  }
  console.log("Successfully connect to db")
})

// get ip location
const IPINFO_TOKEN = process.env.API_KEY
app.get("/ip-location", async (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress

    const ip = req.query.ip || clientIp

    const response = await fetch(
      `https://ipinfo.io/${ip}/geo?token=${IPINFO_TOKEN}`
    )
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

    const locationData = await response.json()
    res.json(locationData)
  } catch (error) {
    console.error("Error fetching IP location:", error)
    res.status(500).json({ error: "Failed to fetch location data" })
  }
})

// check user credentials
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const sql = "SELECT * FROM users WHERE email = ?"
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log("Failed to retrieve user:", err)
      return res.status(500).json({ message: "Internal Server Error" })
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const user = results[0]
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    res.json({ message: "Login successful", user })
  })
})

// store IP address & geo
app.post("/store-ip/:username", async (req, res) => {
  const { ip, city, country, hostname, loc, postal, region, timezone } =
    req.body
  const { username } = req.params

  const sql = `
  INSERT INTO ip_history (username, ip, city, country, hostname, loc, postal, region, timezone)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`
  db.query(
    sql,
    [username, ip, city, country, hostname, loc, postal, region, timezone],
    (err, results) => {
      if (err) {
        console.log("Failed to store IP address:", err)
        return res.status(500).json({ message: "Internal Server Error" })
      }

      res.status(201).json({ message: "IP address stored successfully" })
    }
  )
})

// get IP History by username
app.get("/ip-history/:username", async (req, res) => {
  const { username } = req.params
  const sql = `
    SELECT * FROM ip_history WHERE username = ?
    ORDER BY id ASC
  `

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Failed to retrieve IP history:", err)
      return res.status(500).json({ message: "Internal Server Error" })
    }

    if (results.length > 0) {
      res.json(results)
    } else {
      res.status(404).json({ message: "No IP history found for this user." })
    }
  })
})

// delete ip history by ID
app.delete("/ip-history/:username/:id", (req, res) => {
  const sql = "DELETE FROM ip_history WHERE ID = ?"
  const { id } = req.params

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Error deleting student:", err)
      return res.status(500).json({ message: "Failed to delete student." })
    }
    return res.json(result)
  })
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})
