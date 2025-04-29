import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../Context/ThemeContext";
import { MessageCircle, X } from "lucide-react";
import axios from "axios";
import "./Chat_AI.css";

function Chat_AI() {
  const fireData = useSelector((state) => state.fireData?.FireData[3]);
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const processData = async () => {
      console.log("🔍 فحص fireData:", fireData);

      if (!fireData) {
        console.log("❌ fireData فاضي بالكامل");
        return;
      }

      if (!fireData.dishesByCategory) {
        console.log("❌ fireData.dishesByCategory غير موجود");
        return;
      }

      console.log("📋 محتوى fireData.dishesByCategory:", fireData.dishesByCategory);

      try {
        const documents = Object.entries(fireData.dishesByCategory).flatMap(([category, dishes]) => {
          if (!Array.isArray(dishes)) {
            console.log(`❌ الفئة ${category} مش مصفوفة:`, dishes);
            return [];
          }

          return dishes.map((dish) => {
            const name = dish.name_en || dish.title || dish.name_ar || dish.title_ar || "Unknown Item";
            const price = dish.price || "Unknown Price";
            const description =
              dish.description_en || dish.description || dish.desc_en || dish.desc_ar || "No description available.";
            const content = `Category: ${category}, Name: ${name}, Price: ${price}, Description: ${description}`;
            return {
              pageContent: content.substring(0, 1000),
              metadata: { id: dish.id || `unknown-${Date.now()}`, category: category, source: "firebase" },
            };
          });
        });

        if (documents.length === 0) {
          console.log("❌ لا توجد بيانات لتحميلها");
          return;
        }

        console.log("📤 الوثائق المرسلة إلى الباك إند:", documents);

        const response = await axios.post("http://localhost:3000/generate-embeddings", {
          documents: documents.slice(0, 50),
        });
        console.log("✅ تم تحميل البيانات بنجاح:", response.data);
      } catch (error) {
        console.error("❌ فشل تحميل البيانات:", error.response?.data || error.message);
      }
    };

    processData();
  }, [fireData]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setConversation((prev) => [...prev, `User: ${query}`]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/search", {
        query: query.substring(0, 200),
        conversation_history: "",
      });
      console.log("📥 الرد من الـ backend:", response.data);

      const assistantReply = response.data.answer || (text?.error || "Something went wrong, please try again.");
      setConversation((prev) => [...prev, `Assistant: ${assistantReply}`]);
    } catch (error) {
      console.error("❌ خطأ البحث:", error.response?.data || error.message);
      setConversation((prev) => [
        ...prev,
        `Assistant: ${text?.errorProcessing || (currentLange === "Ar" ? "عذرًا، حدث خطأ أثناء معالجة طلبك" : "Sorry, an error occurred while processing your request")}`,
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const chatConversation = document.querySelector(".chat-conversation");
    if (chatConversation) {
      chatConversation.scrollTop = chatConversation.scrollHeight;
    }
  }, [conversation]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  // Theme-based classes
  const bgClass = theme === "dark" ? "bg-dark-custom" : "bg-light-custom";
  const cardClass = theme === "dark" ? "bg-dark-card text-white" : "bg-light-card text-dark";
  const textClass = theme === "dark" ? "text-white" : "text-dark";
  const btnClass = theme === "dark" ? "btn-accent-dark" : "btn-accent-light";
  const inputClass = theme === "dark" ? "bg-dark-card text-white border-secondary" : "bg-light-card text-dark border-light";

  return (
    <div className={`chat-container`}>
      {!isChatOpen && (
        <button onClick={toggleChat} className={`chat-button ${btnClass}`} aria-label="Open chat">
          <MessageCircle size={35} />
        </button>
      )}

      {isChatOpen && (
        <div className={`chat-panel ${cardClass}`}>
          <div className={`chat-header ${bgClass} ${textClass}`}>
            {text?.chatWithAI || "Chat with AI"}
            <button onClick={toggleChat} className={`close-button rounded ${btnClass}`} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="chat-conversation">
            {conversation.length === 0 ? (
              <p className={`text-center ${textClass}`}>
                {text?.startTyping || (currentLange === "Ar" ? "ابدأ بالكتابة للدردشة!" : "Start typing to chat!")}
              </p>
            ) : (
              conversation.map((message, index) => {
                const isUser = message.startsWith("User:");
                const messageText = message.replace("User: ", "").replace("Assistant: ", "");
                return (
                  <div
                    key={`message-${index}`}
                    className={`message ${isUser ? "user-message" : "assistant-message"} ${textClass}`}
                  >
                    {messageText}
                  </div>
                );
              })
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder={text?.askQuestion || (currentLange === "Ar" ? "اسألني أي سؤال!" : "Ask me any question!")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`input-field ${inputClass}`}
              disabled={isLoading}
            />
            <button onClick={handleSearch} className={`send-button ${btnClass}`} disabled={isLoading} aria-label="Send message">
              {isLoading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat_AI;