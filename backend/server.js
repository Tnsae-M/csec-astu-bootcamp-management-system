import "dotenv/config";

// HEAD:backend/server.js
import app from "./src/app.js";
// import connectToDB from "./src/config/db.js";


// import app from "./app.js";
// import connectDB from "./config/db.js";
// origin/session-feature:backend/src/server.js
import connectDB from "./src/config/db.js";
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();