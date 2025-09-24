import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// número de placas
const NUM_PANELS = 5;
// ID da placa defeituosa
const DEFECTIVE_PANEL_ID = 3;

// Gerar códigos únicos para cada placa (pode ser alfanumérico)
const panelCodes = Array.from({ length: NUM_PANELS }, (_, i) => `PLACA-${i + 1}`);

// Função para simular curva solar
function generateSolarCurve(panelId) {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  let production = 0;
  if (hour >= 6 && hour <= 18) {
    const x = ((hour - 6) / 12) * Math.PI;
    production = Math.sin(x); // 0 → 1 → 0
  }

  const base = 2 + panelId * 0.5;
  const variation = Math.random() * 0.3;
  const energy = (production * (base + variation)).toFixed(2);

  return Number(energy);
}

// rota geral - lista todas as placas
app.get("/", (req, res) => {
  const panels = [];
  for (let i = 1; i <= NUM_PANELS; i++) {
    panels.push({
      id: i,
      code: panelCodes[i - 1], // código de identificação
      link: `/panel/${i}`,
      status: i === DEFECTIVE_PANEL_ID ? "defeituosa" : "ativa",
    });
  }
  res.json({
    message: "API de Simulação de Energia Solar (curva diária)",
    panels,
  });
});

// rota individual por ID
app.get("/panel/:id", (req, res) => {
  const panelId = parseInt(req.params.id);

  if (panelId < 1 || panelId > NUM_PANELS) {
    return res.status(404).json({ error: "Placa não encontrada" });
  }

  const production =
    panelId === DEFECTIVE_PANEL_ID ? 0 : generateSolarCurve(panelId);

  res.json({
    id: panelId,
    code: panelCodes[panelId - 1],
    energia_kWh: production,
    status: panelId === DEFECTIVE_PANEL_ID ? "defeituosa" : "ativa",
    timestamp: new Date().toISOString(),
  });
});

// rota individual por código
app.get("/panel/code/:code", (req, res) => {
  const { code } = req.params;
  const index = panelCodes.indexOf(code);

  if (index === -1) return res.status(404).json({ error: "Placa não encontrada" });

  const panelId = index + 1;
  const production =
    panelId === DEFECTIVE_PANEL_ID ? 0 : generateSolarCurve(panelId);

  res.json({
    id: panelId,
    code: code,
    energia_kWh: production,
    status: panelId === DEFECTIVE_PANEL_ID ? "defeituosa" : "ativa",
    timestamp: new Date().toISOString(),
  });
});

// inicializa servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
