export default function Topbar({ onOpenAI }) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium flex items-center gap-2">
          Платформа 2.0
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск в проекте..."
            className="pl-8 pr-4 py-1.5 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
          <span className="absolute left-2.5 top-2 text-gray-400">⌕</span>
        </div>

        <button
          onClick={onOpenAI}
          className="text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-2"
        >
          ИИ-ассистент
        </button>

        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
          АК
        </div>
      </div>
    </header>
  );
}
