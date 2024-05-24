const express = require('express')
const router = express.Router()
const gemini = require("../controller/gemini")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', gemini.runChat)
router.get('/models', gemini.models)

router.post('/', gemini.runChatPost)

module.exports = router