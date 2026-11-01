import { useState } from "react";
import AIChatPanel from "./components/ai/AIChatPanel";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BoardPage from "./pages/Boardpage";

function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiContext, setAiContext] = useState(null);

  // 1. Создаем глобальное состояние для задач
  const [globalTasks, setGlobalTasks] = useState({});

  // 2. Состояние для выбранной задачи (чтобы поиск мог ее открыть)
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenAIGlobal = () => {
    setAiContext(null);
    setIsAIChatOpen(true);
  };

  const handleOpenAIWithTask = (task) => {
    setAiContext(task);
    setIsAIChatOpen(true);
  };

  return (
    <div className="flex h-screen w-screen bg-white font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full bg-gray-50/30">
        {/* Передаем задачи и функцию клика в Topbar для поиска */}
        <Topbar
          onOpenAI={handleOpenAIGlobal}
          tasks={globalTasks}
          onTaskClick={setSelectedTask}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Передаем функции вниз, в BoardPage */}
          <BoardPage
            onOpenAIWithTask={handleOpenAIWithTask}
            onTasksChange={setGlobalTasks} // <-- Чтобы доска отдавала задачи наверх
            externalSelectedTask={selectedTask} // <-- Чтобы поиск мог открыть задачу
            onCloseExternalTask={() => setSelectedTask(null)} // <-- Закрытие карточки
          />
        </main>
      </div>

      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        contextTask={aiContext}
      />
    </div>
  );
}

export default App;
