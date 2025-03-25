# Easy-Rent Backend API

## Overview
This is the backend API for the Easy-Rent platform, an AI-powered real estate rental platform that connects landlords and tenants through natural language interaction.

## Features
- AI assistant for natural language queries
- Voice-to-text capability using OpenAI's Whisper API
- Role-based access system (public visitors, authenticated tenants, landlords, administrators)
- MongoDB database storing property and user information
- Google Maps integration showing property locations with navigation
- In-app messaging system between users
- AWS S3 integration for secure file storage

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- AWS S3
- OpenAI API
- Google Maps API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB instance
- AWS account with S3 bucket
- OpenAI API key
- Google Maps API key

### Environment Variables
Create a `.env` file in the root directory with the following variables:
PORT=5000
NODE_ENV=development
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=1d
AWS Configuration
AWS_REGION=<your-aws-region>
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
S3_BUCKET_NAME=<your-bucket-name>
OpenAI Configuration
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_PROJECT_ID=<your-openai-project-id>
Google Maps Configuration
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
CORS Configuration (for production)
CORS_ORIGIN=<your-frontend-domain>
Copy
### Installation
1. Clone the repository
git clone https://github.com/Erkebulan100/easy-rent-backend.git
cd easy-rent-backend
Copy
2. Install dependencies
npm install
Copy
3. Start the development server
npm run dev
Copy
## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/search` - Search properties with text
- `GET /api/properties/:id` - Get a single property
- `POST /api/properties` - Create a new property (landlords only)
- `PUT /api/properties/:id` - Update a property (owner or admin only)
- `DELETE /api/properties/:id` - Delete a property (owner or admin only)

### Messages
- `POST /api/messages` - Send a message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:userId` - Get conversation with specific user
- `PUT /api/messages/read/:senderId` - Mark messages as read
- `GET /api/messages/unread` - Get unread message count

### Location Services
- `POST /api/location/geocode` - Geocode an address
- `POST /api/location/reverse-geocode` - Reverse geocode coordinates

### AI Assistant
- `POST /api/ai/query` - Process natural language query
- `POST /api/ai/transcribe` - Transcribe audio to text

### File Upload
- `POST /api/uploads/property-image` - Upload property image (landlords only)
- `POST /api/uploads/document` - Upload user document
- `DELETE /api/uploads/file` - Delete a file

## Deployment
This application is configured for deployment on AWS Elastic Beanstalk.

### Deployment Steps
1. Install the AWS EB CLI
2. Initialize EB application: `eb init`
3. Create an environment: `eb create`
4. Deploy changes: `eb deploy`

## License
[MIT](LICENSE)
