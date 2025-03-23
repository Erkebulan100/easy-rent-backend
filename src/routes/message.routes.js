const express = require('express');
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

// All message routes require authentication
router.use(auth);

// Send a new message
router.post('/', messageController.sendMessage);

// Get all conversations for the current user
router.get('/conversations', messageController.getMyConversations);

// Get conversation with a specific user
router.get('/conversations/:userId', messageController.getConversation);

// Mark messages from a specific sender as read
router.put('/read/:senderId', messageController.markAsRead);

// Get unread message count
router.get('/unread/count', messageController.getUnreadCount);

module.exports = router;