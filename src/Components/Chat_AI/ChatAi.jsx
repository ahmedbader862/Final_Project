import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import './Chat_AI.css';


function Chat_AI() {
  const fireData = useSelector((state) => state.fireData?.FireData?.[3]);
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const processData = async () => {
      if (!fireData) return;

      try {
        const documents = Object.entries(fireData).flatMap(([key, value]) => {
          const content = `Key: ${key}, Data: ${JSON.stringify(value)}`;
          return [
            {
              pageContent: content.substring(0, 1000),
              metadata: { id: key, source: "firebase" },
            },
          ];
        });

        await axios.post("http://localhost:3000/generate-embeddings", {
          documents: documents.slice(0, 50),
        });
        console.log("✅ تم تحميل البيانات بنجاح");
      } catch (error) {
        console.error("❌ فشل تحميل البيانات:", error);
      }
    };

    processData();
  }, [fireData]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const newConversation = [...conversation, `User: ${query}`];
      setConversation(newConversation);

      const response = await axios.post("http://localhost:3000/search", {
        query: query.substring(0, 200),
        conversation_history: newConversation.join("\n"),
      });

      setConversation([...newConversation, `Assistant: ${response.data.answer}`]);
    } catch (error) {
      console.error("❌ خطأ البحث:", error);
      setConversation([...conversation, "Assistant: عذرًا، حدث خطأ أثناء معالجة طلبك"]);
    }
    setIsLoading(false);
    setQuery("");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-container">
      <button
        onClick={toggleChat}
        className="chat-button"
      >
        {isChatOpen ? "×" : "💬"}
      </button>

      {isChatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            Chat with AI
          </div>

          <div className="chat-conversation">
            {conversation.map((message, index) => {
              const isUser = message.startsWith("User:");
              const messageText = message.replace("User: ", "").replace("Assistant: ", "");
              return (
                <div
                  key={index}
                  className={`message ${isUser ? "user-message" : "assistant-message"}`}
                >
                  {messageText}
                </div>
              );
            })}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="اسألني أي سؤال!"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleSearch}
              className="send-button"
              disabled={isLoading}
            >
              {isLoading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat_AI;