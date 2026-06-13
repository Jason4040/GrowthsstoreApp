import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AiOutlineSend,
  AiOutlinePaperClip,
  AiOutlineFile,
  AiOutlineLoading,
  AiOutlineMessage,
  AiOutlineUser,
} from "react-icons/ai";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetChatUsersQuery,
} from "../redux/api/messageApiSlice";
import { useUploadPaymentProofFileMutation } from "../redux/api/orderApiSlice";
import Loader from "../components/Loader";

const Messages = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // Selected user for admin chat
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInbox, setShowInbox] = useState(true);
  
  // Chat input states
  const [text, setText] = useState("");
  const [attachedFile, setAttachedFile] = useState(null); // { url, type }

  // API hooks
  const { data: chatUsers = [], isLoading: loadingUsers, refetch: refetchUsers } = useGetChatUsersQuery(undefined, {
    skip: !userInfo?.isAdmin,
  });

  const { data: messages = [], refetch: refetchMessages, isFetching: fetchingMessages } = useGetMessagesQuery(
    userInfo?.isAdmin ? selectedUser?._id : undefined,
    {
      skip: !userInfo || (userInfo.isAdmin && !selectedUser),
    }
  );

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [uploadFile, { isLoading: uploading }] = useUploadPaymentProofFileMutation();

  const messagesEndRef = useRef(null);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!userInfo) return;
    if (userInfo.isAdmin && !selectedUser) return;

    refetchMessages(); // Fetch immediately

    const interval = setInterval(() => {
      refetchMessages();
      if (userInfo.isAdmin) {
        refetchUsers();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser, userInfo, refetchMessages, refetchUsers]);

  // Scroll to bottom when messages load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // File type detection helpers
  const isImageFile = (url) => {
    return /\.(jpe?g|png|webp|gif)(?:\?|$)/i.test(url) || (url.includes("res.cloudinary.com") && !url.includes("/video/upload/") && !url.includes(".pdf") && !url.includes(".zip"));
  };

  const isVideoFile = (url) => {
    return /\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(url) || url.includes("/video/upload/");
  };

  // Upload attachment file handler
  const handleAttachFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadFile(formData).unwrap();
      const url = res.image;
      
      let fileType = "file";
      if (isImageFile(url)) {
        fileType = "image";
      } else if (isVideoFile(url)) {
        fileType = "video";
      }
      
      setAttachedFile({ url, type: fileType, name: file.name });
      toast.success("File attached successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "File upload failed");
    }
  };

  // Submit message handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !attachedFile) {
      return;
    }

    try {
      const payload = {
        text: text.trim(),
        fileUrl: attachedFile?.url || "",
        fileType: attachedFile?.type || "",
      };

      if (userInfo.isAdmin) {
        payload.recipientId = selectedUser._id;
      }

      await sendMessage(payload).unwrap();
      setText("");
      setAttachedFile(null);
      refetchMessages();
      if (userInfo.isAdmin) {
        refetchUsers();
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to send message");
    }
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center text-gray-400">Please log in to view messages.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-8 pb-[10rem] md:pb-8 max-w-[1200px]">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <AiOutlineMessage className="text-orange-500" /> Messages
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {userInfo.isAdmin
            ? "Manage and chat directly with your store clients."
            : "Chat directly with support regarding your orders and next steps."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-2xl h-[70vh] overflow-hidden shadow-2xl">
        {/* Admin Left Column: Users List */}
        {userInfo.isAdmin && (
          <div className={`col-span-1 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-white dark:bg-[#0c0c0c] ${showInbox ? "flex" : "hidden md:flex"}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Active Chats
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {loadingUsers ? (
                <div className="p-4 text-center"><Loader /></div>
              ) : chatUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No conversations yet.</div>
              ) : (
                chatUsers.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                      setShowInbox(false);
                    }}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      selectedUser?._id === user._id
                        ? "bg-orange-500/10 text-orange-500"
                        : "hover:bg-gray-100 dark:hover:bg-white/[0.02] text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold text-lg shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{user.username}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Right Column: Chat Box */}
        <div className={`flex flex-col h-full bg-white dark:bg-[#101010] ${userInfo.isAdmin ? "md:col-span-3" : "md:col-span-4"} ${!showInbox || !userInfo.isAdmin ? "flex" : "hidden md:flex"}`}>
          {userInfo.isAdmin && !selectedUser ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-gray-50 dark:bg-black/10">
              <AiOutlineMessage size={64} className="text-gray-600 dark:text-gray-700 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-250">No Conversation Selected</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-2">
                Select a client from the active chat panel to display correspondence and coordinate fulfillment.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#0c0c0c]">
                <div className="flex items-center gap-3">
                  {userInfo.isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowInbox(true)}
                      className="md:hidden mr-2 p-2 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-white rounded-xl transition-all text-xs font-semibold shrink-0"
                    >
                      ← Back
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold text-lg shrink-0">
                    {userInfo.isAdmin
                      ? selectedUser.username.charAt(0).toUpperCase()
                      : "A"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                      {userInfo.isAdmin ? selectedUser.username : "Growth Store Support (Admin)"}
                    </div>
                    <div className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Active Support
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#090909]/60">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-xs py-8 font-medium">
                    Say hello to start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.sender === userInfo._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3.5 rounded-2xl shadow-md ${
                            isOwnMessage
                              ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
                          }`}
                        >
                          {/* File Attachment Previews */}
                          {msg.fileUrl && (
                            <div className="mb-2.5 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30">
                              {msg.fileType === "image" ? (
                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={msg.fileUrl}
                                    alt="attachment"
                                    className="max-w-full max-h-[220px] object-contain mx-auto"
                                  />
                                </a>
                              ) : msg.fileType === "video" ? (
                                <video
                                  src={msg.fileUrl}
                                  controls
                                  className="max-w-full max-h-[220px]"
                                />
                              ) : (
                                <div className="flex items-center gap-3 p-3">
                                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                    <AiOutlineFile size={28} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold truncate text-gray-900 dark:text-white">
                                      Attachment File
                                    </div>
                                    <a
                                      href={msg.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-orange-500 hover:underline font-bold"
                                    >
                                      Download / View Document
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message Text */}
                          {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                          {/* Timestamp */}
                          <div className="text-[9px] text-right mt-1.5 opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] space-y-3"
              >
                {/* Upload Status / Attached file preview */}
                {attachedFile && (
                  <div className="flex items-center justify-between p-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg text-xs font-semibold">
                    <span className="flex items-center gap-1.5 truncate">
                      <AiOutlinePaperClip /> Attached: {attachedFile.name || "File ready"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="text-red-500 hover:text-red-400 font-bold ml-4"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="p-3 text-gray-500 hover:text-orange-500 transition-colors bg-gray-50 hover:bg-orange-500/5 dark:bg-[#151515] rounded-xl cursor-pointer shrink-0 border border-gray-200 dark:border-gray-800">
                    {uploading ? (
                      <AiOutlineLoading className="animate-spin text-orange-500" size={20} />
                    ) : (
                      <AiOutlinePaperClip size={20} />
                    )}
                    <input
                      type="file"
                      onChange={handleAttachFile}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={sending || (!text.trim() && !attachedFile)}
                    className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl disabled:opacity-50 transition-all shrink-0 active:scale-[0.98]"
                  >
                    <AiOutlineSend size={20} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
