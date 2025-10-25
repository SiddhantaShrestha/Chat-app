import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ChatContainer from "../components/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full md:max-w-6xl max-w-full h-[calc(100dvh-2rem)] md:h-[800px] px-2 md:px-0">
      <BorderAnimatedContainer>
        {/* LEFT: sidebar (show on mobile only when NO chat is open; always show on md+) */}
        <div
          className={`bg-slate-800/50 backdrop-blur-sm flex flex-col min-h-0 relative isolate z-0
            ${selectedUser ? "hidden md:flex md:w-80" : "flex w-full md:w-80"}`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 min-h-0">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT: chat pane (show on mobile only when a chat is open; on md+ show always) */}
        <div
          className={`bg-slate-900/50 backdrop-blur-sm min-h-0 relative isolate
            ${
              selectedUser
                ? "flex flex-1 flex-col"
                : "hidden md:flex md:flex-1 md:flex-col"
            }`}
        >
          {selectedUser ? (
            <ChatContainer />
          ) : (
            // Desktop placeholder only; hidden on mobile (so mobile sees only the list)
            <div className="hidden md:block">
              <NoConversationPlaceholder />
            </div>
          )}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default ChatPage;
