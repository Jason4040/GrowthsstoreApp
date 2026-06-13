import FAQQuestion from "../models/faqModel.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Submit a new question
// @route   POST /api/faq/ask
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question content is required." });
    }

    const newQuestion = new FAQQuestion({
      user: req.user._id,
      question: question.trim(),
    });

    const savedQuestion = await newQuestion.save();

    // Send confirmation email to client
    sendEmail({
      to: req.user.email,
      subject: "We received your question! - Growth Shop FAQ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #dd6b20; font-size: 28px; margin: 0;">Question Received</h2>
            <p style="font-size: 14px; color: #718096; margin-top: 4px;">FAQ Support</p>
          </div>
          <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
            <p>Hello <strong>${req.user.username}</strong>,</p>
            <p>We have successfully received your question. Our support team will review it and provide an answer shortly. Once answered, you will be notified by email and the Q&A will be published on the FAQ page.</p>
            <p><strong>Your Question:</strong></p>
            <blockquote style="border-left: 4px solid #dd6b20; padding-left: 16px; font-style: italic; color: #4a5568; margin: 16px 0;">
              "${question.trim()}"
            </blockquote>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
            <p>© ${new Date().getFullYear()} Growth Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }).catch(err => console.error("Client ask FAQ email failed:", err));

    // Send email alert to admin
    sendEmail({
      to: "jaygrowth01@gmail.com",
      subject: `New User FAQ Question Asked`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #e53e3e; font-size: 28px; margin: 0;">New FAQ Question</h2>
            <p style="font-size: 14px; color: #718096; margin-top: 4px;">Attention Required</p>
          </div>
          <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
            <p>User <strong>${req.user.username}</strong> (${req.user.email}) has asked a new question:</p>
            <blockquote style="border-left: 4px solid #e53e3e; padding-left: 16px; font-style: italic; color: #4a5568; margin: 16px 0;">
              "${question.trim()}"
            </blockquote>
            <p>Please log in to the admin panel to provide an answer.</p>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="http://localhost:5173/admin/faqmanager" style="display: inline-block; background-color: #e53e3e; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">Answer Question</a>
          </div>
        </div>
      `
    }).catch(err => console.error("Admin ask FAQ alert email failed:", err));

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Answer a question
// @route   PUT /api/faq/:id/answer
// @access  Private/Admin
const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ message: "Answer content is required." });
    }

    const faq = await FAQQuestion.findById(req.params.id);

    if (faq) {
      faq.answer = answer.trim();
      faq.isAnswered = true;
      const updatedFaq = await faq.save();
      await updatedFaq.populate("user", "username email");

      // Send answer email to client
      sendEmail({
        to: updatedFaq.user.email,
        subject: "Your Question Has Been Answered! - Growth Shop FAQ",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #38a169; font-size: 28px; margin: 0;">Question Answered!</h2>
              <p style="font-size: 14px; color: #718096; margin-top: 4px;">FAQ Support</p>
            </div>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
              <p>Hello <strong>${updatedFaq.user.username}</strong>,</p>
              <p>Your question has been answered by the administrator! Here are the details:</p>
              <p><strong>Question:</strong></p>
              <p style="font-style: italic; color: #718096;">"${faq.question}"</p>
              <p><strong>Answer:</strong></p>
              <blockquote style="border-left: 4px solid #38a169; padding-left: 16px; font-weight: bold; color: #2d3748; margin: 16px 0;">
                "${answer.trim()}"
              </blockquote>
              <p>This Q&A is now publicly visible on our FAQ page.</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="http://localhost:5173/faq" style="display: inline-block; background-color: #38a169; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">View FAQ Page</a>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
              <p>© ${new Date().getFullYear()} Growth Shop. All rights reserved.</p>
            </div>
          </div>
        `
      }).catch(err => console.error("Client FAQ answer notification email failed:", err));

      res.json(updatedFaq);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get client's asked questions
// @route   GET /api/faq/my-questions
// @access  Private
const getMyQuestions = async (req, res) => {
  try {
    const questions = await FAQQuestion.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all questions for admin
// @route   GET /api/faq/admin/questions
// @access  Private/Admin
const getAdminQuestions = async (req, res) => {
  try {
    const questions = await FAQQuestion.find({}).populate("user", "username email").sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all public answered FAQs
// @route   GET /api/faq/public
// @access  Public
const getPublicFAQs = async (req, res) => {
  try {
    const faqs = await FAQQuestion.find({ isAnswered: true }).populate("user", "username").sort({ updatedAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  askQuestion,
  answerQuestion,
  getMyQuestions,
  getAdminQuestions,
  getPublicFAQs,
};
