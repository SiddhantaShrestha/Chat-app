import { useState, useRef } from "react";
import {
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  LoaderIcon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound =
  typeof Audio !== "undefined" ? new Audio("/sounds/mouse-click.mp3") : null;

function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfileImage } =
    useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-4 md:p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="avatar online shrink-0">
            <button
              className="size-12 md:size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingProfileImage}
            >
              {isUpdatingProfileImage ? (
                <LoaderIcon className="w-full h-5 animate-spin text-center" />
              ) : (
                <div>
                  <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="User image"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">Change</span>
                  </div>
                </div>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        <div className="flex gap-3 md:gap-4 items-center">
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              if (mouseClickSound) {
                mouseClickSound.currentTime = 0;
                mouseClickSound.play().catch(() => {});
              }
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
