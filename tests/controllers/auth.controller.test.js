const authController = require('../../src/controllers/auth.controller');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../src/models/user.model');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token when login is successful', async () => {
        // Setup
        const req = {
          body: {
            email: 'test@example.com',
            password: 'password123'
          }
        };
        
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        
        const mockUser = {
          _id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'tenant',
          isValidPassword: jest.fn().mockResolvedValue(true)
        };
        
        User.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('fake-token');
        
        // Execute
        await authController.login(req, res);
        
        // Assert
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(mockUser.isValidPassword).toHaveBeenCalledWith('password123');
        expect(jwt.sign).toHaveBeenCalledWith(
          { id: 'user123', role: 'tenant' },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Login successful',
          token: 'fake-token',
          user: {
            id: 'user123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'tenant'
          }
        });
      });
      it('should return 400 when password is incorrect', async () => {
        // Setup
        const req = {
          body: {
            email: 'test@example.com',
            password: 'wrongpassword'
          }
        };
        
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        
        const mockUser = {
          _id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'tenant',
          isValidPassword: jest.fn().mockResolvedValue(false) // Password validation fails
        };
        
        User.findOne.mockResolvedValue(mockUser);
        
        // Execute
        await authController.login(req, res);
        
        // Assert
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(mockUser.isValidPassword).toHaveBeenCalledWith('wrongpassword');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        expect(jwt.sign).not.toHaveBeenCalled();
      });
  });
});