import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Servi la cartella dist
app.use(express.static(join(__dirname, "dist")));

// Fallback su index.html per SPA (React/Vue ecc.)
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 10001;
app.listen(port, () => {
  console.log(`✅ App avviata su http://localhost:${port}`);
});