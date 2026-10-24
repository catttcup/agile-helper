import { User, BarChart3, Tag, RefreshCw, Check } from "lucide-react";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailSheet from "../components/task/TaskDetailSheet";
import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Начальные данные (имитация бэкенда)
const initialTasks = {
  todo: [
    {
      id: "task-1",
      title: "Настроить вход через Google",
      priority: "Высокий",
      points: 5,
      assignee: "АК",
      labels: ["Frontend", "Auth"],
      deadline: "2026-10-16",
      description:
        "Интегрировать OAuth 2.0 для входа через Google. Настроить получение токена и сохранение сессии.",
    },
    {
      id: "task-2",
      title: "Добавить восстановление пароля",
      priority: "Средний",
      points: 3,
      assignee: "МС",
      labels: ["Backend", "Auth"],
      deadline: null,
      description: "Реализовать отправку письма со ссылкой для сброса пароля.",
    },
  ],
  inProgress: [
    {
      id: "task-3",
      title: "Реализовать фильтры на доске",
      priority: "Высокий",
      points: 5,
      assignee: "АК",
      labels: ["Frontend", "UX"],
      deadline: "2026-10-20", // Скоро, чтобы показать красный индикатор
      description:
        "Команда должна быстро находить нужные задачи без потери контекста. Добавить фильтры по исполнителю, приоритету, меткам и спринту.",
    },
  ],
  review: [
    {
      id: "task-4",
      title: "Проверить доступность навигации",
      priority: "Средний",
      points: 2,
      assignee: "АК",
      labels: ["UX", "A11y"],
      deadline: null,
      description: "Проверить контрастность, фокус и клавиатурную навигацию.",
    },
  ],
  done: [
    {
      id: "task-5",
      title: "Настроить CI/CD",
      priority: "Высокий",
      points: 5,
      assignee: "МС",
      labels: ["DevOps"],
      deadline: "2026-10-10",
      description: "Настроить автоматическую сборку и деплой на сервер.",
    },
  ],
};
const sprints = [
  { id: "1", name: "Спринт 1" },
  { id: "2", name: "Спринт 2" },
  { id: "3", name: "Спринт 3" },
  { id: "4", name: "Спринт 4" },
  { id: "5", name: "Спринт 5" },
];

