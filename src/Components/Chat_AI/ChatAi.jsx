// Chat_AI.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Chat_AI() {
  // لو بياناتك في Redux (من Firebase مثلاً) موجودة هنا
  const fireData = useSelector((state) => state.fireData?.FireData?.[3]);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // عند تحميل المكون، بنبعت البيانات للباك عشان تخزنها في الـ vector store
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
        console.log(fireData);
      } catch (error) {
        console.error("❌ فشل تحميل البيانات:", error);
      }
    };

    processData();
  }, [fireData]);

  // دالة لمعالجة البحث
  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/search", {
        query: query.substring(0, 200),
        conversation_history: "" // ممكن تضيف سجل المحادثة لو حبيت
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("❌ خطأ البحث:", error);
      setAnswer("عذرًا، حدث خطأ أثناء معالجة طلبك");
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1 style={{ color: "#2c3e50" }}>مساعد المطعم الذكي</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="اسأل عن القائمة، المواعيد، أو الخدمات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #3498db",
            fontSize: 16,
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 24px",
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
          disabled={isLoading}
        >
          {isLoading ? "جاري البحث..." : "ابحث"}
        </button>
      </div>
      {answer && (
        <div
          style={{
            background: "#f8f9fa",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#2ecc71", marginTop: 0 }}>الإجابة:</h3>
          <p style={{ lineHeight: 1.6, fontSize: 16 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default Chat_AI;
