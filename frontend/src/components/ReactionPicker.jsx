import { SmileIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function ReactionPicker({ onReactionSelect, currentUserReaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleReactionClick = (emoji) => {
    onReactionSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded hover:bg-slate-700/50 transition-colors ${
          currentUserReaction ? "text-cyan-400" : "text-slate-400"
        }`}
        title="Add reaction"
      >
        <SmileIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-2 flex gap-1 z-10">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              className="text-xl hover:bg-slate-700 rounded p-1 transition-colors"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReactionPicker;
