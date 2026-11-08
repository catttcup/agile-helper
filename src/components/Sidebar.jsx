import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Folder,
  LayoutDashboard,
  ListTodo,
  RefreshCw,
  CalendarDays,
  GanttChartSquare,
  BarChart2,
  Settings,
  UserPlus,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = [
    { icon: Folder, label: "Проекты", path: "/projects" },
    { icon: LayoutDashboard, label: "Доска", path: "/", end: true },
    { icon: ListTodo, label: "Бэклог", path: "/backlog" },
    { icon: RefreshCw, label: "Спринты", path: "/sprints" },
    { icon: CalendarDays, label: "Календарь", path: "/calendar" },
    { icon: GanttChartSquare, label: "Диаграмма Ганта", path: "/gantt" },
    { icon: BarChart2, label: "Аналитика", path: "/analytics" },
    { icon: Settings, label: "Настройки", path: "/settings" },
  ];
  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"} border-r border-gray-200 bg-white h-screen flex flex-col transition-all duration-300 shrink-0`}
    >
      <div
        className={`flex items-center gap-3 mb-8 pt-6 ${isCollapsed ? "justify-center" : "px-6"}`}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
          Р
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl whitespace-nowrap">Ржомба</span>
        )}
      </div>
      {!isCollapsed && (
        <div className="mb-5 px-6 text-xs leading-6 text-gray-500">
          <div>Studio team⌄</div>
          <div>Pro · 6 участников</div>
        </div>
      )}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"} ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
      {!isCollapsed && (
        <div className="px-6 pb-2 text-xs text-gray-400">
          <div className="mb-2 font-medium">ИЗБРАННОЕ</div>
          <div className="py-1">◈ Платформа 2.0</div>
          <div className="py-1">◈ Дизайн-система</div>
        </div>
      )}
      <div className="px-3 pb-6 flex flex-col gap-4">
        <button
          className={`flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 ${isCollapsed ? "justify-center" : ""}`}
        >
          <UserPlus size={20} />
          {!isCollapsed && <span>Пригласить команду</span>}
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-2 text-sm text-gray-400">
            <HelpCircle size={16} />
            Помощь
          </div>
        )}
        <button
          onClick={() => setIsCollapsed((v) => !v)}
          aria-label="Свернуть или развернуть меню"
          className={`flex items-center px-3 py-2 text-gray-400 ${isCollapsed ? "justify-center" : ""}`}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>
    </aside>
  );
}
