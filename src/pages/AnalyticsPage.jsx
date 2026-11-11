import { useMemo, useState } from "react";

const STATUS_META = [
  { key: "todo", label: "К работе", color: "#929bad" },
  { key: "inProgress", label: "В работе", color: "#4f86d9" },
  { key: "review", label: "На проверке", color: "#a9c2df" },
  { key: "done", label: "Готово", color: "#248b68" },
];

const PRIORITY_LABELS = {
  High: "Высокий",
  Medium: "Средний",
  Low: "Низкий",
  Высокий: "Высокий",
  Средний: "Средний",
  Низкий: "Низкий",
};

function flattenTasks(tasks) {
  if (Array.isArray(tasks)) return tasks;
  if (!tasks || typeof tasks !== "object") return [];
  return STATUS_META.flatMap(({ key }) =>
    Array.isArray(tasks[key])
      ? tasks[key].map((task) => ({ ...task, status: task.status || key }))
      : [],
  );
}

function sumPoints(items) {
  return items.reduce((total, task) => total + (Number(task.points) || 0), 0);
}

function formatDate(value) {
  if (!value) return "Без срока";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function MetricCard({ title, value, note, accent = "text-slate-900", detail }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 text-sm text-slate-500">
        <span>{title}</span>
        <span className="group relative inline-flex cursor-help items-center justify-center text-slate-400">
          <span
            aria-label={detail || title}
            tabIndex={0}
            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold leading-none outline-none hover:border-violet-400 hover:text-violet-600 focus:border-violet-400 focus:text-violet-600"
          >
            ?
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute right-0 top-6 z-30 hidden w-56 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs font-normal leading-relaxed text-slate-600 shadow-xl group-hover:block group-focus-within:block"
          >
            {detail || title}
          </span>
        </span>
      </div>
      <div className={`mt-2 text-3xl font-semibold tracking-tight ${accent}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{note}</div>
    </section>
  );
}

function DonutChart({ counts, total }) {
  const colors = STATUS_META.map((item) => item.color);
  const values = STATUS_META.map((item) => counts[item.key] || 0);
  const circumference = 2 * Math.PI * 42;
  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 120 120"
        className="h-36 w-36"
        role="img"
        aria-label="Распределение задач по статусам"
      >
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="#eef1f5"
          strokeWidth="13"
        />
        {values.map((value, index) => {
          const length = total ? (value / total) * circumference : 0;
          const circle = (
            <circle
              key={STATUS_META[index].key}
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke={colors[index]}
              strokeWidth="13"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
              className="cursor-help transition-opacity hover:opacity-75"
              aria-label={`${STATUS_META[index].label}: ${value} задач`}
            >
              <title>{`${STATUS_META[index].label}: ${value} задач`}</title>
            </circle>
          );
          offset += length;
          return circle;
        })}
        <text
          x="60"
          y="57"
          textAnchor="middle"
          className="fill-slate-800"
          fontSize="21"
          fontWeight="700"
        >
          {total}
        </text>
        <text
          x="60"
          y="73"
          textAnchor="middle"
          className="fill-slate-400"
          fontSize="8"
        >
          задач
        </text>
      </svg>
      <div className="mt-2 w-full space-y-2">
        {STATUS_META.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
            <span className="text-slate-500">
              {counts[item.key] || 0} задач
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BurndownChart({ totalPoints, donePoints }) {
  const remaining = Math.max(0, totalPoints - donePoints);
  const max = Math.max(totalPoints, 1);
  const actualY = 160 - (remaining / max) * 125;
  const idealEnd = 160;
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <i className="h-0.5 w-5 bg-blue-500" /> Факт
        </span>
        <span className="flex items-center gap-2">
          <i className="h-0.5 w-5 border-t border-dashed border-slate-400" />{" "}
          План
        </span>
        <span className="ml-auto">{remaining} SP осталось</span>
      </div>
      <svg
        viewBox="0 0 600 190"
        className="h-52 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Схематичный график прогресса спринта"
      >
        {[35, 70, 105, 140, 175].map((y) => (
          <line key={y} x1="35" x2="590" y1={y} y2={y} stroke="#e8edf3" />
        ))}
        <line x1="35" y1="20" x2="35" y2="175" stroke="#cbd5e1" />
        <line x1="35" y1="175" x2="590" y2="175" stroke="#cbd5e1" />
        <path
          d={`M35 25 L590 ${idealEnd}`}
          fill="none"
          stroke="#8792a5"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <path
          d={`M35 25 L130 25 L130 ${Math.max(25, actualY - 25)} L245 ${Math.max(25, actualY - 25)} L245 ${actualY} L390 ${actualY} L390 ${actualY} L590 ${actualY}`}
          fill="none"
          stroke="#4f86d9"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle
          cx="390"
          cy={actualY}
          r="5"
          fill="#4f86d9"
          stroke="white"
          strokeWidth="2"
          className="cursor-help"
        >
          <title>{`Текущий срез: ${remaining} SP осталось. Выполнено: ${donePoints} SP из ${totalPoints} SP.`}</title>
        </circle>
        <text x="35" y="188" fontSize="10" fill="#8792a5">
          Старт
        </text>
        <text x="560" y="188" fontSize="10" fill="#8792a5">
          Финиш
        </text>
        <text x="5" y="28" fontSize="10" fill="#8792a5">
          {max}
        </text>
        <text x="12" y="177" fontSize="10" fill="#8792a5">
          0
        </text>
      </svg>
      <p className="mt-1 text-xs text-slate-400">
        Упрощённая визуализация по текущему объёму задач. Для настоящего
        burndown нужны ежедневные снимки прогресса.
      </p>
    </div>
  );
}

export default function AnalyticsPage({ tasks = {} }) {
  const allTasks = useMemo(() => flattenTasks(tasks), [tasks]);
  const sprintOptions = useMemo(
    () =>
      [
        ...new Set(
          allTasks
            .map((task) => task.sprintId)
            .filter((id) => id !== null && id !== undefined && id !== ""),
        ),
      ].sort(),
    [allTasks],
  );
  const [selectedSprint, setSelectedSprint] = useState("all");
  const [period, setPeriod] = useState("all");
  const [assignee, setAssignee] = useState("all");

  const filteredTasks = useMemo(() => {
    let result = allTasks;
    if (selectedSprint !== "all")
      result = result.filter(
        (task) => String(task.sprintId) === selectedSprint,
      );
    if (assignee !== "all")
      result = result.filter(
        (task) => (task.assignee || "Не назначен") === assignee,
      );
    if (period !== "all") {
      const now = new Date();
      const days = Number(period);
      const from = new Date(now);
      from.setDate(now.getDate() - days);
      result = result.filter((task) => {
        if (!task.deadline) return false;
        const deadline = new Date(`${task.deadline}T23:59:59`);
        return (
          !Number.isNaN(deadline.getTime()) &&
          deadline >= from &&
          deadline <= now
        );
      });
    }
    return result;
  }, [allTasks, selectedSprint, assignee, period]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        STATUS_META.map(({ key }) => [
          key,
          filteredTasks.filter((task) => (task.status || "todo") === key)
            .length,
        ]),
      ),
    [filteredTasks],
  );
  const total = filteredTasks.length;
  const doneTasks = filteredTasks.filter((task) => task.status === "done");
  const totalPoints = sumPoints(filteredTasks);
  const donePoints = sumPoints(doneTasks);
  const completion = totalPoints
    ? Math.round((donePoints / totalPoints) * 100)
    : 0;
  const overdue = filteredTasks.filter(
    (task) =>
      task.deadline &&
      new Date(`${task.deadline}T23:59:59`) < new Date() &&
      task.status !== "done",
  ).length;
  const assignees = [
    ...new Set(allTasks.map((task) => task.assignee || "Не назначен")),
  ].sort();
  const workload = useMemo(() => {
    const map = new Map();
    filteredTasks.forEach((task) => {
      const name = task.assignee || "Не назначен";
      const current = map.get(name) || { name, points: 0, done: 0, count: 0 };
      current.points += Number(task.points) || 0;
      current.count += 1;
      if (task.status === "done") current.done += Number(task.points) || 0;
      map.set(name, current);
    });
    return [...map.values()].sort((a, b) => b.points - a.points);
  }, [filteredTasks]);
  const maxWorkload = Math.max(...workload.map((person) => person.points), 1);

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 md:px-7">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Аналитика
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Единый обзор задач и Story Points по проекту
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Экспорт отчёта
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative inline-flex h-9 items-center rounded-lg border border-violet-100 bg-violet-50 pl-3 pr-8 text-sm font-medium text-violet-600 transition hover:bg-violet-100">
            <span className="mr-2 text-base leading-none">⇄</span>
            <span className="sr-only">Выбрать спринт</span>
            <select
              aria-label="Фильтр по спринту"
              value={selectedSprint}
              onChange={(event) => setSelectedSprint(event.target.value)}
              className="max-w-[150px] cursor-pointer appearance-none bg-transparent text-sm font-medium text-violet-600 outline-none"
            >
              <option value="all">Все спринты</option>
              {sprintOptions.map((id) => (
                <option key={id} value={String(id)}>
                  Спринт {id}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 fill-none stroke-current"
              strokeWidth="1.7"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </label>

          <label className="relative inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 shadow-sm transition hover:border-slate-300">
            <span className="sr-only">Выбрать период</span>
            <select
              aria-label="Фильтр по периоду"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="max-w-[190px] cursor-pointer appearance-none bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">12–23 октября 2026</option>
              <option value="7">Последние 7 дней</option>
              <option value="30">Последние 30 дней</option>
              <option value="90">Последние 90 дней</option>
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 fill-none stroke-slate-500"
              strokeWidth="1.7"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </label>

          <label className="relative inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 shadow-sm transition hover:border-slate-300">
            <span className="sr-only">Выбрать участника</span>
            <select
              aria-label="Фильтр по участнику"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              className="max-w-[160px] cursor-pointer appearance-none bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">Все участники</option>
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 fill-none stroke-slate-500"
              strokeWidth="1.7"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </label>
          <span className="ml-auto text-xs text-slate-400">
            Срез: 16 октября, 18:00
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Динамика — пример данных
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Выполнено по SP"
            value={`${completion}%`}
            note={`${donePoints} из ${totalPoints} SP`}
            accent="text-emerald-600"
            detail="Доля выполненных story points от общего объёма"
          />
          <MetricCard
            title="Задач готово"
            value={`${doneTasks.length} / ${total}`}
            note={`${Math.max(0, total - doneTasks.length)} задач ещё открыто`}
            accent="text-emerald-600"
          />
          <MetricCard
            title="Объём спринта"
            value={`${totalPoints} SP`}
            note={`${total} задач в выбранной выборке`}
          />
          <MetricCard
            title="Просрочено"
            value={overdue}
            note="Открытые задачи с прошедшим сроком"
            accent={overdue ? "text-rose-600" : "text-emerald-600"}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-800">
                Прогресс спринта · Burndown
              </h2>
              <span className="text-xs text-slate-500">
                {Math.max(0, totalPoints - donePoints)} SP осталось
              </span>
            </div>
            <BurndownChart totalPoints={totalPoints} donePoints={donePoints} />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">
                Распределение задач
              </h2>
              <span className="text-xs text-slate-500">{total} задач</span>
            </div>
            {total ? (
              <DonutChart counts={counts} total={total} />
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">
                Нет задач для выбранных фильтров
              </p>
            )}
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Нагрузка команды</h2>
              <span className="text-xs text-slate-500">Назначено, SP</span>
            </div>
            {workload.length ? (
              <div className="space-y-5">
                {workload.map((person) => (
                  <div key={person.name}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700">
                        {person.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {person.points} SP · готово {person.done}
                      </span>
                    </div>
                    <div
                      className="h-2.5 cursor-help overflow-hidden rounded-full bg-slate-100 transition-shadow hover:ring-2 hover:ring-violet-200"
                      title={`${person.name}: всего ${person.points} SP, выполнено ${person.done} SP, осталось ${Math.max(0, person.points - person.done)} SP · ${person.count} задач`}
                    >
                      <div
                        className="flex h-full"
                        style={{
                          width: `${(person.points / maxWorkload) * 100}%`,
                        }}
                      >
                        <div
                          className="h-full bg-emerald-600"
                          style={{
                            width: `${person.points ? (person.done / person.points) * 100 : 0}%`,
                          }}
                        />
                        <div className="h-full flex-1 bg-blue-500" />
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {person.count} задач
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-slate-400">
                Задачи пока никому не назначены
              </p>
            )}
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="mb-4 font-semibold text-slate-800">
              Сводка по статусам
            </h2>
            <div className="space-y-4">
              {STATUS_META.map((status) => {
                const count = counts[status.key] || 0;
                const percent = total ? (count / total) * 100 : 0;
                return (
                  <div key={status.key}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-600">{status.label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: status.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-800">
              Задачи в выбранной выборке
            </h2>
            <span className="text-xs text-slate-500">{total} записей</span>
          </div>
          {filteredTasks.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b border-slate-100 text-xs text-slate-400">
                  <tr>
                    <th className="px-2 py-3 font-medium">Задача</th>
                    <th className="px-2 py-3 font-medium">Статус</th>
                    <th className="px-2 py-3 font-medium">Исполнитель</th>
                    <th className="px-2 py-3 font-medium">Приоритет</th>
                    <th className="px-2 py-3 text-right font-medium">SP</th>
                    <th className="px-2 py-3 text-right font-medium">Срок</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task, index) => {
                    const status =
                      STATUS_META.find((item) => item.key === task.status) ||
                      STATUS_META[0];
                    return (
                      <tr key={task.id || index} className="hover:bg-slate-50">
                        <td className="px-2 py-3">
                          <div className="font-medium text-slate-800">
                            {task.title || "Без названия"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {task.id || "—"}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className="rounded-full px-2 py-1 text-xs"
                            style={{
                              color: status.color,
                              backgroundColor: `${status.color}18`,
                            }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-slate-600">
                          {task.assignee || "Не назначен"}
                        </td>
                        <td className="px-2 py-3 text-slate-600">
                          {PRIORITY_LABELS[task.priority] ||
                            task.priority ||
                            "—"}
                        </td>
                        <td className="px-2 py-3 text-right tabular-nums text-slate-700">
                          {Number(task.points) || 0}
                        </td>
                        <td className="px-2 py-3 text-right text-slate-500">
                          {formatDate(task.deadline)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              Нет задач для выбранных фильтров. Попробуй выбрать другой спринт
              или период.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
