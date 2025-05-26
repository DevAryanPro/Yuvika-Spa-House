import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", (req, res) => {
  const pythonProcess = spawn("python", ["multiagent.py"]);
  let responseData = "";

  pythonProcess.stdout.on("data", (data) => {
    responseData += data.toString();
  });

  pythonProcess.stdin.write(JSON.stringify(req.body) + "\n");
  pythonProcess.stdin.end();

  pythonProcess.on("close", () => {
    try {
      res.json(JSON.parse(responseData));
    } catch (e) {
      res.status(500).json({ error: "Invalid response format" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
