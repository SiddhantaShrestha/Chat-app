import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import ReactionPicker from "./ReactionPicker";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    subscribeToReactions,
    unsubscribeFromReactions,
    toggleReaction,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    subscribeToTyping();
    subscribeToReactions();
    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
      unsubscribeFromReactions();
    };
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToTyping,
    unsubscribeFromTyping,
    subscribeToReactions,
    unsubscribeFromReactions,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isSelectedUserTyping =
    selectedUser?._id && typingUsers[selectedUser._id];

  const handleReactionSelect = (messageId, emoji) => {
    toggleReaction(messageId, emoji);
  };

  const getUserReaction = (message) => {
    if (!message.reactions) return null;
    const reaction = message.reactions.find(
      (r) => r.userId === authUser._id
    );
    return reaction?.emoji || null;
  };

  const getReactionCounts = (message) => {
    if (!message.reactions || message.reactions.length === 0) return null;
    
    const counts = {};
    message.reactions.forEach((reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    return counts;
  };

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-3 md:px-6 overflow-y-auto py-4 md:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const reactionCounts = getReactionCounts(msg);
              const currentUserReaction = getUserReaction(msg);
              
              return (
                <div
                  key={msg._id}
                  className={`chat ${
                    msg.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className={`flex flex-col gap-1 ${
                    msg.senderId === authUser._id ? "items-end" : "items-start"
                  }`}>
                    <div
                      className={`chat-bubble relative max-w-[85%] md:max-w-[75%] break-words ${
                        msg.senderId === authUser._id
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg h-40 md:h-48 object-cover w-full"
                        />
                      )}
                      {msg.text && <p className="mt-2">{msg.text}</p>}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs opacity-75 flex items-center gap-1">
                          {msg.isOptimistic ? (
                            <span className="italic text-slate-300 animate-pulse">
                              Sending...
                            </span>
                          ) : (
                            new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          )}
                        </p>
                        {!msg.isOptimistic && (
                          <ReactionPicker
                            onReactionSelect={(emoji) =>
                              handleReactionSelect(msg._id, emoji)
                            }
                            currentUserReaction={currentUserReaction}
                          />
                        )}
                      </div>
                    </div>

                    {reactionCounts && (
                      <div className="flex flex-wrap gap-1 px-2">
                        {Object.entries(reactionCounts).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReactionSelect(msg._id, emoji)}
                            className={`text-sm px-2 py-0.5 rounded-full border transition-all ${
                              currentUserReaction === emoji
                                ? "bg-cyan-600/20 border-cyan-500"
                                : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                            }`}
                          >
                            {emoji} {count > 1 && count}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSelectedUserTyping && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-1 py-1">
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          selectedUser && (
            <NoChatHistoryPlaceholder name={selectedUser.fullName} />
          )
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
