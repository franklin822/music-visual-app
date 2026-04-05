const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { getAllSongs, addSong } = require('../controllers/songs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'audio' ? 'uploads/audio' : 'uploads/art'
    cb(null, path.join(__dirname, '..', folder))
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname
    cb(null, unique)
  }
})

const upload = multer({ storage })

router.get('/', getAllSongs)
router.post('/', upload.fields([{ name: 'audio' }, { name: 'albumArt' }]), addSong)

module.exports = router