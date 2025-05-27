/**
 * @file This file defines the contact form submission and retrieval routes.
 * @module routes/contactRoutes
 */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Contact = require('../models/contactModel');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const config = require('../config');

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
}); // Nodemailer transporter setup using config values

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

/**
 * Rate limiting middleware for contact form submissions.
 * Limits each IP to 10 requests per 15 minutes.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many contact form submissions from this IP, please try again after 15 minutes',
});

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a new contact form message.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact form submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact form submitted successfully!
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid input, or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: Error message.
 *                       param:
 *                         type: string
 *                         description: Parameter that caused the error.
 *                       location:
 *                         type: string
 *                         description: Location of the parameter (e.g., body).
 *       429:
 *         description: Too many requests from this IP.
 *       500:
 *         description: Server error.
 */
// API endpoint to handle contact form submission
router.post(
  '/',
  contactLimiter,
  [
    // Validation and sanitization middleware
    check('name').trim().notEmpty().withMessage('Name is required').escape(),
    check('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    check('phone').optional().trim().escape(),
    check('topic').optional().trim().escape(),
    check('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message can be at most 1000 characters long').escape(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, topic, message } = req.body;

      const newContact = new Contact({
        name,
        email,
        phone,
        topic,
        message
      });

      await newContact.save();

      // Send confirmation email to the user
      const mailOptions = {
        from: config.emailUser, // Use emailUser from config
        to: email,
        subject: 'Contact Form Submission Confirmation',
        text: `Thank you for contacting us, ${name}!\n\nWe have received your message and will get back to you shortly.\n\nYour message details:\nTopic: ${topic || 'N/A'}\nMessage: ${message}\n\nBest regards,\nThe Contact Us Team`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending confirmation email:', error);
        } else {
          console.log('Confirmation email sent:', info.response);
        }
      });

      res.status(201).json({ message: 'Contact form submitted successfully!', contact: newContact });

    } catch (error) {
      console.error('Error saving contact form:', error);
      res.status(500).json({ message: 'Failed to submit contact form.', error: error.message });
    }
  }
);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Retrieve all contact form messages.
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: A list of contact messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Server error.
 */
// API endpoint to get all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Failed to retrieve contact messages.', error: error.message });
  }
});

module.exports = router; 