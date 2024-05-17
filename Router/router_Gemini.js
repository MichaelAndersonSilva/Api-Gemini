const express = require('express')
const router = express.Router()
const gemini = require("../controller/gemini")

router.get('/', gemini.runChat)

router.post('/', gemini.runChatPost)
router.post('/test', gemini.test)

module.exports = router