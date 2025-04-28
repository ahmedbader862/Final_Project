import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Chat_AI.css";
import axios from "axios";

function Chat_AI() {
  const fireData = useSelector((state) => state.fireData?.FireData[3]);
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
            const description = (
              dish.description_en || 
              dish.description || 
              dish.desc_en || 
              dish.desc_ar || 
              "No description available."
            );
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

    // إضافة السؤال للشات فورًا
    setConversation((prev) => [...prev, `User: ${query}`]);
    
    // تنظيف الإنبوت فورًا
    setQuery("");
    
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/search", {
        query: query.substring(0, 200),
        conversation_history: "",
      });
      console.log("📥 الرد من الـ backend:", response.data);

      const assistantReply = response.data.answer || "❗ حصلت مشكلة، حاول تاني.";
      setConversation((prev) => [...prev, `Assistant: ${assistantReply}`]);
    } catch (error) {
      console.error("❌ خطأ البحث:", error.response?.data || error.message);
      setConversation((prev) => [
        ...prev,
        "Assistant: عذرًا، حدث خطأ أثناء معالجة طلبك",
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

  return (
    <div className="chat-container">
      <button onClick={toggleChat} className="chat-button">
        {isChatOpen ? "×" : "💬"}
      </button>

      {isChatOpen && (
        <div className="chat-panel">
          <div className="chat-header">Chat with AI</div>

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
              onKeyPress={handleKeyPress} // Added Enter key support
              className="input-field"
            />
            <button onClick={handleSearch} className="send-button" disabled={isLoading}>
              {isLoading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat_AI;