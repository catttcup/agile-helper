import { useState, useEffect } from "react";

export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
  columnId,
}) {
  const [title, setTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");
  // Новые состояния для полей
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("АК"); // По умолчанию
  const [priority, setPriority] = useState("Средний");
  const [points, setPoints] = useState(3);
  const [deadline, setDeadline] = useState("");
  const [labels, setLabels] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedColumn(columnId || "todo");
      setTitle("");
      setDescription("");
      setAssignee("АК");
      setPriority("Средний");
      setPoints(3);
      setDeadline("");
      setLabels("");
    }
  }, [isOpen, columnId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Собираем все данные в один объект
    const taskData = {
      title,
      description,
      assignee,
      priority,
      points: Number(points),
      deadline: deadline || null,
      // Превращаем строку "Frontend, UX" в массив ["Frontend", "UX"]
      labels: labels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    };

    onCreate(taskData, selectedColumn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Создание задачи</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название задачи *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Настроить вход через Google"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробности задачи..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c5ce7] resize-none"
            ></textarea>
          </div>

          {/* Сетка из 2 колонок для остальных полей */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Колонка
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="todo">К работе</option>
                <option value="inProgress">В работе</option>
                <option value="review">На проверке</option>
                <option value="done">Готово</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Исполнитель
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="АК">Анна Ким (АК)</option>
                <option value="МС">Мария Соколова (МС)</option>
                <option value="ДК">Дмитрий Козлов (ДК)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Приоритет
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="Высокий">Высокий</option>
                <option value="Средний">Средний</option>
                <option value="Низкий">Низкий</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Story Points
              </label>
              <input
                type="number"
                min="1"
                max="13"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дедлайн
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Метки (через запятую)
              </label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="Frontend, UX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md text-sm font-medium hover:bg-[#5a4bcf]"
            >
              Создать задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