export default function BoardPage({ onOpenAIWithTask }) {
  const [currentSprint, setCurrentSprint] = useState("1");
  const [filterAssignee, setFilterAssignee] = useState(null);
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterLabel, setFilterLabel] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState("scrum"); // 'scrum' или 'kanban'
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState("todo"); // По умолчанию создаем в "К работе"

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Находим, в какой колонке сейчас лежит перетаскиваемая карточка
    const activeColumn = Object.keys(tasks).find((col) =>
      tasks[col].find((t) => t.id === activeId),
    );

    // Находим, над какой колонкой или карточкой мы отпустили мышь
    const overColumn = Object.keys(tasks).find(
      (col) => col === overId || tasks[col].find((t) => t.id === overId),
    );

    if (!activeColumn || !overColumn) return;

    // Если перетащили в другую колонку
    if (activeColumn !== overColumn) {
      const activeItems = tasks[activeColumn];
      const overItems = tasks[overColumn];
      const activeIndex = activeItems.findIndex((t) => t.id === activeId);
      const overIndex = overItems.findIndex((t) => t.id === overId);

      let newIndex;
      if (overId in tasks) {
        newIndex = overItems.length + 1;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
      }

      const movedTask = activeItems[activeIndex];

      setTasks((prev) => ({
        ...prev,
        [activeColumn]: prev[activeColumn].filter((t) => t.id !== activeId),
        [overColumn]: [
          ...prev[overColumn].slice(0, newIndex),
          movedTask,
          ...prev[overColumn].slice(newIndex, prev[overColumn].length),
        ],
      }));
    } else {
      // Если перетащили внутри одной колонки (меняем порядок)
      const activeIndex = tasks[activeColumn].findIndex(
        (t) => t.id === activeId,
      );
      const overIndex = tasks[activeColumn].findIndex((t) => t.id === overId);
      setTasks((prev) => ({
        ...prev,
        [activeColumn]: arrayMove(prev[activeColumn], activeIndex, overIndex),
      }));
    }
  };

  const handleCreateTask = (taskData, columnId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      sprintId: currentSprint,
      ...taskData, // Распаковываем все данные, пришедшие из модалки
    };

    setTasks((prev) => ({
      ...prev,
      [columnId]: [newTask, ...prev[columnId]],
    }));
  };

  const handleAddComment = (taskId, text) => {
    console.log("ПЫТАЮСЬ ДОБАВИТЬ КОММЕНТАРИЙ:", taskId, text); // <-- ДОБАВЬ ЭТО
    setTasks((prev) => {
      const newTasks = { ...prev };
      for (const col in newTasks) {
        const taskIndex = newTasks[col].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          const task = newTasks[col][taskIndex];
          const newComment = {
            id: Date.now(),
            author: "АК", // Пока жестко Анна, потом будем брать из профиля
            text: text,
            date: new Date().toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          newTasks[col][taskIndex] = {
            ...task,
            comments: [...(task.comments || []), newComment],
          };
          break;
        }
      }
      return newTasks;
    });
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeColumn = Object.keys(tasks).find((col) =>
      tasks[col].find((t) => t.id === active.id),
    );
    const task = tasks[activeColumn].find((t) => t.id === active.id);
    setActiveTask(task);
  };
  // Функция фильтрации задач
  const getFilteredTasks = (columnTasks) => {
    return columnTasks.filter((task) => {
      // Фильтр по спринту! (Если у задачи нет спринта или он совпадает с текущим)
      const matchSprint =
        task.sprintId === currentSprint ||
        (!task.sprintId && currentSprint === "1");

      const matchAssignee = filterAssignee
        ? task.assignee === filterAssignee
        : true;
      const matchPriority = filterPriority
        ? task.priority === filterPriority
        : true;
      const matchLabel = filterLabel
        ? task.labels?.includes(filterLabel)
        : true;

      return matchSprint && matchAssignee && matchPriority && matchLabel;
    });
  };

  // Считаем общее количество SP и выполненные
  const currentSprintTasks = Object.values(tasks)
    .flat()
    .filter(
      (t) =>
        t.sprintId === currentSprint || (!t.sprintId && currentSprint === "12"),
    );
  const totalSP = currentSprintTasks.reduce(
    (sum, task) => sum + Number(task.points || 0),
    0,
  );
  const doneSP = tasks.done
    .filter(
      (t) =>
        t.sprintId === currentSprint || (!t.sprintId && currentSprint === "12"),
    )
    .reduce((sum, task) => sum + Number(task.points || 0), 0);
  const progressPercent =
    totalSP === 0 ? 0 : Math.round((doneSP / totalSP) * 100);

  return (
    <div className="p-6 min-h-full flex flex-col">
      {/* Верхняя панель доски */}
      <div className="flex items-center justify-between mb-6">
        {/* Слева только заголовок Доска */}
        <h1 className="text-2xl font-bold text-gray-900">Доска</h1>
        {/* Справа группа: участники и кнопки */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">6 участников</span>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-900 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              Поделиться
            </button>
            <button
              onClick={() => {
                setTargetColumn("todo");
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md text-sm font-medium hover:bg-[#5a4bcf] transition-colors shadow-sm"
            >
              + Создать задачу
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        {/* Левая часть: Фильтры */}
        <div className="flex gap-2">
          {/* Фильтр Исполнитель */}
          <div className="relative group">
            <button
              className={`px-3 py-1.5 border rounded-md text-sm flex items-center gap-2 transition-colors ${filterAssignee ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              <User size={16} className="text-gray-400" />
              {filterAssignee
                ? `Исполнитель: ${filterAssignee}`
                : "Исполнитель"}
              <span className="text-xs text-gray-400">▼</span>
            </button>
            {/* Выпадающий список */}
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => setFilterAssignee(null)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
              >
                Все{" "}
                <Check
                  size={14}
                  className={!filterAssignee ? "opacity-100" : "opacity-0"}
                />
              </button>
              {["АК", "МС", "ДК"].map((user) => (
                <button
                  key={user}
                  onClick={() => setFilterAssignee(user)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
                >
                  {user}{" "}
                  <Check
                    size={14}
                    className={
                      filterAssignee === user ? "opacity-100" : "opacity-0"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Фильтр Приоритет */}
          <div className="relative group">
            <button
              className={`px-3 py-1.5 border rounded-md text-sm flex items-center gap-2 transition-colors ${filterPriority ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              <BarChart3 size={16} className="text-gray-400" />
              {filterPriority ? `Приоритет: ${filterPriority}` : "Приоритет"}
              <span className="text-xs text-gray-400">▼</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => setFilterPriority(null)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
              >
                Все{" "}
                <Check
                  size={14}
                  className={!filterPriority ? "opacity-100" : "opacity-0"}
                />
              </button>
              {["Высокий", "Средний", "Низкий"].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFilterPriority(priority)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
                >
                  {priority}{" "}
                  <Check
                    size={14}
                    className={
                      filterPriority === priority ? "opacity-100" : "opacity-0"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Фильтр Метки */}
          <div className="relative group">
            <button
              className={`px-3 py-1.5 border rounded-md text-sm flex items-center gap-2 transition-colors ${filterLabel ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              <Tag size={16} className="text-gray-400" />
              {filterLabel ? `Метка: ${filterLabel}` : "Метки"}
              <span className="text-xs text-gray-400">▼</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => setFilterLabel(null)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
              >
                Все{" "}
                <Check
                  size={14}
                  className={!filterLabel ? "opacity-100" : "opacity-0"}
                />
              </button>
              {["Frontend", "Backend", "UX", "Auth", "DevOps"].map((label) => (
                <button
                  key={label}
                  onClick={() => setFilterLabel(label)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
                >
                  {label}{" "}
                  <Check
                    size={14}
                    className={
                      filterLabel === label ? "opacity-100" : "opacity-0"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Фильтр Спринт */}
          <div className="relative group">
            <button className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-sm flex items-center gap-2 transition-colors">
              <RefreshCw size={16} />
              Спринт {currentSprint}
              <span className="text-xs">▼</span>
            </button>
            <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {sprints.map((sprint) => (
                <button
                  key={sprint.id}
                  onClick={() => setCurrentSprint(sprint.id)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between ${currentSprint === sprint.id ? "font-bold text-indigo-600" : ""}`}
                >
                  {sprint.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Правая часть: Переключатель Kanban / Scrum */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "kanban"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode("scrum")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "scrum"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Scrum
          </button>
        </div>
      </div>

      {/* Плашка прогресса спринта */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900">
              Спринт {currentSprint}
            </span>{" "}
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
              Активен
            </span>
            <span className="text-sm text-gray-500">12–23 октября</span>
          </div>
          <span className="text-sm text-gray-500">
            Цель: сделать работу с доской быстрой и предсказуемой
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-gray-500 font-medium">
              {doneSP} из {totalSP} SP завершено - {progressPercent}%
            </span>
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Завершить спринт
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pb-4 items-stretch flex-1">
          <BoardColumn
            id="todo"
            title="К работе"
            color="bg-gray-400"
            tasks={getFilteredTasks(tasks.todo)}
            onTaskClick={setSelectedTask}
            onAddClick={() => {
              setTargetColumn("todo");
              setIsCreateModalOpen(true);
            }}
          />
          <BoardColumn
            id="inProgress"
            title="В работе"
            color="bg-[#D89836]"
            tasks={getFilteredTasks(tasks.inProgress)}
            onTaskClick={setSelectedTask}
            onAddClick={() => {
              setTargetColumn("inProgress");
              setIsCreateModalOpen(true);
            }}
          />
          <BoardColumn
            id="review"
            title="На проверке"
            color="bg-[#9A8CF1]"
            tasks={getFilteredTasks(tasks.review)}
            onTaskClick={setSelectedTask}
            onAddClick={() => {
              setTargetColumn("review");
              setIsCreateModalOpen(true);
            }}
          />
          <BoardColumn
            id="done"
            title="Готово"
            color="bg-[#3E9C7A]"
            tasks={getFilteredTasks(tasks.done)}
            onTaskClick={setSelectedTask}
            onAddClick={() => {
              setTargetColumn("done");
              setIsCreateModalOpen(true);
            }}
          />
        </div>
        <TaskDetailSheet
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={
            selectedTask
              ? Object.values(tasks)
                  .flat()
                  .find((t) => t.id === selectedTask.id)
              : null
          }
          onAskAI={onOpenAIWithTask}
          onAddComment={handleAddComment}
        />
        {/* Модалка создания задачи */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTask}
          columnId={targetColumn}
        />
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Компонент колонки
function BoardColumn({ id, title, color, tasks, onTaskClick, onAddClick }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[260px] bg-gray-100/50 rounded-xl p-3 flex flex-col gap-3 h-max"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color}`}></span>
          {title}{" "}
          <span className="text-gray-400 font-normal">{tasks.length}</span>
        </h2>
        <button
          onClick={onAddClick}
          className="text-gray-400 hover:text-gray-700"
        >
          +
        </button>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </SortableContext>

      <button
        onClick={onAddClick}
        className="text-sm text-gray-500 hover:text-gray-800 text-left px-1 py-1 shrink-0"
      >
        + Добавить задачу
      </button>
    </div>
  );
}

// Компонент карточки
// Компонент карточки
function TaskCard({ task, isOverlay, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isOverlay ? 1 : isDragging ? 0.4 : 1,
  };

  // Функция для красивого короткого дедлайна (например, "16 окт")
  const formatShortDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
      .replace(".", "");
  };

  // Определяем цвет приоритета
  const priorityColor =
    task.priority === "Высокий"
      ? "text-[#D89836]"
      : task.priority === "Средний"
        ? "text-[#9299AA]"
        : "text-[#6494D8]";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white p-3 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors flex flex-col gap-2 ${
        isOverlay
          ? "shadow-2xl border-indigo-400 rotate-2 scale-105"
          : "shadow-sm"
      }`}
    >
      {/* Верхняя строка: ID и Приоритет */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{task.id}</span>
        <span
          className={`text-xs font-medium flex items-center gap-1.5 ${priorityColor}`}
        >
          {/* Иконка приоритета (4 полоски) */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="4" x2="4" y2="20"></line>
            <line x1="10" y1="4" x2="10" y2="20"></line>
            <line x1="16" y1="4" x2="16" y2="20"></line>
            <line x1="22" y1="4" x2="22" y2="20"></line>
          </svg>
          {task.priority}
        </span>
      </div>

      {/* Заголовок */}
      <h3 className="text-sm font-medium text-gray-900 leading-tight">
        {task.title}
      </h3>

      {/* Метки (если есть) */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {task.labels.slice(0, 3).map((label, idx) => (
            <span key={idx} className="text-[11px] text-gray-500">
              {label} {idx !== Math.min(task.labels.length - 1, 2) && "·"}
            </span>
          ))}
        </div>
      )}

      {/* Нижняя строка: Story Points, Дедлайн, Аватар */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-3">
          {/* Story Points */}
          <span className="text-xs text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded flex items-center gap-1">
            ◇ {task.points}
          </span>

          {/* Дедлайн */}
          {task.deadline && (
            <span className="text-xs text-orange-400 flex items-center gap-1">
              ⏱ {formatShortDate(task.deadline)}
            </span>
          )}
        </div>

        {/* Аватар исполнителя */}
        <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold">
          {task.assignee || "АК"}
        </div>
      </div>
    </div>
  );
}
