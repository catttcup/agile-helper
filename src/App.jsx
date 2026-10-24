import { useState } from "react";
import AIChatPanel from "./components/ai/AIChatPanel";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BoardPage from "./pages/Boardpage";

function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiContext, setAiContext] = useState(null);

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
        <Topbar onOpenAI={handleOpenAIGlobal} />

        <main className="flex-1 overflow-y-auto">
          <BoardPage onOpenAIWithTask={handleOpenAIWithTask} />
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
