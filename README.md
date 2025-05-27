# Contact Form Backend API

A secure and scalable backend service for handling contact form submissions and email notifications.

## Features

- RESTful API endpoints for contact form submissions
- Automatic email notifications
- Form validation and sanitization
- Rate limiting to prevent abuse
- Secure MongoDB data storage
- Comprehensive error handling
- Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- Nodemailer email service credentials
- Environment variables configuration

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contact-form
EMAIL_SERVICE=your-email-service
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Configuration

The backend uses a configuration file (`config/index.js`) that can be overridden by environment variables:

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `EMAIL_SERVICE`: Email service provider
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password

## API Endpoints

### POST /contact

Submit a new contact form entry.

#### Request Body
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",     // Optional
  "topic": "string",     // Optional
  "message": "string"
}
```

#### Response
```json
{
  "message": "Contact form submitted successfully",
  "data": {
    "_id": "mongodb-id",
    "name": "string",
    "email": "string",
    "phone": "string",
    "topic": "string",
    "message": "string",
    "date": "timestamp"
  }
}
```

## Error Responses

All errors return a JSON object with the following structure:
```json
{
  "message": "Error description",
  "errors": ["array of error messages"]
}
```

## Security Features

- Input validation using express-validator
- Rate limiting to prevent abuse
- Security headers using Helmet
- CORS configuration
- Environment-based configuration
- MongoDB data protection

## Running the Server

```bash
# Start the server
npm start

# Start in development mode
npm run dev
```

The server will start on the configured port (default: 5000).

## Testing

To test the API endpoints, you can use tools like Postman or curl. Here's an example using curl:

```bash
curl -X POST http://localhost:5000/contact \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john@example.com", "message": "Test message"}'
```

## Environment Variables

All configuration can be overridden using environment variables:

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `EMAIL_SERVICE`: Email service provider
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License(IGNORE)

This project is licensed under the MIT License - see the LICENSE file for DETAILS .
