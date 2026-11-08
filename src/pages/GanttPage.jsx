import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const STATES = {
  todo: ["К работе", "#9299AA"],
  inProgress: ["В работе", "#D89836"],
  review: ["На проверке", "#9A8CF1"],
  done: ["Готово", "#3E9C7A"],
};
const add = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export default function GanttPage({ tasks = {} }) {
  const [shift, setShift] = useState(0);
  const [scale, setScale] = useState("week");
  const start = add(
    new Date(new Date().setHours(0, 0, 0, 0)),
    shift * (scale === "week" ? 7 : 30),
  );
  const count = scale === "week" ? 28 : 90,
    width = scale === "week" ? 34 : 16;
  const days = Array.from({ length: count }, (_, i) => add(start, i));
  const rows = useMemo(
    () =>
      Object.entries(tasks || {}).flatMap(([status, list]) =>
        (list || []).filter((t) => t.deadline).map((t) => ({ ...t, status })),
      ),
    [tasks],
  );
  return (
    <div className="min-h-full bg-white px-6 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Диаграмма Ганта</h1>
          <p className="mt-1 text-sm text-gray-500">
            Сроки и последовательность задач проекта.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border p-2"
            onClick={() => setShift((v) => v - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={() => setShift(0)}
          >
            Сегодня
          </button>
          <button
            className="rounded-lg border p-2"
            onClick={() => setShift((v) => v + 1)}
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setScale("week")}
            className={`rounded-lg border px-3 py-2 text-sm ${scale === "week" ? "bg-violet-50 text-violet-700" : ""}`}
          >
            Недели
          </button>
          <button
            onClick={() => setScale("month")}
            className={`rounded-lg border px-3 py-2 text-sm ${scale === "month" ? "bg-violet-50 text-violet-700" : ""}`}
          >
            Месяцы
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <div style={{ minWidth: 300 + count * width }}>
          <div className="flex border-b bg-gray-50">
            <div className="sticky left-0 z-10 w-72 shrink-0 border-r bg-gray-50 p-3 text-xs font-semibold text-gray-500">
              Задача
            </div>
            <div className="flex">
              {days.map((d) => (
                <div
                  key={d.toISOString()}
                  style={{ width }}
                  className="shrink-0 border-r py-3 text-center text-[10px] text-gray-500"
                >
                  {scale === "week"
                    ? d.getDate()
                    : d.getDate() === 1
                      ? new Intl.DateTimeFormat("ru-RU", {
                          month: "short",
                        }).format(d)
                      : ""}
                </div>
              ))}
            </div>
          </div>
          {rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400">
              Нет задач с указанными дедлайнами.
            </div>
          ) : (
            rows.map((t) => {
              const due = new Date(t.deadline + "T00:00:00");
              const offset = Math.round((due - start) / 86400000);
              const left = Math.max(0, offset - 4);
              const show = offset >= 0 && offset < count;
              return (
                <div key={t.id} className="flex h-14 border-b">
                  <div className="sticky left-0 z-[1] flex w-72 shrink-0 items-center gap-2 border-r bg-white px-3">
                    <span className="text-[10px] text-gray-400">{t.id}</span>
                    <span className="truncate text-xs">{t.title}</span>
                  </div>
                  <div className="relative flex">
                    {days.map((d) => (
                      <div
                        key={d.toISOString()}
                        style={{ width }}
                        className="h-full shrink-0 border-r border-gray-100"
                      />
                    ))}
                    {show && (
                      <div
                        title={`${t.title}: ${t.deadline}`}
                        className="absolute top-4 h-6 rounded opacity-85"
                        style={{
                          left: left * width,
                          width: Math.max(
                            width,
                            Math.min(5, count - left) * width,
                          ),
                          background: STATES[t.status]?.[1] || "#9299AA",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-4 text-xs text-gray-500">
        {Object.entries(STATES).map(([id, [name, color]]) => (
          <span key={id}>
            <i
              className="mr-1 inline-block h-2 w-2 rounded-sm"
              style={{ background: color }}
            />
            {name}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Полосы условно показывают пять дней перед дедлайном. Для точной
        диаграммы нужно добавить дату начала задачи.
      </p>
    </div>
  );
}
