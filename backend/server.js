import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectToDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log(`Link: http://localhost:${PORT}`);
    });
  } catch (er) {
    console.error("Error starting server: ", er.message);
    process.exit(1);
  }
}

startServer();
