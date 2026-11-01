import { Sparkles } from "lucide-react";
import SearchDropdown from "./SearchDropdown";
import UserProfileMenu from "./UserProfileMenu";
import NotificationsMenu from "./NotificationsMenu";

export default function Topbar({ onOpenAI, tasks, onTaskClick }) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 relative z-40">
      {/* Левая часть: Проект */}
      <div className="flex items-center gap-4">
        <button className="text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <span className="text-gray-400">◈</span> Платформа 2.0
        </button>
      </div>

      {/* Правая часть: Поиск, ИИ, Аватар */}
      <div className="flex items-center gap-4">
        <SearchDropdown tasks={tasks} onTaskClick={onTaskClick} />

        <button
          onClick={onOpenAI}
          className="text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
        >
          <Sparkles size={16} className="text-gray-500" />
          ИИ-ассистент
        </button>

        {/* 👇 ВСТАВЛЯЕМ УВЕДОМЛЕНИЯ */}
        <NotificationsMenu />

        {/* Аватар */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
