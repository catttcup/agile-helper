import { useMemo, useState } from "react";

const EMPTY_TASKS = {
  todo: [],
  inProgress: [],
  review: [],
  done: [],
};

const INITIAL_SPRINTS = [
  {
    id: "1",
    name: "Спринт 12",
    status: "Активен",
    startDate: "2026-10-12",
    endDate: "2026-10-23",
    goal: "Подготовить рабочее пространство к командной работе: фильтры, поиск и надёжная авторизация.",
    capacity: 35,
  },
  {
    id: "2",
    name: "Спринт 13",
    status: "Запланирован",
    startDate: "2026-10-26",
    endDate: "2026-11-06",
    goal: "Подготовить следующий набор улучшений продукта.",
    capacity: 30,
  },
  {
    id: "3",
    name: "Спринт 11",
    status: "Завершён",
    startDate: "2026-09-28",
    endDate: "2026-10-09",
    goal: "Завершить базовые сценарии проекта.",
    capacity: 30,
  },
];

const COLUMNS = [
  { key: "todo", label: "К работе" },
  { key: "inProgress", label: "В работе" },
  { key: "review", label: "На проверке" },
  { key: "done", label: "Готово" },
];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(`${value}T12:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTasksArray = (tasks) =>
  COLUMNS.flatMap(({ key }) =>
    (tasks?.[key] || []).map((task) => ({ ...task, status: key })),
  );

function SprintModal({ sprint, onClose, onSave }) {
  const [form, setForm] = useState(
    sprint || {
      name: "",
      startDate: "",
      endDate: "",
      goal: "",
      capacity: 30,
      status: "Запланирован",
    },
  );

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      name: form.name.trim() || "Новый спринт",
      capacity: Number(form.capacity) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {sprint ? "Редактировать спринт" : "Создать спринт"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Название
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Например, Спринт 14"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-slate-700">
              Дата начала
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Дата окончания
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Цель спринта
            <textarea
              value={form.goal}
              onChange={(e) => update("goal", e.target.value)}
              rows={3}
              placeholder="Какого результата хотим достичь?"
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Плановая ёмкость, SP
            <input
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) => update("capacity", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-violet-500 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function Burndown({ totalPoints, donePoints }) {
  const remaining = Math.max(0, totalPoints - donePoints);
  const height = 142;
  const width = 620;
  const points = Array.from({ length: 8 }, (_, index) => {
    const x = 28 + (index * (width - 56)) / 7;
    const y = 18 + (index * (height - 38)) / 7;
    return `${x},${y}`;
  }).join(" ");
  const actual = [
    `28,${18 + Math.max(0, totalPoints) * 2.3}`,
    `112,${18 + Math.max(0, totalPoints - donePoints * 0.25) * 2.3}`,
    `196,${18 + Math.max(0, totalPoints - donePoints * 0.55) * 2.3}`,
    `280,${18 + remaining * 2.3}`,
  ].join(" ");

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">
            Burndown · текущий спринт
          </h3>
          <p className="text-xs text-slate-400">
            Схематичный график оставшейся работы
          </p>
        </div>
        <span className="text-xs text-slate-400">План и факт</span>
      </div>
      <div className="overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-36 w-full"
          role="img"
          aria-label="Схематичный burndown график"
        >
          {[25, 55, 85, 115].map((y) => (
            <line
              key={y}
              x1="24"
              x2={width - 10}
              y1={y}
              y2={y}
              stroke="#e8eaf0"
              strokeWidth="1"
            />
          ))}
          <polyline
            points={points}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <polyline
            points={actual}
            fill="none"
            stroke="#6d5ce7"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="26" y="137" fontSize="10" fill="#94a3b8">
            Старт
          </text>
          <text x={width - 48} y="137" fontSize="10" fill="#94a3b8">
            Финиш
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <i className="h-0.5 w-5 bg-violet-500" />
          Факт
        </span>
        <span className="flex items-center gap-2">
          <i className="w-5 border-t border-dashed border-slate-400" />
          Идеальный план
        </span>
        <span className="ml-auto">Осталось {remaining} SP</span>
      </div>
    </div>
  );
}

function TaskRow({ task, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      className="flex cursor-grab items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-violet-50/40 active:cursor-grabbing"
    >
      <span className="text-slate-300">⠿</span>
      <span className="shrink-0 text-xs text-slate-400">{task.id}</span>
      <span className="min-w-0 flex-1 truncate text-slate-700">
        {task.title}
      </span>
      <span className="shrink-0 text-xs text-slate-400">
        ◇ {task.points ?? 0}
      </span>
      {task.assignee && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">
          {String(task.assignee).slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function SprintsPage({ tasks = EMPTY_TASKS, setTasks }) {
  const [sprints, setSprints] = useState(INITIAL_SPRINTS);
  const [selectedId, setSelectedId] = useState("1");
  const [view, setView] = useState("overview");
  const [modal, setModal] = useState(null);
  const [dragOver, setDragOver] = useState("");

  const allTasks = useMemo(() => getTasksArray(tasks), [tasks]);
  const selectedSprint =
    sprints.find((sprint) => sprint.id === selectedId) || sprints[0];
  const sprintTasks = allTasks.filter(
    (task) => String(task.sprintId ?? "") === selectedId,
  );
  const backlogTasks = allTasks.filter((task) => !task.sprintId);
  const totalPoints = sprintTasks.reduce(
    (sum, task) => sum + (Number(task.points) || 0),
    0,
  );
  const donePoints = sprintTasks
    .filter((task) => task.status === "done")
    .reduce((sum, task) => sum + (Number(task.points) || 0), 0);
  const progress = totalPoints
    ? Math.round((donePoints / totalPoints) * 100)
    : 0;
  const plannedPoints = selectedSprint?.capacity || 0;

  const saveSprint = (value) => {
    if (modal?.id) {
      setSprints((current) =>
        current.map((item) =>
          item.id === modal.id ? { ...value, id: modal.id } : item,
        ),
      );
    } else {
      const id = String(Date.now());
      setSprints((current) => [...current, { ...value, id }]);
      setSelectedId(id);
    }
    setModal(null);
  };

  const moveTask = (taskId, destination) => {
    if (!setTasks) return;
    setTasks((current) => {
      const next = {};
      for (const column of COLUMNS) {
        next[column.key] = (current?.[column.key] || []).map((task) => {
          if (String(task.id) !== String(taskId)) return task;
          return {
            ...task,
            sprintId: destination === "backlog" ? null : selectedId,
          };
        });
      }
      return next;
    });
    setDragOver("");
  };

  const onDragStart = (event, taskId) => {
    event.dataTransfer.setData("text/plain", String(taskId));
    event.dataTransfer.effectAllowed = "move";
  };

  const dropProps = (zone) => ({
    onDragOver: (event) => {
      event.preventDefault();
      setDragOver(zone);
    },
    onDragLeave: () => setDragOver(""),
    onDrop: (event) => {
      event.preventDefault();
      const id = event.dataTransfer.getData("text/plain");
      if (id) moveTask(id, zone);
    },
  });

  return (
    <div className="min-h-full bg-slate-50/70 px-5 py-6 text-slate-800 md:px-7">
      {modal && (
        <SprintModal
          sprint={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={saveSprint}
        />
      )}

      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-xs text-slate-400">Проект / Спринты</div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Спринты
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Планируйте итерации и следите за прогрессом команды.
            </p>
          </div>
          <button
            onClick={() => setModal({})}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700"
          >
            ＋ Создать спринт
          </button>
        </div>

        <div className="mb-5 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setView("overview")}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${view === "overview" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Обзор
          </button>
          <button
            onClick={() => setView("planning")}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${view === "planning" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            Планирование
          </button>
        </div>

        {view === "overview" ? (
          <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-slate-800">
                  Список спринтов
                </h2>
                <span className="text-xs text-slate-400">{sprints.length}</span>
              </div>
              <div className="space-y-2">
                {sprints.map((sprint, index) => {
                  const count = allTasks.filter(
                    (task) => String(task.sprintId ?? "") === sprint.id,
                  ).length;
                  const active = selectedId === sprint.id;
                  return (
                    <button
                      key={sprint.id}
                      onClick={() => setSelectedId(sprint.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${active ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {sprint.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${sprint.status === "Активен" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          {sprint.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        {formatDate(sprint.startDate)} —{" "}
                        {formatDate(sprint.endDate)}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {count} задач · {sprint.capacity} SP
                      </div>
                      <div className="mt-3">
                        <ProgressBar value={index === 0 ? progress : 0} />
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setModal({})}
                className="mt-3 w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-violet-300 hover:text-violet-700"
              >
                ＋ Создать спринт
              </button>
            </aside>

            <section className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {selectedSprint?.name}
                      </h2>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                        {selectedSprint?.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatDate(selectedSprint?.startDate)} —{" "}
                      {formatDate(selectedSprint?.endDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => setModal(selectedSprint)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    Редактировать
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Цель спринта
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {selectedSprint?.goal || "Цель пока не указана."}
                  </p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {progress}%
                    </div>
                    <div className="text-xs text-slate-400">
                      Выполнено по SP
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {sprintTasks.length}
                    </div>
                    <div className="text-xs text-slate-400">
                      Задач в спринте
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {totalPoints} / {plannedPoints} SP
                    </div>
                    <div className="text-xs text-slate-400">
                      Набрано / ёмкость
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar value={progress} />
                </div>
              </div>

              <Burndown totalPoints={totalPoints} donePoints={donePoints} />

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => setView("planning")}
                  className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
                >
                  Перейти к планированию
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div>
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {selectedSprint?.name}
                    </h2>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      {selectedSprint?.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatDate(selectedSprint?.startDate)} —{" "}
                    {formatDate(selectedSprint?.endDate)}
                  </p>
                </div>
                <button
                  onClick={() => setModal(selectedSprint)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Редактировать
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-700">
                {selectedSprint?.goal || "Цель спринта не указана."}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {sprintTasks.length} задач · {totalPoints} SP
                </span>
                <span>
                  {plannedPoints
                    ? Math.round((totalPoints / plannedPoints) * 100)
                    : 0}
                  % ёмкости
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={
                    plannedPoints ? (totalPoints / plannedPoints) * 100 : 0
                  }
                />
              </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-2">
              <section
                {...dropProps("backlog")}
                className={`overflow-hidden rounded-xl border bg-white ${dragOver === "backlog" ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="font-semibold">Backlog</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    {backlogTasks.length} задач ·{" "}
                    {backlogTasks.reduce(
                      (sum, task) => sum + (Number(task.points) || 0),
                      0,
                    )}{" "}
                    SP
                  </span>
                </div>
                <div className="min-h-72">
                  {backlogTasks.length ? (
                    backlogTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onDragStart={onDragStart}
                      />
                    ))
                  ) : (
                    <div className="m-4 flex min-h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 px-6 text-center text-sm text-slate-400">
                      Перетащите сюда задачу, чтобы убрать её из спринта
                    </div>
                  )}
                </div>
                <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
                  Перенос меняет спринт, но не статус задачи.
                </p>
              </section>

              <section
                {...dropProps("sprint")}
                className={`overflow-hidden rounded-xl border bg-white ${dragOver === "sprint" ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="font-semibold">{selectedSprint?.name}</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    {sprintTasks.length} задач · {totalPoints} SP
                  </span>
                </div>
                <div className="min-h-72">
                  {sprintTasks.length ? (
                    sprintTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onDragStart={onDragStart}
                      />
                    ))
                  ) : (
                    <div className="m-4 flex min-h-44 items-center justify-center rounded-lg border border-dashed border-violet-300 bg-violet-50 px-6 text-center text-sm text-violet-500">
                      Перетащите задачу из Backlog в спринт →
                    </div>
                  )}
                </div>
              </section>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Перетаскивайте задачи между колонками. Изменения сохраняются в
              общем состоянии приложения.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
