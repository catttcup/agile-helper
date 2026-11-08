import { useState } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  GripVertical,
  Plus,
  Camera,
  LogOut,
} from "lucide-react";

const TABS = [
  { id: "members", label: "Участники и роли" },
  { id: "board", label: "Настройки доски" },
  { id: "profile", label: "Мой профиль" },
];

const MEMBERS = [
  {
    id: "1",
    name: "Анна Ким",
    email: "anna@studio.team",
    initials: "АК",
    color: "bg-indigo-100 text-indigo-700",
    role: "owner",
    you: true,
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    email: "dmitry@studio.team",
    initials: "ДК",
    color: "bg-amber-100 text-amber-700",
    role: "admin",
  },
  {
    id: "3",
    name: "Мария Соколова",
    email: "maria@studio.team",
    initials: "МС",
    color: "bg-emerald-100 text-emerald-700",
    role: "member",
  },
  {
    id: "4",
    name: "Илья Волков",
    email: "ilya@studio.team",
    initials: "ИВ",
    color: "bg-sky-100 text-sky-700",
    role: "member",
  },
  {
    id: "5",
    name: "Елена Орлова",
    email: "elena@studio.team",
    initials: "ЕО",
    color: "bg-violet-100 text-violet-700",
    role: "member",
  },
  {
    id: "6",
    name: "Павел Смирнов",
    email: "pavel@studio.team",
    initials: "ПС",
    color: "bg-rose-100 text-rose-700",
    role: "viewer",
  },
];

const ROLE_CARDS = [
  {
    title: "Администратор",
    text: "Участники, настройки и все задачи проекта.",
  },
  { title: "Участник", text: "Создание, редактирование и обсуждение задач." },
  {
    title: "Наблюдатель",
    text: "Чтение проекта и комментарии без изменения задач.",
  },
];

const COLUMNS = [
  {
    id: "todo",
    name: "К работе",
    color: "bg-slate-400",
    statusType: "not_started",
    wip: null,
    count: 3,
  },
  {
    id: "inProgress",
    name: "В работе",
    color: "bg-amber-400",
    statusType: "in_progress",
    wip: 3,
    count: 4,
  },
  {
    id: "review",
    name: "На проверке",
    color: "bg-violet-400",
    statusType: "in_progress",
    wip: 2,
    count: 2,
  },
  {
    id: "done",
    name: "Готово",
    color: "bg-emerald-500",
    statusType: "done",
    wip: null,
    count: 2,
  },
];

const STATUS_TYPES = {
  not_started: "Не начато",
  in_progress: "В процессе",
  done: "Завершено",
};

const PROFILE = {
  firstName: "Анна",
  lastName: "Ким",
  email: "anna@studio.team",
  position: "Product designer",
  timezone: "Москва · UTC+3",
  initials: "АК",
  theme: "light",
  notifications: { mentions: true, assigned: true, sprint: false },
};

export default function SettingsPage() {
  const [tab, setTab] = useState("members");

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Настройки</h1>
      <p className="mt-1 text-sm text-gray-500">
        Платформа 2.0 · управление проектом и личными предпочтениями
      </p>

      <div className="mt-5 flex gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === item.id
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "members" && <MembersTab />}
        {tab === "board" && <BoardTab />}
        {tab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}

