import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // 👇 Новое состояние: есть ли непрочитанные
  const [hasUnread, setHasUnread] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      user: "МС",
      userColor: "bg-green-100 text-green-700",
      title: "Мария упомянула вас",
      text: "«Макеты обновила. @Анна, посмотри счётчик»",
      task: "PLT-124",
      time: "10:24",
    },
    {
      id: 2,
      user: "ДК",
      userColor: "bg-orange-100 text-orange-700",
      title: "Задача ждёт проверки",
      text: "Покрыть API проектов тестами",
      task: "PLT-122",
      time: "09:50",
    },
    {
      id: 3,
      user: "АК",
      userColor: "bg-indigo-100 text-indigo-700",
      title: "Скоро срок задачи",
      text: "Реализовать фильтры на доске",
      task: "PLT-124 · до 16 октября",
      time: "",
    },
  ];

  // 👇 Обработчик клика по колокольчику
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Если открываем меню — убираем красную точку
      setHasUnread(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Кнопка колокольчика */}
      <button
        onClick={handleBellClick} // <-- Используем новую функцию
        className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-md transition-colors relative"
      >
        <Bell size={20} />

        {/* 👇 Показываем точку ТОЛЬКО если есть непрочитанные */}
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {/* Выпадающее окно */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-slide-up">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Уведомления · 3</h3>
            <button
              onClick={() => setHasUnread(false)}
              className="text-xs text-gray-400 hover:text-indigo-600 transition-colors"
            >
              Прочитать все
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${notif.userColor}`}
                >
                  {notif.user}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-900">
                    {notif.title}
                  </span>
                  <span className="text-xs text-gray-500 leading-snug">
                    {notif.text}
                  </span>
                  <span className="text-xs text-indigo-500 mt-1">
                    {notif.task} {notif.time && `· ${notif.time}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
