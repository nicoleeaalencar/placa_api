import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// número de placas
const NUM_PANELS = 5;
// ID da placa defeituosa
const DEFECTIVE_PANEL_ID = 3;

// Gerar códigos únicos para cada placa (pode ser alfanumérico)
const panelCodes = Array.from({ length: NUM_PANELS }, (_, i) => `PLACA-${i + 1}`);

// Função para simular energia gerada (sem curva solar)
function generateEnergy(panelId) {
  if (panelId === DEFECTIVE_PANEL_ID) return 0;

  // Geração aleatória
  const base = 0.0075 + panelId * 0.5; 
  const variation = Math.random() * 0.002;
  const energy = (base + variation).toFixed(5);

  return Number(energy);
}

// rota geral - lista todas as placas
app.get("/", (req, res) => {
  const panels = [];
  for (let i = 1; i <= NUM_PANELS; i++) {
    panels.push({
      id: i,
      code: panelCodes[i - 1], // código de identificação
      link_id: `/panel/${i}`,
      link_code: `/${panelCodes[i - 1]}`,
      status: i === DEFECTIVE_PANEL_ID ? "defeituosa" : "ativa",
    });
  }
  res.json({
    message: "API de Simulação de Energia Solar (simplificada)",
    panels,
  });
});

// rota individual por ID
app.get("/panel/:id", (req, res) => {
  const panelId = parseInt(req.params.id);

  if (panelId < 1 || panelId > NUM_PANELS) {
    return res.status(404).json({ error: "Placa não encontrada" });
  }

  const production = generateEnergy(panelId);

  res.json({
    id: panelId,
    code: panelCodes[panelId - 1],
    energia_kWh: production,
    status: panelId === DEFECTIVE_PANEL_ID ? "defeituosa" : "ativa",
    timestamp: new Date().toISOString(),
  });
});

// rota individual por código (direto na raiz, ex: /PLACA-1)
app.get("/:code", (req, res) => {
  const { code } = req.params;
  const index = panelCodes.indexOf(code);

  if (index === -1) {
    return res.status(404).json({ error: "Placa não encontrada" });
  }

  const panelId = index + 1;
  const production = generateEnergy(panelId);

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
