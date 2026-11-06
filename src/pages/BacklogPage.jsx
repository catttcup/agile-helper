import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Layers,
  Plus,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUSES = [
  { id: "todo", label: "К работе", color: "#9299AA" },
  { id: "inProgress", label: "В работе", color: "#D89836" },
  { id: "review", label: "На проверке", color: "#9A8CF1" },
  { id: "done", label: "Готово", color: "#3E9C7A" },
];

const INITIAL_EPICS = [
  { id: "workspace", name: "Рабочее пространство" },
  { id: "auth", name: "Авторизация" },
  { id: "notifications", name: "Уведомления" },
];

const EMPTY_TASK = {
  title: "",
  description: "",
  priority: "Средний",
  points: 3,
  assignee: "",
  labels: [],
  deadline: "",
  sprintId: "1",
};

function getStatus(tasks, taskId) {
  return (
    Object.keys(tasks).find((status) =>
      tasks[status].some((task) => task.id === taskId),
    ) || "todo"
  );
}

function createTaskId(tasks) {
  const numbers = Object.values(tasks)
    .flat()
    .map((task) => Number(task.id?.match(/PLT-(\d+)/)?.[1] || 0));

  return `PLT-${Math.max(120, ...numbers) + 1}`;
}

export default function BacklogPage({
  tasks = {},
  onTasksChange,
  onOpenTask,
  onOpenBoard,
}) {
  const [epics, setEpics] = useState(INITIAL_EPICS);
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [label, setLabel] = useState("");
  const [groupBy, setGroupBy] = useState("epic");
  const [collapsed, setCollapsed] = useState({});
  const [creating, setCreating] = useState(false);
  const [creatingEpic, setCreatingEpic] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [epicName, setEpicName] = useState("");
  const [activeEpic, setActiveEpic] = useState("workspace");
  const [form, setForm] = useState(EMPTY_TASK);
  const [draggedId, setDraggedId] = useState(null);
  const navigate = useNavigate();

  const allTasks = useMemo(
    () =>
      Object.entries(tasks).flatMap(([status, items]) =>
        (items || []).map((task, index) => ({
          ...task,
          status,
          epicId: task.epicId || "workspace",
          order: task.order ?? index,
        })),
      ),
    [tasks],
  );

  const filteredTasks = allTasks.filter((task) => {
    const query = search.trim().toLowerCase();

    return (
      (!query ||
        task.title?.toLowerCase().includes(query) ||
        task.id?.toLowerCase().includes(query)) &&
      (!assignee || task.assignee === assignee) &&
      (!priority || task.priority === priority) &&
      (!label || task.labels?.includes(label))
    );
  });

  const totalPoints = filteredTasks.reduce(
    (sum, task) => sum + Number(task.points || 0),
    0,
  );

  const people = [
    ...new Set(allTasks.map((task) => task.assignee).filter(Boolean)),
  ];
  const labels = [...new Set(allTasks.flatMap((task) => task.labels || []))];

  function updateTasks(updater) {
    if (!onTasksChange) return;

    onTasksChange((previous) => {
      const next = updater(previous);
      return next;
    });
  }

  function createTask() {
    if (!form.title.trim()) return;

    const task = {
      ...form,
      id: createTaskId(tasks),
      title: form.title.trim(),
      sprintId: form.sprintId || "1",
      epicId: activeEpic,
      order: Date.now(),
      deadline: form.deadline || null,
    };

    updateTasks((previous) => ({
      ...previous,
      todo: [task, ...(previous.todo || [])],
    }));

    setForm(EMPTY_TASK);
    setCreating(false);
  }

  function saveTask() {
    if (!editing || !form.title.trim()) return;

    updateTasks((previous) => ({
      ...previous,
      [editing.status]: (previous[editing.status] || []).map((task) =>
        task.id === editing.id
          ? {
              ...task,
              ...form,
              title: form.title.trim(),
              deadline: form.deadline || null,
              epicId: activeEpic,
            }
          : task,
      ),
    }));

    setEditing(null);
    setForm(EMPTY_TASK);
  }

  function startEditing(task) {
    setEditing(task);
    setActiveEpic(task.epicId || "workspace");
    setForm({
      ...EMPTY_TASK,
      ...task,
      deadline: task.deadline || "",
    });
  }

  function createEpic() {
    if (!epicName.trim()) return;

    const epic = {
      id: `epic-${Date.now()}`,
      name: epicName.trim(),
    };

    setEpics((previous) => [...previous, epic]);
    setActiveEpic(epic.id);
    setEpicName("");
    setCreatingEpic(false);
  }

  function moveTask(taskId, targetEpic) {
    updateTasks((previous) => {
      const next = Object.fromEntries(
        Object.entries(previous).map(([status, items]) => [
          status,
          items.map((task) =>
            task.id === taskId ? { ...task, epicId: targetEpic } : task,
          ),
        ]),
      );

      return next;
    });
  }

  function reorderTask(taskId, targetId) {
    if (!taskId || !targetId || taskId === targetId) return;

    updateTasks((previous) => {
      const next = Object.fromEntries(
        Object.entries(previous).map(([status, items]) => [status, [...items]]),
      );

      const fromStatus = getStatus(next, taskId);
      const toStatus = getStatus(next, targetId);

      if (fromStatus !== toStatus) return previous;

      const items = next[fromStatus];
      const fromIndex = items.findIndex((task) => task.id === taskId);
      const toIndex = items.findIndex((task) => task.id === targetId);

      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);

      return next;
    });
  }

  function openQuickCreate(epicId) {
    setActiveEpic(epicId);
    setForm(EMPTY_TASK);
    setCreating(true);
  }

  const grouped =
    groupBy === "epic"
      ? epics.map((epic) => ({
          id: epic.id,
          title: epic.name,
          tasks: filteredTasks.filter((task) => task.epicId === epic.id),
        }))
      : STATUSES.map((status) => ({
          id: status.id,
          title: status.label,
          tasks: filteredTasks.filter((task) => task.status === status.id),
        }));

  function TaskRow({ task }) {
    const status = STATUSES.find((item) => item.id === task.status);

    return (
      <div
        draggable
        onDragStart={() => setDraggedId(task.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => {
          if (draggedId) reorderTask(draggedId, task.id);
          setDraggedId(null);
        }}
        onDragEnd={() => setDraggedId(null)}
        className={`group grid grid-cols-[20px_20px_75px_minmax(0,1fr)_100px_50px_70px] items-center gap-2 border-b border-gray-100 px-3 py-3 text-sm hover:bg-violet-50/40 ${
          draggedId === task.id ? "opacity-40" : ""
        }`}
      >
        <span className="cursor-grab text-gray-300">⠿</span>

        <input
          type="checkbox"
          checked={task.status === "done"}
          onChange={(event) => {
            const nextStatus = event.target.checked ? "done" : "todo";

            updateTasks((previous) => {
              const next = Object.fromEntries(
                Object.entries(previous).map(([status, items]) => [
                  status,
                  items.filter((item) => item.id !== task.id),
                ]),
              );

              next[nextStatus] = [
                ...(next[nextStatus] || []),
                { ...task, status: undefined },
              ];

              return next;
            });
          }}
          className="accent-violet-600"
        />

        <span className="text-xs text-gray-400">{task.id}</span>

        <button
          onClick={() => onOpenTask?.(task)}
          className="truncate text-left text-gray-800 hover:text-violet-700"
        >
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ background: status?.color || "#9299AA" }}
          />
          {task.title}
        </button>

        <span className="truncate text-xs text-gray-500">
          {task.labels?.[0] || "—"}
        </span>

        <span className="text-xs text-gray-500">◇ {task.points || 0}</span>

        <button
          onClick={() => startEditing(task)}
          className="flex items-center justify-end gap-1 text-xs text-gray-400 hover:text-violet-600"
        >
          {task.assignee || "—"}
          <MoreHorizontal size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-7 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Бэклог</h1>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
            {filteredTasks.length} задач · {totalPoints} SP
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCreatingEpic(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Layers size={16} /> Новый эпик
          </button>

          <button
            onClick={() => openQuickCreate(activeEpic)}
            className="flex items-center gap-2 rounded-lg bg-[#6c5ce7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a4bcf]"
          >
            <Plus size={16} /> Создать задачу
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по задачам..."
              className="w-64 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">Исполнитель</option>
            {people.map((person) => (
              <option key={person}>{person}</option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">Приоритет</option>
            {["Высокий", "Средний", "Низкий"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">Метки</option>
            {labels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <select
          value={groupBy}
          onChange={(event) => setGroupBy(event.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="epic">Группировать: эпик</option>
          <option value="status">Группировать: статус</option>
        </select>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-violet-500">◉</span>
          <strong className="text-sm">Спринт 1</strong>
          <span className="text-xs text-emerald-600">Активен</span>
          <span className="text-xs text-gray-400">
            {filteredTasks.filter((task) => task.sprintId === "1").length} задач
          </span>
        </div>

        <button
          onClick={() => navigate("/")}
          className="text-sm text-violet-500 hover:text-violet-700"
        >
          Открыть доску →
        </button>
      </div>

      <div className="overflow-hidden rounded-xl">
        {grouped.map((group) => {
          const isCollapsed = collapsed[group.id];

          return (
            <section key={group.id} className="mb-3">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-3">
                <button
                  onClick={() =>
                    setCollapsed((previous) => ({
                      ...previous,
                      [group.id]: !previous[group.id],
                    }))
                  }
                  className="text-gray-400"
                >
                  {isCollapsed ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                <Layers size={14} className="text-violet-500" />

                <strong className="text-xs text-gray-800">{group.title}</strong>

                <span className="text-xs text-gray-400">
                  {group.tasks.length} задач ·{" "}
                  {group.tasks.reduce(
                    (sum, task) => sum + Number(task.points || 0),
                    0,
                  )}{" "}
                  SP
                </span>

                <div className="ml-auto flex items-center gap-3">
                  <button
                    onClick={() => openQuickCreate(group.id)}
                    className="text-gray-400 hover:text-violet-600"
                    title="Добавить задачу"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div>
                  {group.tasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing ? "Редактировать задачу" : "Новая задача"}
              </h2>
              <button
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                autoFocus
                value={form.title}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                placeholder="Название задачи"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                placeholder="Описание"
                rows={3}
                className="resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={activeEpic}
                  onChange={(event) => setActiveEpic(event.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {epics.map((epic) => (
                    <option key={epic.id} value={epic.id}>
                      {epic.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      priority: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {["Высокий", "Средний", "Низкий"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  value={form.points}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      points: Number(event.target.value),
                    }))
                  }
                  placeholder="Story Points"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />

                <input
                  value={form.assignee}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      assignee: event.target.value,
                    }))
                  }
                  placeholder="Исполнитель"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />

                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      deadline: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />

                <input
                  value={form.sprintId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      sprintId: event.target.value,
                    }))
                  }
                  placeholder="Спринт"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <input
                value={form.labels.join(", ")}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    labels: event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Метки через запятую"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                >
                  Отмена
                </button>

                <button
                  onClick={editing ? saveTask : createTask}
                  disabled={!form.title.trim()}
                  className="rounded-lg bg-[#6c5ce7] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  {editing ? "Сохранить" : "Создать задачу"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {creatingEpic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Новый эпик</h2>
            <input
              autoFocus
              value={epicName}
              onChange={(event) => setEpicName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") createEpic();
              }}
              placeholder="Название эпика"
              className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreatingEpic(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Отмена
              </button>
              <button
                onClick={createEpic}
                disabled={!epicName.trim()}
                className="rounded-lg bg-[#6c5ce7] px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                Создать эпик
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
