const express = require('express');
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - recipient
 *         - content
 *       properties:
 *         sender:
 *           type: string
 *           description: ID of the user sending the message
 *         recipient:
 *           type: string
 *           description: ID of the user receiving the message
 *         content:
 *           type: string
 *           description: Content of the message
 *         property:
 *           type: string
 *           description: ID of the property related to the message (optional)
 *         read:
 *           type: boolean
 *           default: false
 *           description: Whether the message has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the message was sent
 */

// All message routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID of the message recipient
 *               content:
 *                 type: string
 *                 description: Message content
 *               propertyId:
 *                 type: string
 *                 description: ID of the related property (optional)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Recipient not found
 */
// Send a new message
router.post('/', messageController.sendMessage);

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get all conversations for the current user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Not authenticated
 */
// Get all conversations for the current user
router.get('/conversations', messageController.getMyConversations);

/**
 * @swagger
 * /api/messages/conversations/{userId}:
 *   get:
 *     summary: Get conversation with a specific user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get conversation with
 *     responses:
 *       200:
 *         description: Conversation messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 */
// Get conversation with a specific user
router.get('/conversations/:userId', messageController.getConversation);

/**
 * @swagger
 * /api/messages/read/{senderId}:
 *   put:
 *     summary: Mark messages from a specific sender as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sender whose messages to mark as read
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authenticated
 */
// Mark messages from a specific sender as read
router.put('/read/:senderId', messageController.markAsRead);

/**
 * @swagger
 * /api/messages/unread/count:
 *   get:
 *     summary: Get unread message count
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread message count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *       401:
 *         description: Not authenticated
 */
// Get unread message count
router.get('/unread/count', messageController.getUnreadCount);

module.exports = router;