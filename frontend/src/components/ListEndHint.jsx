import { MessageCircleIcon } from "lucide-react";

const ListEndHint = () => {
  return (
    <div className="mt-2 rounded-xl border border-slate-700/40 bg-slate-800/30 px-4 py-3 text-center">
      <div className="inline-flex items-center gap-2 text-slate-300">
        <MessageCircleIcon className="w-4 h-4" />
        <span className="text-sm">Select a conversation to start chatting</span>
      </div>
    </div>
  );
};

export default ListEndHint;
