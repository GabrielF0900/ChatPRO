import * as express from "express";

const app = express.default();
const PORT = process.env.PORT || 3000;

app.use(express.default.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando com Express e TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
