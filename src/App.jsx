import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIChatPanel from "./components/ai/AIChatPanel";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BoardPage, { initialTasks } from "./pages/Boardpage";
import BacklogPage from "./pages/BacklogPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiContext, setAiContext] = useState(null);
  const [globalTasks, setGlobalTasks] = useState(initialTasks);
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
    <BrowserRouter>
      <div className="flex h-screen w-screen bg-white font-sans text-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full bg-gray-50/30">
          <Topbar
            onOpenAI={handleOpenAIGlobal}
            tasks={globalTasks}
            onTaskClick={setSelectedTask}
          />

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <BoardPage
                    onOpenAIWithTask={handleOpenAIWithTask}
                    tasks={globalTasks}
                    setTasks={setGlobalTasks}
                    externalSelectedTask={selectedTask}
                    onCloseExternalTask={() => setSelectedTask(null)}
                  />
                }
              />

              <Route
                path="/backlog"
                element={
                  <BacklogPage
                    tasks={globalTasks}
                    onTasksChange={setGlobalTasks}
                  />
                }
              />

              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route
                path="/projects"
                element={
                  <div className="p-6 text-gray-500">
                    Проекты скоро появятся
                  </div>
                }
              />

              <Route
                path="/sprints"
                element={
                  <div className="p-6 text-gray-500">
                    Спринты скоро появятся
                  </div>
                }
              />
            </Routes>
          </main>
        </div>

        <AIChatPanel
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          contextTask={aiContext}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
