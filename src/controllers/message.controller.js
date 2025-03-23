const Message = require('../models/message.model');
const User = require('../models/user.model');

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, propertyId } = req.body;
    
    // Check if recipient exists
    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }
    
    // Create new message
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      property: propertyId || null
    });
    
    await message.save();
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate that the specified user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Find messages between the authenticated user and the specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    }).sort({ createdAt: 'asc' });
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all conversations for the current user
exports.getMyConversations = async (req, res) => {
  try {
    // Get all unique users that the current user has exchanged messages with
    const sentMessages = await Message.find({ sender: req.user._id })
      .distinct('recipient');
    
    const receivedMessages = await Message.find({ recipient: req.user._id })
      .distinct('sender');
    
    // Combine and remove duplicates
    const conversationUserIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get the most recent message for each conversation
    const conversations = [];
    
    for (const userId of conversationUserIds) {
      const latestMessage = await Message.findOne({
        $or: [
          { sender: req.user._id, recipient: userId },
          { sender: userId, recipient: req.user._id }
        ]
      })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .populate('property', 'title');
      
      if (latestMessage) {
        conversations.push(latestMessage);
      }
    }
    
    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    
    // Update all unread messages from sender to recipient
    const result = await Message.updateMany(
      { 
        sender: senderId,
        recipient: req.user._id,
        read: false
      },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });
    
    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};