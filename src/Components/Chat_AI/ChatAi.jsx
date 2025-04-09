import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Chat_AI() {
  const fireData = useSelector((state) => state.fireData.FireData[3]);
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]); // سجل المحادثة كـ array من الرسائل: { role, text }
  const [isLoading, setIsLoading] = useState(false);

  // معالجة بيانات Firebase وتحويلها لمستندات embeddings
  useEffect(() => {
    const processData = async () => {
      if (!fireData) return;

      try {
        const documents = Object.entries(fireData).flatMap(([key, value]) => {
          const content = `Key: ${key}, Data: ${JSON.stringify(value)}`;
          return [{
            pageContent: content.substring(0, 1000),
            metadata: { id: key, source: "firebase" }
          }];
        });

        await axios.post("http://localhost:3000/generate-embeddings", {
          documents: documents.slice(0, 50)
        });
        console.log("✅ تم تحميل البيانات بنجاح");
      } catch (error) {
        console.error("❌ فشل تحميل البيانات:", error);
      }
    };

    processData();
  }, [fireData]);

  // إرسال السؤال والتعامل مع الرد
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // إضافة رسالة المستخدم لسجل المحادثة
    setConversation(prev => [...prev, { role: "user", text: query }]);
    setIsLoading(true);

    try {
      // تمرير سجل المحادثة كنص معدّم (كل رسالة على سطر)
      const conversationHistory = conversation
        .map((msg) => `[${msg.role}]: ${msg.text}`)
        .join("\n");
        
      const response = await axios.post("http://localhost:3000/search", {
        query: query.substring(0, 200),
        conversation_history: conversationHistory
      });
      const botAnswer = response.data.answer;

      // إضافة إجابة البوت لسجل المحادثة
      setConversation(prev => [...prev, { role: "bot", text: botAnswer }]);
      setQuery("");
    } catch (error) {
      console.error("❌ خطأ البحث:", error);
      setConversation(prev => [
        ...prev,
        { role: "bot", text: "عذرًا، حدث خطأ أثناء معالجة طلبك" }
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1 style={{ color: '#2c3e50' }}>مساعد المطعم الذكي</h1>
      
      {/* عرض سجل المحادثة */}
      <div style={{
          background: '#f8f9fa',
          padding: 10,
          borderRadius: 8,
          maxHeight: 400,
          overflowY: 'auto',
          marginBottom: 20
      }}>
        {conversation.map((msg, index) => (
          <div key={index} style={{
              marginBottom: 10,
              textAlign: msg.role === "bot" ? "left" : "right"
          }}>
            <strong style={{ color: msg.role === "bot" ? '#2ecc71' : '#3498db' }}>
              {msg.role === "bot" ? "المساعد" : "انت"}:
            </strong>
            <p style={{ margin: 0, lineHeight: 1.6, fontSize: 16 }}>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* حقل الإدخال وزر البحث */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="اسأل عن القائمة، المواعيد، أو الخدمات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #3498db',
            fontSize: 16
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '12px 24px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16
          }}
          disabled={isLoading}
        >
          {isLoading ? 'جاري البحث...' : 'ابحث'}
        </button>
      </div>
    </div>
  );
}

export default Chat_AI;