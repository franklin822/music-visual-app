require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// create upload folders if they don't exist
fs.mkdirSync(path.join(__dirname, 'uploads/audio'), { recursive: true })
fs.mkdirSync(path.join(__dirname, 'uploads/art'), { recursive: true })

app.use(cors())

// only parse JSON if the request actually declares a JSON body
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || ''
  if (contentType.includes('application/json')) {
    express.json()(req, res, next)
  } else {
    next()
  }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/songs', require('./routes/songs'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))