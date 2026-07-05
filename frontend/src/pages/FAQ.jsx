import { useState } from "react";
import { useSelector } from "react-redux";
import { HelpCircle, ChevronDown, Home, Send } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetPublicFAQsQuery,
  useGetMyFAQsQuery,
  useAskQuestionMutation,
} from "../redux/api/faqApiSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const FAQ = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [openIndex, setOpenIndex] = useState(null);
  const [questionText, setQuestionText] = useState("");

  // Queries
  const { data: publicFAQs = [], isLoading: loadingPublic } = useGetPublicFAQsQuery();
  const { data: myFAQs = [], refetch: refetchMyFAQs } = useGetMyFAQsQuery(undefined, {
    skip: !userInfo,
  });

  const [askQuestion, { isLoading: submittingQuestion }] = useAskQuestionMutation();

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

  // Combine default FAQs with public dynamic FAQs
  const allFAQs = [
    ...defaultFAQs,
    ...publicFAQs.map((item) => ({
      question: item.question,
      answer: item.answer,
      isDynamic: true,
    })),
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    try {
      await askQuestion({ question: questionText }).unwrap();
      toast.success("Question submitted successfully! Admin will answer shortly.");
      setQuestionText("");
      if (refetchMyFAQs) refetchMyFAQs();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Submission failed");
    }
  };

  return (
    <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-8 max-w-[800px]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="text-orange-500" /> Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Find answers to common questions about shipping times, payment methods, verification, and appeals.
          </p>
        </div>
        <Link
          to="/"
          className="text-gray-400 hover:text-orange-500 p-2 border border-gray-800 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
        >
          <Home size={16} /> Home
        </Link>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {loadingPublic ? (
          <div className="text-center py-6"><Loader /></div>
        ) : (
          allFAQs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "bg-orange-500/5 border-orange-500/30 shadow-lg"
                    : "bg-[#101010] border-gray-800 hover:border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 focus:outline-none transition-colors"
                >
                  <span className={`font-semibold text-sm md:text-base ${isOpen ? "text-orange-500" : "text-white"}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-orange-500" : ""}`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[250px] border-t border-gray-800/60" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-sm leading-relaxed text-gray-300 bg-black/10">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ask a Question Section (Only for registered users) */}
      {userInfo ? (
        <div className="mt-12 p-6 border border-gray-800 rounded-2xl bg-[#101010] space-y-4 shadow-xl">
          <div>
            <h3 className="font-semibold text-white text-base">Ask a Custom Question</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Can't find the answer you need? Submit your question below, and the admin will review and answer it directly.
            </p>
          </div>

          <form onSubmit={handleAsk} className="flex gap-3">
            <textarea
              rows="2"
              placeholder="Type your question here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="flex-1 bg-black border border-gray-800 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
              required
            />
            <button
              type="submit"
              disabled={submittingQuestion || !questionText.trim()}
              className="px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex flex-col items-center justify-center gap-1 shrink-0"
            >
              <Send size={18} />
              <span className="text-[10px] font-semibold">Send</span>
            </button>
          </form>

          {/* User's asked questions status */}
          {myFAQs.length > 0 && (
            <div className="border-t border-gray-850 pt-4 mt-4 space-y-3">
              <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">Your Questions Status</h4>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {myFAQs.map((item) => (
                  <div key={item._id} className="p-3 rounded-xl bg-black border border-gray-800">
                    <div className="text-xs font-semibold text-white">{item.question}</div>
                    {item.isAnswered ? (
                      <div className="mt-2 text-xs text-orange-500 bg-orange-500/5 p-2 rounded-lg border border-orange-500/10">
                        <strong>Answer:</strong> {item.answer}
                      </div>
                    ) : (
                      <div className="mt-1 text-[10px] text-yellow-500 flex items-center gap-1 font-semibold animate-pulse">
                        ● Awaiting administrator answer
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-12 text-center p-6 border border-gray-800 rounded-2xl bg-[#101010]">
          <h4 className="font-semibold text-white text-sm">Have a custom question?</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Create an account or login to ask questions directly to our support administration.
          </p>
          <Link
            to="/login"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs py-2.5 px-6 rounded-xl transition-all active:scale-[0.98]"
          >
            Login to Ask
          </Link>
        </div>
      )}
    </div>
  );
};

export default FAQ;