function MembersTab() {
  const [members, setMembers] = useState(MEMBERS);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const visible = members.filter((m) => {
    const q = query.trim().toLowerCase();
    const hit =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);
    return hit && (role === "all" || m.role === role);
  });

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Участники и роли
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {members.length} участников · доступ только к этому проекту
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <UserPlus size={16} />
          Пригласить участника
        </button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти по имени или почте..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
        >
          <option value="all">Все роли</option>
          <option value="owner">Владелец</option>
          <option value="admin">Администратор</option>
          <option value="member">Участник</option>
          <option value="viewer">Наблюдатель</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Участник</th>
              <th className="px-4 py-3">Доступ</th>
              <th className="px-4 py-3">Роль в проекте</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${m.color}`}
                    >
                      {m.initials}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {m.name}
                        {m.you && (
                          <span className="font-normal text-gray-400">
                            {" "}
                            (вы)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Активен
                  </span>
                </td>
                <td className="px-4 py-3">
                  {m.role === "owner" ? (
                    <span className="inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700">
                      Владелец
                    </span>
                  ) : (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        setMembers((list) =>
                          list.map((item) =>
                            item.id === m.id
                              ? { ...item, role: e.target.value }
                              : item,
                          ),
                        )
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
                    >
                      <option value="admin">Администратор</option>
                      <option value="member">Участник</option>
                      <option value="viewer">Наблюдатель</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {ROLE_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="font-medium text-gray-900">{card.title}</div>
            <p className="mt-1 text-sm text-gray-500">{card.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Владельца нельзя удалить или понизить в роли. Передайте владение в меню
        участника.
      </p>
    </div>
  );
}

function BoardTab() {
  const [columns, setColumns] = useState(COLUMNS);
  const [warn, setWarn] = useState(true);
  const [dirty, setDirty] = useState(false);

  const patch = (id, field, value) => {
    setColumns((list) =>
      list.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
    setDirty(true);
  };

  const overflow = columns.find((c) => c.wip != null && c.count > c.wip);

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Колонки доски</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Порядок колонок определяет движение задач. Перетащите строку, чтобы
            изменить его.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus size={16} />
          Добавить колонку
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-10 px-3 py-3" />
              <th className="px-3 py-3">Название колонки</th>
              <th className="px-3 py-3">Тип статуса</th>
              <th className="px-3 py-3">WIP-лимит</th>
              <th className="px-3 py-3">Сейчас в колонке</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {columns.map((col) => {
              const hit = col.wip != null && col.count >= col.wip;
              return (
                <tr key={col.id} className="group">
                  <td className="px-3 py-3 text-gray-300">
                    <GripVertical size={16} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${col.color}`}
                      />
                      <input
                        value={col.name}
                        onChange={(e) => patch(col.id, "name", e.target.value)}
                        className="w-full rounded-md border border-transparent px-2 py-1.5 outline-none hover:border-gray-200 focus:border-indigo-400"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={col.statusType}
                      onChange={(e) =>
                        patch(col.id, "statusType", e.target.value)
                      }
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 outline-none focus:border-indigo-400"
                    >
                      {Object.entries(STATUS_TYPES).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="—"
                      value={col.wip ?? ""}
                      onChange={(e) =>
                        patch(
                          col.id,
                          "wip",
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center outline-none focus:border-indigo-400"
                    />
                  </td>
                  <td className="px-3 py-3">
                    {col.wip != null ? (
                      <span
                        className={
                          hit ? "font-medium text-red-600" : "text-gray-600"
                        }
                      >
                        {col.count} / {col.wip}
                        {hit ? " · лимит достигнут" : ""}
                      </span>
                    ) : (
                      <span className="text-gray-500">{col.count} задачи</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="rounded-md p-1.5 text-gray-400 opacity-0 hover:bg-gray-100 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="font-medium text-gray-900">
            Поведение при превышении WIP
          </h3>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-gray-800">
                Показывать предупреждение
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Перенос разрешён. Переполненная колонка выделяется, команда
                видит превышение.
              </p>
            </div>
            <Toggle
              on={warn}
              onClick={() => {
                setWarn((v) => !v);
                setDirty(true);
              }}
            />
          </div>
          <p className="mt-4 text-xs text-gray-400">
            — Без лимита · Лимит считается по количеству задач, а не по SP.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="font-medium text-gray-900">
            Предпросмотр переполнения
          </h3>
          {overflow ? (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {overflow.name} · {overflow.count} / {overflow.wip}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                WIP превышен на {overflow.count - overflow.wip} задачу.
                Завершите текущую работу перед добавлением новой.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-400">
              Нет колонок с превышением лимита.
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Изменения применяются ко всем участникам проекта.
      </p>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            setColumns(COLUMNS);
            setWarn(true);
            setDirty(false);
          }}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Отменить
        </button>
        <button
          type="button"
          disabled={!dirty}
          onClick={() => setDirty(false)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}

function ProfileTab() {
  const [profile, setProfile] = useState(PROFILE);
  const [notes, setNotes] = useState(PROFILE.notifications);
  const [dirty, setDirty] = useState(false);

  const setField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setDirty(true);
  };

  const themes = [
    { id: "light", label: "Светлая", box: "bg-white" },
    { id: "dark", label: "Тёмная", box: "bg-gray-900" },
    {
      id: "system",
      label: "Система",
      box: "bg-gradient-to-r from-white to-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-3">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Мой профиль
        </h2>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700">
            {profile.initials}
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Camera size={14} />
              Изменить фото
            </button>
            <p className="mt-1 text-xs text-gray-400">JPG, PNG · до 5 МБ</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Имя">
              <input
                value={profile.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Фамилия">
              <input
                value={profile.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Рабочая почта">
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Должность">
            <input
              value={profile.position}
              onChange={(e) => setField("position", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Часовой пояс">
            <select
              value={profile.timezone}
              onChange={(e) => setField("timezone", e.target.value)}
              className={inputClass}
            >
              <option>Москва · UTC+3</option>
              <option>Калининград · UTC+2</option>
              <option>Екатеринбург · UTC+5</option>
              <option>Новосибирск · UTC+7</option>
              <option>Владивосток · UTC+10</option>
            </select>
          </Field>
        </div>

        <p className="mb-5 mt-4 text-xs text-gray-400">
          Видно участникам Studio team
        </p>
        <button
          type="button"
          disabled={!dirty}
          onClick={() => setDirty(false)}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          Сохранить
        </button>
      </div>

      <div className="col-span-2 space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="font-medium text-gray-900">Оформление</h3>
          <p className="mt-1 text-xs text-gray-500">
            Выберите тему. Настройка применяется только к вашему аккаунту.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {themes.map((t) => {
              const active = profile.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setField("theme", t.id)}
                  className={`rounded-lg border-2 p-2 ${active ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
                >
                  <div
                    className={`h-12 rounded-md border border-gray-200 ${t.box}`}
                  />
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-gray-700">
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    )}
                    {t.label}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Выбрана{" "}
            {profile.theme === "light"
              ? "светлая"
              : profile.theme === "dark"
                ? "тёмная"
                : "системная"}{" "}
            тема · сохранено
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-medium text-gray-900">Уведомления</h3>
          <div className="space-y-4">
            {[
              ["mentions", "Упоминания и комментарии"],
              ["assigned", "Изменения назначенных мне задач"],
              ["sprint", "Итоги спринта по почте"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle
                  on={notes[key]}
                  onClick={() => {
                    setNotes((n) => ({ ...n, [key]: !n[key] }));
                    setDirty(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
        >
          <LogOut size={16} />
          Выйти из аккаунта →
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-indigo-600" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`}
      />
    </button>
  );
}
