import { useState } from "react";
import {
  Folder,
  LayoutDashboard,
  ListTodo,
  RefreshCw,
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
    { icon: Folder, label: "Проекты" },
    { icon: LayoutDashboard, label: "Доска", active: true },
    { icon: ListTodo, label: "Бэклог" },
    { icon: RefreshCw, label: "Спринты" },
    { icon: BarChart2, label: "Аналитика" },
    { icon: Settings, label: "Настройки" },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } border-r border-gray-200 bg-white h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0`}
    >
      {/* Логотип */}
      <div
        className={`flex items-center gap-3 mb-8 pt-6 ${isCollapsed ? "justify-center px-0" : "px-6"}`}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
          Р
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl whitespace-nowrap">Ржомба</span>
        )}
      </div>

      {/* Навигация */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            title={isCollapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              item.active
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </a>
        ))}
      </nav>

      {/* Нижняя часть */}
      <div className="px-3 pb-6 flex flex-col gap-4">
        <button
          className={`flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors border border-gray-200 ${isCollapsed ? "justify-center" : ""}`}
        >
          <UserPlus size={20} className="shrink-0" />
          {!isCollapsed && (
            <span className="whitespace-nowrap">Пригласить команду</span>
          )}
        </button>

        {!isCollapsed && (
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <HelpCircle size={16} className="shrink-0" />
            <span className="whitespace-nowrap">Помощь и сочетания клавиш</span>
          </button>
        )}

        {/* Кнопка сворачивания */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-gray-700 transition-colors mt-2 ${isCollapsed ? "justify-center" : ""}`}
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
