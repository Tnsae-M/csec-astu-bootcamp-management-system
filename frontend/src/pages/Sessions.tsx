import { useEffect, useState } from "react";

const API = "http://localhost:3000/api/sessions";

export default function Sessions() {
  const [sessions, setSessions] = useState<[]>([]);
  const [title, setTitle] = useState("");

  // FETCH
  const getSessions = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      // FIX: ensure array
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error(err);
      setSessions([]);
    }
  };

  useEffect(() => {
    getSessions();
  }, []);

  // CREATE
  const createSession = async () => {
    if (!title.trim()) return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    getSessions();
  };

  // DELETE
  const deleteSession = async (id: string) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    getSessions();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sessions</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Session title"
      />
      <button onClick={createSession}>Add</button>

      <ul>
        {Array.isArray(sessions) &&
          sessions.map((s: any) => (
            <li key={s.id}>
              {s.title}
              <button onClick={() => deleteSession(s.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
// import { useEffect, useState } from "react";

// const API = "http://localhost:3000/api/sessions";

// export default function Sessions() {
//     const [sessions, setSessions] = useState<any[]>([]);
//     const [title, setTitle] = useState("");

//     const getSessions = async () => {
//         const res = await fetch(API);
//         const data = await res.json();
//         setSessions(Array.isArray(data) ? data : []);
//     };

//     useEffect(() => {
//         getSessions();
//     }, []);

//     const createSession = async () => {
//         if (!title.trim()) return;

//         await fetch(API, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ title }),
//         });

//         setTitle("");
//         getSessions();
//     };

//     const deleteSession = async (id: string) => {
//         await fetch(`${API}/${id}`, { method: "DELETE" });
//         getSessions();
//     };

//     return (
//         <div style={styles.container}>
//             <h2 style={styles.heading}>📚 Sessions</h2>

//             {/* Input Section */}
//             <div style={styles.inputBox}>
//                 <input
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Enter session title..."
//                     style={styles.input}
//                 />
//                 <button onClick={createSession} style={styles.addBtn}>
//                     Add
//                 </button>
//             </div>

//             {/* Sessions List */}
//             <div style={styles.list}>
//                 {sessions.length === 0 ? (
//                     <p style={{ opacity: 0.6 }}>No sessions yet...</p>
//                 ) : (
//                     sessions.map((s) => (
//                         <div key={s.id} style={styles.card}>
//                             <span>{s.title}</span>

//                             <button
//                                 onClick={() => deleteSession(s.id)}
//                                 style={styles.deleteBtn}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }

// /* 🎨 Styles */
// const styles: any = {
//     container: {
//         maxWidth: "600px",
//         margin: "40px auto",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//     },

//     heading: {
//         textAlign: "center",
//         marginBottom: "20px",
//     },

//     inputBox: {
//         display: "flex",
//         gap: "10px",
//         marginBottom: "20px",
//     },

//     input: {
//         flex: 1,
//         padding: "10px",
//         borderRadius: "8px",
//         border: "1px solid #ccc",
//         outline: "none",
//     },

//     addBtn: {
//         padding: "10px 16px",
//         borderRadius: "8px",
//         border: "none",
//         background: "#4caf50",
//         color: "white",
//         cursor: "pointer",
//         transition: "0.2s",
//     },

//     list: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "10px",
//     },

//     card: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "12px 16px",
//         borderRadius: "10px",
//         background: "#f5f5f5",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//     },

//     deleteBtn: {
//         background: "#e53935",
//         color: "white",
//         border: "none",
//         padding: "6px 12px",
//         borderRadius: "6px",
//         cursor: "pointer",
//     },
// };
