import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";

export default function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light"); // light, dark, system
  const menuRef = useRef(null);

  // Закрываем меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Кнопка аватара */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm hover:ring-2 hover:ring-indigo-200 transition-all cursor-pointer"
      >
        АК
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-slide-up">
          {/* Шапка профиля */}
          <div className="p-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
              АК
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">Анна Ким</span>
              <span className="text-xs text-gray-500">anna@studio.team</span>
            </div>
          </div>

          {/* Пункты меню */}
          <div className="p-2 flex flex-col">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              Мой профиль
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              Настройки аккаунта
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              Сочетания клавиш
            </button>
          </div>

          {/* Оформление (Темы) */}
          <div className="p-2 border-t border-gray-100">
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 mb-1">
              Оформление
            </div>
            <div className="flex gap-1 px-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${theme === "light" ? "bg-gray-50 border-gray-300 text-gray-900" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
              >
                Светлая
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${theme === "dark" ? "bg-gray-50 border-gray-300 text-gray-900" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
              >
                Тёмная
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${theme === "system" ? "bg-gray-50 border-gray-300 text-gray-900" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
              >
                Система
              </button>
            </div>
          </div>

          {/* Выход */}
          <div className="p-2 border-t border-gray-100">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors font-medium">
              <LogOut size={16} /> Выйти из аккаунта
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
