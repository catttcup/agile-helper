import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const PRIORITY_COLORS = {
  Высокий: "#E39A2D",
  Средний: "#9299AA",
  Низкий: "#6095E8",
};
const MEMBERS = {
  АК: { name: "Анна Ким", color: "#EEE9FF", text: "#7557F5" },
  МС: { name: "Мария Соколова", color: "#DDEEEB", text: "#397D73" },
  ДК: { name: "Дмитрий Козлов", color: "#EDE3D8", text: "#956A43" },
  ИВ: { name: "Илья Волков", color: "#E4EAFE", text: "#5675C9" },
  ЕО: { name: "Елена Орлова", color: "#F8E4EA", text: "#B65E7B" },
  ПС: { name: "Павел Смирнов", color: "#E6E9EF", text: "#64748B" },
};
const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};
const monthLabel = (date) =>
  new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(date);

export default function CalendarPage({
  tasks = {},
  onCreateTask,
  onTaskClick,
}) {
  // Неделя из референса: 2–8 ноября 2026.
  const [anchorDate, setAnchorDate] = useState(new Date(2026, 10, 2));
  const [view, setView] = useState("week");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const allTasks = useMemo(
    () =>
      Object.entries(tasks || {}).flatMap(([status, items]) =>
        (items || []).map((task) => ({ ...task, status })),
      ),
    [tasks],
  );

  const filteredTasks = allTasks.filter(
    (task) =>
      task.deadline &&
      (!assignee || task.assignee === assignee) &&
      (!priority || task.priority === priority),
  );

  const weekStart = new Date(anchorDate);
  weekStart.setDate(anchorDate.getDate() - ((anchorDate.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );
  const monthStart = new Date(
    anchorDate.getFullYear(),
    anchorDate.getMonth(),
    1,
  );
  const monthGridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
  const monthDays = Array.from({ length: 42 }, (_, index) =>
    addDays(monthGridStart, index),
  );
  const visibleDays = view === "week" ? weekDays : monthDays;

  const movePeriod = (direction) => {
    setAnchorDate((current) =>
      view === "week"
        ? addDays(current, direction * 7)
        : new Date(current.getFullYear(), current.getMonth() + direction, 1),
    );
  };
  const isToday = (date) => dateKey(date) === dateKey(new Date());
  const tasksForDay = (date) =>
    filteredTasks.filter((task) => task.deadline === dateKey(date));
  const rangeLabel =
    view === "week"
      ? `${weekDays[0].getDate()}–${weekDays[6].getDate()} ${monthLabel(weekDays[0])} ${weekDays[0].getFullYear()}`
      : `${monthLabel(anchorDate)} ${anchorDate.getFullYear()}`;

  return (
    <div className="flex min-h-full w-full bg-white">
      <section
        className={`min-w-0 flex-1 bg-white pb-6 text-[#252833] transition-all duration-200 ${selectedTask ? "px-4 pt-5" : "px-8 pt-8"}`}
      >
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.6px]">
              Календарь
            </h1>
            <p className="mt-2 text-[16px] text-[#858B9B]">
              Дедлайны задач команды — в одном календаре.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#858B9B]">6 участников</span>
            <button
              onClick={onCreateTask}
              className="flex h-11 items-center gap-2 rounded-lg bg-[#6C59ED] px-4 text-[14px] font-medium text-white hover:bg-[#5D4BDD]"
            >
              <Plus size={22} strokeWidth={2} />
              Создать задачу
            </button>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => movePeriod(-1)}
              aria-label="Предыдущий период"
              className="flex h-11 w-[58px] items-center justify-center rounded-lg border border-[#E2E5ED] text-[#788094] hover:bg-gray-50"
            >
              <ChevronLeft size={21} />
            </button>
            <span className="min-w-[138px] text-center text-[14px] font-semibold">
              {rangeLabel}
            </span>
            <button
              onClick={() => movePeriod(1)}
              aria-label="Следующий период"
              className="flex h-11 w-[58px] items-center justify-center rounded-lg border border-[#E2E5ED] text-[#788094] hover:bg-gray-50"
            >
              <ChevronRight size={21} />
            </button>
            <button
              onClick={() => setAnchorDate(new Date())}
              className="ml-1 h-11 rounded-lg border border-[#E2E5ED] px-4 text-[14px] font-medium hover:bg-gray-50"
            >
              Сегодня
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              className="h-11 rounded-lg border border-[#E2E5ED] bg-white px-3 text-[14px] outline-none"
            >
              <option value="">Исполнитель</option>
              {Object.entries(MEMBERS).map(([initials, member]) => (
                <option key={initials} value={initials}>
                  {member.name}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-11 rounded-lg border border-[#E2E5ED] bg-white px-3 text-[14px] outline-none"
            >
              <option value="">Приоритет</option>
              {Object.keys(PRIORITY_COLORS).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <div className="flex h-11 items-center rounded-xl bg-[#F1F2F6] p-1">
              <button
                onClick={() => setView("month")}
                className={`h-9 rounded-lg px-5 text-[14px] ${
                  view === "month"
                    ? "bg-white text-[#6C59ED] shadow-sm"
                    : "text-[#858B9B]"
                }`}
              >
                Месяц
              </button>
              <button
                onClick={() => setView("week")}
                className={`h-9 rounded-lg px-5 text-[14px] ${
                  view === "week"
                    ? "bg-white text-[#6C59ED] shadow-sm"
                    : "text-[#858B9B]"
                }`}
              >
                Неделя
              </button>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-7 overflow-hidden rounded-lg border border-[#E1E4EC] ${
            view === "week" ? "min-h-[610px]" : ""
          }`}
        >
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <div
              key={day}
              className="border-b border-r border-[#E5E7EE] bg-white px-3 py-4 text-[14px] text-[#858B9B]"
            >
              {day}
            </div>
          ))}

          {visibleDays.map((date) => {
            const dayTasks = tasksForDay(date);
            const outsideMonth =
              view === "month" && date.getMonth() !== anchorDate.getMonth();
            const weekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                key={dateKey(date)}
                className={`min-h-[${view === "week" ? "550px" : "145px"}] border-b border-r border-[#E5E7EE] ${
                  weekend ? "bg-[#F7F8FA]" : "bg-white"
                } ${isToday(date) ? "bg-[#FAF9FF]" : ""} ${
                  outsideMonth ? "text-[#B8BECA]" : ""
                }`}
                style={{ minHeight: view === "week" ? 550 : 145 }}
              >
                <div className="flex h-[104px] flex-col px-3 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#858B9B]">
                      {view === "week" ? monthLabel(date) + " · " : ""}
                      {date.getDate()}
                    </span>
                    {isToday(date) && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C59ED] text-[14px] font-semibold text-white">
                        {date.getDate()}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[13px] text-[#858B9B]">
                    {isToday(date)
                      ? "Сегодня"
                      : view === "week"
                        ? monthLabel(date)
                        : ""}
                  </div>
                  <div className="mt-1 text-[13px] text-[#858B9B]">
                    {dayTasks.length
                      ? `${dayTasks.length} ${dayTasks.length === 1 ? "задача" : dayTasks.length < 5 ? "задачи" : "задач"}`
                      : view === "week" && weekend
                        ? "Нет дедлайнов"
                        : ""}
                  </div>
                </div>

                <div className="space-y-2 px-2.5 pb-3">
                  {dayTasks.slice(0, view === "week" ? 10 : 3).map((task) => {
                    const member = MEMBERS[task.assignee] || {
                      name: task.assignee || "Не назначен",
                      color: "#ECEEF3",
                      text: "#687083",
                    };
                    return (
                      <button
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          onTaskClick?.(task);
                        }}
                        className="block min-h-[143px] w-full rounded-md border border-[#E2E5ED] bg-white px-3 py-3 text-left shadow-[0_1px_2px_rgba(20,25,40,0.03)] transition hover:border-[#C9C2FF] hover:shadow-sm"
                      >
                        <div className="mb-2 text-[11px] tracking-[0.1px] text-[#858B9B]">
                          {task.id}
                        </div>
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-[5px] h-[7px] w-[7px] shrink-0 rounded-full"
                            style={{
                              background:
                                PRIORITY_COLORS[task.priority] || "#9299AA",
                            }}
                          />
                          <span className="line-clamp-2 text-[15px] leading-[22px] text-[#292D38]">
                            {task.title}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                            style={{
                              background: member.color,
                              color: member.text,
                            }}
                          >
                            {task.assignee || "—"}
                          </span>
                          <span className="truncate text-[12px] text-[#858B9B]">
                            {member.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {dayTasks.length > 3 && view === "month" && (
                    <button className="text-[12px] font-medium text-[#6C59ED]">
                      + ещё {dayTasks.length - 3}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#858B9B]">
          <span>
            {filteredTasks.length} задач · {rangeLabel} · По дате дедлайна
          </span>
          <div className="flex items-center gap-3">
            <span>Приоритет:</span>
            {Object.entries(PRIORITY_COLORS).map(([label, color]) => (
              <span key={label} className="flex items-center gap-1">
                <i
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </footer>
      </section>
      {selectedTask && (
        <aside className="relative min-h-full w-[360px] shrink-0 border-l border-[#E5E7EE] bg-white p-6">
          <div className="mb-7 flex items-center justify-between text-[12px] text-[#858B9B]">
            {selectedTask.id}
            <button onClick={() => setSelectedTask(null)}>Закрыть</button>
          </div>
          <h2 className="text-xl font-semibold">{selectedTask.title}</h2>
          <div className="mt-7 space-y-5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#858B9B]">Исполнитель</span>
              {MEMBERS[selectedTask.assignee]?.name ||
                selectedTask.assignee ||
                "Не назначен"}
            </div>
            <div className="flex justify-between">
              <span className="text-[#858B9B]">Приоритет</span>
              {selectedTask.priority || "—"}
            </div>
            <div className="flex justify-between">
              <span className="text-[#858B9B]">Дедлайн</span>
              {selectedTask.deadline || "—"}
            </div>
            <hr />
            <p className="leading-6 text-[#737B8D]">
              {selectedTask.description || "Описание не добавлено."}
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
