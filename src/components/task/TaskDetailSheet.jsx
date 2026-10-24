import { useState } from "react";
import {
  Link,
  MoreHorizontal,
  X,
  Sparkles,
  User,
  Circle,
  Folder,
  Tag,
  BarChart2,
  RefreshCw,
  Calendar,
} from "lucide-react";

export default function TaskDetailSheet({
  isOpen,
  onClose,
  task,
  onAskAI,
  onAddComment,
}) {
  const [commentText, setCommentText] = useState("");

  if (!isOpen || !task) return null;

  // Функция для красивой даты
  const formatDate = (dateString) => {
    if (!dateString) return "Не указан";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Функция для получения имени по инициалам
  const getAssigneeName = (initials) => {
    const users = {
      АК: "Анна Ким",
      МС: "Мария Соколова",
      ДК: "Дмитрий Козлов",
    };
    return users[initials] || "Не назначен";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-[650px] max-w-full bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Шапка (Путь и кнопки управления) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Платформа 2.0</span>
            <span>/</span>
            <span className="font-medium text-gray-700">{task.id}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <button className="hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded">
              <Link size={16} />
            </button>
            <button className="hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal size={16} />
            </button>
            <button
              onClick={onClose}
              className="hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Основной контент (скроллится) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          {/* Заголовок и кнопка ИИ */}
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  onClose();
                  onAskAI(task);
                }}
                className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={14} className="text-indigo-500" /> Спросить ИИ
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          </div>

          {/* Метаданные в две колонки */}
          <div className="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-8 text-sm">
            {/* Левая колонка */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <User size={16} className="text-gray-400" /> Исполнитель
                </span>
                <span className="text-gray-900 font-medium">
                  {getAssigneeName(task.assignee)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <Circle size={16} className="text-gray-400" /> Оценка
                </span>
                <span className="text-gray-900 font-medium">
                  {task.points} SP
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <Folder size={16} className="text-gray-400" /> Эпик
                </span>
                <span className="text-gray-900 whitespace-nowrap">
                  Рабочее пространство
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <Tag size={16} className="text-gray-400" /> Метки
                </span>
                <div className="flex flex-wrap gap-1">
                  {task.labels && task.labels.length > 0 ? (
                    task.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                      >
                        {label}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Нет</span>
                  )}
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <BarChart2 size={16} className="text-gray-400" /> Приоритет
                </span>
                <span
                  className={`font-medium ${task.priority === "Высокий" ? "text-[#D89836]" : "text-gray-900"}`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <RefreshCw size={16} className="text-gray-400" /> Спринт
                </span>
                <span className="text-gray-900 whitespace-nowrap">
                  Спринт 1
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-32 flex items-center gap-2 whitespace-nowrap">
                  <Calendar size={16} className="text-gray-400" /> Срок
                </span>
                <span className="text-orange-400 font-medium whitespace-nowrap">
                  {formatDate(task.deadline)}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Описание */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Описание</h3>
              <div className="flex gap-2 text-xs text-gray-400">
                <button className="hover:text-gray-700">Markdown</button>
                <span>·</span>
                <button className="hover:text-gray-700">Редактировать</button>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed min-h-[80px]">
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-gray-400 italic">
                  Нет описания. Нажмите "Редактировать", чтобы добавить.
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Критерии и Вложения (заглушки) */}
          <div className="text-sm text-gray-500 flex flex-col gap-4 pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Критерии готовности</h3>
              <span className="text-xs text-gray-400">0 из 0</span>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Вложения</h3>
              <span className="text-xs text-gray-400">0</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Блок комментариев */}
          <div className="flex flex-col gap-4 pb-10">
            <h3 className="font-bold text-gray-900">
              Комментарии · {task.comments?.length || 0}
            </h3>

            {/* Вывод существующих комментариев */}
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                    {comment.author}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {getAssigneeName(comment.author)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {comment.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Пока нет комментариев.</p>
            )}

            {/* Поле ввода комментария */}
            <div className="relative mt-2 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (commentText.trim()) {
                      onAddComment(task.id, commentText);
                      setCommentText("");
                    }
                  }
                }}
                placeholder="Написать комментарий... (нажмите Enter)"
                className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => {
                  if (commentText.trim()) {
                    onAddComment(task.id, commentText);
                    setCommentText("");
                  }
                }}
                className="absolute right-3 top-2.5 text-indigo-500 hover:text-indigo-700"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
