import { useState, useEffect } from "react";

export default function AIChatPanel({ isOpen, onClose, contextTask }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Этот эффект срабатывает каждый раз, когда чат открывается
  useEffect(() => {
    if (isOpen) {
      if (contextTask) {
        // Если передана задача — пишем приветствие с контекстом
        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            text: `Я вижу, вы открыли задачу "${contextTask.title}". Чем я могу помочь? Могу сгенерировать описание, разбить на подзадачи или оценить сложность.`,
          },
        ]);
      } else {
        // Если открыли просто так
        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            text: "Привет! Я твой ИИ-ассистент. Чем помочь с проектом?",
          },
        ]);
      }
    }
  }, [isOpen, contextTask]);

  if (!isOpen) return null;

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMessage = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: `Я получил твой запрос: "${text}". (Здесь будет ответ от GigaChat).`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>

      <div className="relative w-[450px] max-w-full bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Шапка чата */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#f8f9fa]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h2 className="font-bold text-gray-900">ИИ-Ассистент</h2>
            </div>
            {contextTask && (
              <span className="text-xs text-indigo-600 font-medium mt-1 ml-7">
                Контекст: {contextTask.title}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Лента сообщений */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-[#6c5ce7] text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="p-3 border-t border-gray-100 bg-white flex gap-2 overflow-x-auto">
          <button
            onClick={() => handleSend("Сгенерируй описание для задачи")}
            className="shrink-0 px-3 py-1.5 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-50"
          >
            Сгенерировать описание
          </button>
          <button
            onClick={() => handleSend("Разбей задачу на подзадачи")}
            className="shrink-0 px-3 py-1.5 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-50"
          >
            Разбить на подзадачи
          </button>
        </div>

        {/* Поле ввода */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите что-нибудь..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]"
            />
            <button
              type="submit"
              className="p-2 bg-[#6c5ce7] text-white rounded-full hover:bg-[#5a4bcf] transition-colors flex items-center justify-center"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
