import mongoose from "mongoose";
import connectDB from "./config/db.js";
import FAQQuestion from "./models/faqModel.js";
import User from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const defaultFAQs = [
    {
      question: "What happens after I place an order?",
      answer: "Once you place an order, it will be registered in your account under pending orders. You will see a 'Pay Now (Mobile Money)' button on your order details page to make a manual mobile money payment.",
    },
    {
      question: "How do I upload my proof of payment?",
      answer: "Click the 'Pay Now' button on your order details page. A modal will pop up displaying the mobile money transfer details based on your location/currency. Make the payment, click 'Choose File' to upload your receipt, screenshot, or payment SMS proof, and click 'Submit Proof' to send it to the admin.",
    },
    {
      question: "How long does it take for a product to reach the customer?",
      answer: "Delivery times vary depending on your location. Standard local delivery within Rwanda or Uganda usually takes 24 to 48 hours after payment approval. International shipping may take 5 to 7 business days. You can coordinate precise delivery times directly with the admin via chat.",
    },
    {
      question: "How long does payment verification take?",
      answer: "Our administrators verify payment proofs as quickly as possible. Once the admin reviews and evaluates your proof, you will receive an automated email notification confirming whether your payment has been approved or rejected.",
    },
    {
      question: "What happens after my payment is approved?",
      answer: "Upon payment approval, you will receive a confirmation email. Furthermore, if you are viewing the order page, you will be automatically redirected to the Support Chat page to discuss fulfillment. A 'Messages' icon will also be added to your sidebar menu.",
    },
    {
      question: "What should I do if my payment proof is rejected?",
      answer: "If your payment is rejected, you will receive an email alert. You can visit the order details page to resubmit a new proof file, or file an appeal explaining the issue if you have already been charged.",
    },
    {
      question: "How do I appeal a payment rejection?",
      answer: "If you have already paid but your proof was rejected, go to the order details page. In the 'Appeal Payment Rejection' section, write a description (including transaction IDs, dates, or payment numbers) and click 'Submit Appeal'. The admin will be notified to re-evaluate your payment.",
    },
    {
      question: "How do I chat directly with the admin?",
      answer: "Direct chat is unlocked once you have at least one approved payment. You can access it by clicking the 'Messages' icon in the sidebar or mobile bottom navigation menu to exchange text, documents, images, and videos with the administrator.",
    },
    {
      question: "How is delivery coordinated?",
      answer: "Once paid, you chat with the admin in the 'Messages' section to organize standard shipping, local delivery, or pickup arrangements. The admin will update the delivery status to 'Mark As Delivered' once you receive your items.",
    },
];

const seedFaqs = async () => {
    try {
        await connectDB();
        
        let admin = await User.findOne({ isAdmin: true });
        if (!admin) {
            admin = await User.findOne({});
            if (!admin) {
                console.log("No user found in database. Create a user first.");
                process.exit(1);
            }
        }
        
        console.log("Inserting default FAQs...");
        const faqsToInsert = defaultFAQs.map(faq => ({
            user: admin._id,
            question: faq.question,
            answer: faq.answer,
            isAnswered: true
        }));
        
        await FAQQuestion.insertMany(faqsToInsert);
        console.log("FAQs seeded successfully.");
        process.exit();
    } catch (error) {
        console.error("Error seeding FAQs:", error);
        process.exit(1);
    }
}

seedFaqs();
