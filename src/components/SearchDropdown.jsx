import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchDropdown({ tasks, onTaskClick }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Закрываем дропдаун при клике вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Собираем все задачи в один массив
  const allTasks = Object.entries(tasks).flatMap(([status, columnTasks]) =>
    columnTasks.map((task) => ({ ...task, status })),
  );

  // Фильтруем
  const filteredTasks =
    query.trim() === ""
      ? []
      : allTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.id.toLowerCase().includes(query.toLowerCase()),
        );

  const statusNames = {
    todo: "К работе",
    inProgress: "В работе",
    review: "На проверке",
    done: "Готово",
  };

  return (
    <div className="relative w-64" ref={wrapperRef}>
      {/* Поле ввода */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Поиск в проекте..."
          className="pl-9 pr-12 py-1.5 bg-gray-100/80 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full border border-transparent hover:border-gray-200 transition-all"
        />
        <span className="absolute right-2 text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200 pointer-events-none">
          ⌘ K
        </span>
      </div>

      {/* Выпадающий список */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-full left-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-slide-up">
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredTasks.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                По запросу «{query}» ничего не найдено.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Задачи · {filteredTasks.length}
                </div>
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onTaskClick(task);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex flex-col gap-0.5 group"
                  >
                    <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                      {task.id}
                    </span>
                    <span className="font-medium text-sm text-gray-900 truncate">
                      {task.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {statusNames[task.status]} ·{" "}
                      {task.assignee || "Без исполнителя"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
