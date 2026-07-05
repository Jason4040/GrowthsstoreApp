import { useState } from "react";
import { useGetAdminFAQsQuery, useAnswerQuestionMutation } from "../../redux/api/faqApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import { HelpCircle } from "lucide-react";

const FAQAdmin = () => {
  const { data: questions = [], isLoading, error, refetch } = useGetAdminFAQsQuery();
  const [answerQuestion, { isLoading: submitting }] = useAnswerQuestionMutation();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAnswer = (q) => {
    setSelectedQuestion(q);
    setAnswerText(q.answer || "");
    setIsModalOpen(true);
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    try {
      await answerQuestion({ id: selectedQuestion._id, answer: answerText }).unwrap();
      toast.success("Answer successfully submitted and published to FAQ page!");
      setIsModalOpen(false);
      setAnswerText("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to submit answer");
    }
  };

  // Sort questions: unanswered first
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.isAnswered === b.isAnswered) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.isAnswered ? 1 : -1;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="text-orange-500" /> FAQ Manager
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review user questions, submit answers, and publish FAQ items directly to the public page.
        </p>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : sortedQuestions.length === 0 ? (
        <div className="bg-[#151515] p-10 text-center rounded-2xl border border-gray-800">
          <p className="text-gray-500 font-medium">No user questions submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedQuestions.map((q) => (
            <div
              key={q._id}
              className={`p-5 rounded-2xl border bg-[#151515] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md ${
                q.isAnswered
                  ? "border-gray-800/60 opacity-80"
                  : "border-orange-500/30 bg-orange-500/[0.01]"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white text-sm">
                    {q.user ? q.user.username : "Anonymous"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {q.user ? q.user.email : ""}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                  <div>
                    {q.isAnswered ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse">
                        Pending Answer
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-200 font-medium">
                  Q: "{q.question}"
                </div>

                {q.isAnswered && (
                  <div className="text-xs text-gray-400 bg-black/20 p-3 rounded-lg border border-gray-850 mt-2 font-sans">
                    <strong>Answer:</strong> {q.answer}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenAnswer(q)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0 transition-all active:scale-[0.98] ${
                  q.isAnswered
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
              >
                {q.isAnswered ? "Edit Answer" : "Answer"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2 flex items-center gap-2">
            <HelpCircle className="text-orange-500" /> Answer FAQ Question
          </h2>

          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <span className="text-[10px] uppercase text-gray-500 block font-semibold">User Question</span>
              <p className="font-semibold text-white mt-1 italic">
                "{selectedQuestion.question}"
              </p>
            </div>

            <div>
              <label htmlFor="answer" className="text-[10px] uppercase text-gray-500 block font-semibold mb-2">
                Your Answer (will be public on FAQ page)
              </label>
              <textarea
                id="answer"
                rows="4"
                placeholder="Type the answer details here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 border-t border-gray-800 pt-4">
            <button
              onClick={handleAnswerSubmit}
              disabled={submitting || !answerText.trim()}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {submitting ? "Submitting..." : "Submit & Publish"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FAQAdmin;
