const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the person submitting the contact form.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the person submitting the contact form.
 *         phone:
 *           type: string
 *           description: The phone number of the person submitting the contact form (optional).
 *         topic:
 *           type: string
 *           description: The topic of the contact message (optional).
 *         message:
 *           type: string
 *           description: The content of the contact message.
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the contact message was submitted.
 */

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  topic: {
    type: String,
    required: false // Assuming topic selection is optional based on description structure
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 