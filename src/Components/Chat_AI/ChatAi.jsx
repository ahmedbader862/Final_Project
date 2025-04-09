import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Chat_AI() {
  const fireData = useSelector((state) => state.fireData.FireData[3]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const processAndSendData = async () => {
      if (!fireData) return;

      try {
        // Convert fireData into an array of documents with metadata
        const documents = Object.entries(fireData).flatMap(([key, value]) =>
          Array.isArray(value)
            ? value.map((item, index) => ({
                pageContent: `Key: ${key}, Data: ${JSON.stringify(item)}`,
                metadata: { id: `${key}-${index}` },
              }))
            : [{
                pageContent: `Key: ${key}, Data: ${JSON.stringify(value)}`,
                metadata: { id: key },
              }]
        );

        // Send documents to backend to generate embeddings
        await axios.post("http://localhost:3000/generate-embeddings", { documents });
        console.log("✅ Data uploaded successfully");
      } catch (error) {
        console.error("❌ Error sending data:", error);
      }
    };

    processAndSendData();
  }, [fireData]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      // Send query to backend and get search results
      const response = await axios.post("http://localhost:3000/search", { query });
      setResults(response.data.results || [{ content: "❌ No results available" }]);
    } catch (error) {
      console.error("❌ Search error:", error);
      setResults([{ content: "❌ An error occurred during the search" }]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat AI </h1>
      <input
        type="text"
        placeholder="Type your question here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 10, width: "80%", marginBottom: 10 }}
      />
      <button onClick={handleSearch} style={{ padding: 10 }}>Search</button>
      
      {results.length > 0 && (
        <div style={{ marginTop: 20, color: "blue" }}>
          <h3>📌 Results:</h3>
          <ul>
            {results.map((res, index) => (
              <li key={index}>
                {res.content} {res.similarity && `(Similarity: ${res.similarity.toFixed(2)})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Chat_AI;

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory"; // Vector DB بسيط في الذاكرة

// function Chat_AI() {
//   const fireData = useSelector((state) => state.fireData.FireData[3]);
//   const [vectorStore, setVectorStore] = useState(null);

//   useEffect(() => {
//     const processEmbeddings = async () => {
//       try {
//         if (!fireData || !fireData.reservations) return;

//         // تحويل البيانات إلى نصوص يمكن معالجتها
//         const documents = fireData.reservations.map((item, index) => ({
//           pageContent: JSON.stringify(item),
//           metadata: { id: index },
//         }));

//         // استخدام OpenAI لتحويل البيانات إلى Embeddings
//         const embeddings = new OpenAIEmbeddings({
//           // apiKey: "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", // استخدم API Key الصحيح
//           apiKey: "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", // استخدم API Key الصحيح
//           model: "text-embedding-3-small", 
//           batchSize: 512, 
//         });

//         // تخزين البيانات في Vector Store (مؤقتًا في الذاكرة)
//         const vectorDB = await MemoryVectorStore.fromDocuments(
//           documents,
//           embeddings
//         );

//         setVectorStore(vectorDB);
//         console.log("✅ Data converted to vectors successfully!");

//       } catch (error) {
//         console.error("Error processing embeddings:", error);
//       }
//     };

//     processEmbeddings();
//   }, [fireData]);

//   return <h1>Chat AI Ready ✅</h1>;
// }

// export default Chat_AI;
