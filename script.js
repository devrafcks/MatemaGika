/**
 * Função para resolver equações de 1º e 2º grau
 */
function resolverEquacao() {
  // Obter valores dos coeficientes a, b e c
  const a = parseFloat(document.getElementById("a").value) || 0;
  const b = parseFloat(document.getElementById("b").value) || 0;
  const c = parseFloat(document.getElementById("c").value) || 0;
  const resultadoElemento = document.getElementById("resultadoEquacao");

  // Limpar resultados anteriores
  resultadoElemento.innerHTML = "";
  resultadoElemento.style.display = "none";

  // Verificar se os coeficientes são válidos
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    resultadoElemento.innerHTML =
      "<p class='erro'>Por favor, insira valores numéricos válidos para todos os coeficientes.</p>";
    resultadoElemento.style.display = "block";
    return;
  }

  let resultado = "";

  // Caso: Equação de 1º grau (a = 0 e b ≠ 0)
  if (a === 0 && b !== 0) {
    const x = -c / b;
    resultado = `
          <h3>Equação de 1º Grau</h3>
          <p>Formato: ${b}x ${c >= 0 ? "+" : ""}${c} = 0</p>
          <p class="resultado">Raiz real: x = ${Math.round(x)}</p>
        `;
  }

  // Caso: Equação de 2º grau (a ≠ 0)
  else if (a !== 0) {
    const delta = b * b - 4 * a * c;

    resultado = `
          <h3>Equação de 2º Grau</h3>
          <p>Formato: ${a}x² ${b >= 0 ? "+" : ""}${b}x ${
      c >= 0 ? "+" : ""
    }${c} = 0</p>
          <p>Discriminante (Δ) = ${Math.round(delta)}</p>
        `;

    // Duas raízes reais
    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      resultado += `
            <p class="resultado">Duas raízes reais distintas:</p>
            <p>x₁ = ${Math.round(x1)}</p>
            <p>x₂ = ${Math.round(x2)}</p>
          `;
    }
    // Raiz real única
    else if (delta === 0) {
      const x = -b / (2 * a);
      resultado += `
            <p class="resultado">Raiz real única (dupla):</p>
            <p>x = ${Math.round(x)}</p>
          `;
    }
    // Raízes complexas
    else {
      const parteReal = (-b / (2 * a)).toFixed(0);
      const parteImaginaria = (Math.sqrt(-delta) / (2 * a)).toFixed(0);
      resultado += `
            <p class="resultado">Raízes complexas conjugadas:</p>
            <p>x₁ = ${parteReal} + ${parteImaginaria}i</p>
            <p>x₂ = ${parteReal} - ${parteImaginaria}i</p>
          `;
    }
  }

  // Caso: Equação degenerada (a = 0 e b = 0)
  else {
    if (c === 0) {
      resultado =
        "<p class='resultado'>Equação degenerada (0 = 0). Qualquer valor de x é solução.</p>";
    } else {
      resultado = `<p class='resultado'>Equação sem solução (0 = ${c}).</p>`;
    }
  }

  // Exibir resultado final
  resultadoElemento.innerHTML = resultado;
  resultadoElemento.style.display = "block";
}

/**
 * Função para realizar interpolação linear entre pontos inseridos
 */
function interpolar() {
  const input = document.getElementById("pontos").value.trim();
  const resultadoElemento = document.getElementById("resultadoInterpolacao");
  const chartContainer = document.querySelector(".chart-container");
  const canvas = document.getElementById("graficoInterpolacao");

  // Limpar resultados anteriores
  resultadoElemento.innerHTML = "";
  resultadoElemento.style.display = "none";
  chartContainer.style.display = "none";

  // Ajustar tamanho do canvas
  canvas.width = chartContainer.offsetWidth - 40;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Verifica se há entrada
  if (!input) {
    resultadoElemento.innerHTML =
      "<p class='erro'>Por favor, insira pontos no formato 'x1,y1 x2,y2 ...'</p>";
    resultadoElemento.style.display = "block";
    return;
  }

  // Separar pontos e validar
  const pontos = [];
  const partes = input.split(/\s+/);

  for (const parte of partes) {
    const coordenadas = parte.split(",");
    if (
      coordenadas.length !== 2 ||
      isNaN(coordenadas[0]) ||
      isNaN(coordenadas[1])
    ) {
      resultadoElemento.innerHTML = `<p class='erro'>Formato inválido no ponto: '${parte}'. Use 'x,y' para cada ponto.</p>`;
      resultadoElemento.style.display = "block";
      return;
    }
    pontos.push([parseFloat(coordenadas[0]), parseFloat(coordenadas[1])]);
  }

  // Verifica se há ao menos dois pontos
  if (pontos.length < 2) {
    resultadoElemento.innerHTML =
      "<p class='erro'>São necessários pelo menos 2 pontos para interpolação.</p>";
    resultadoElemento.style.display = "block";
    return;
  }

  // Ordenar pontos por x
  pontos.sort((a, b) => a[0] - b[0]);

  let resultado = "<h3>Resultado da Interpolação Linear</h3>";
  const segmentos = [];

  // Calcular coeficientes dos segmentos entre pontos
  for (let i = 0; i < pontos.length - 1; i++) {
    const [x0, y0] = pontos[i];
    const [x1, y1] = pontos[i + 1];

    if (x0 === x1) {
      resultadoElemento.innerHTML = `<p class='erro'>Erro: Dois pontos têm o mesmo valor de x (${x0}).</p>`;
      resultadoElemento.style.display = "block";
      return;
    }

    const inclinacao = (y1 - y0) / (x1 - x0);
    const intercepto = y0 - inclinacao * x0;

    segmentos.push({ x0, x1, inclinacao, intercepto });

    resultado += `
          <div class="segmento">
            <p>Intervalo: x ∈ [${Math.round(x0)}, ${Math.round(x1)}]</p>
            <p>Equação: y = ${Math.round(inclinacao)}x ${
      intercepto >= 0 ? "+" : ""
    }${Math.round(intercepto)}</p>
          </div>
        `;
  }

  // Mostrar resultado e preparar gráfico
  resultadoElemento.innerHTML = resultado;
  resultadoElemento.style.display = "block";
  chartContainer.style.display = "block";

  plotarGraficoInterpolacao(pontos, segmentos, ctx);
}

/**
 * Função que plota o gráfico de interpolação usando Chart.js
 */
function plotarGraficoInterpolacao(pontos, segmentos, ctx) {
  // Remover gráfico anterior, se existir
  if (
    window.graficoInterpolacao &&
    typeof window.graficoInterpolacao.destroy === "function"
  ) {
    window.graficoInterpolacao.destroy();
  }

  // Preparar dados para gráfico
  const dadosInterpolacao = [];
  const dadosPontos = pontos.map((p) => ({ x: p[0], y: p[1] }));

  // Gerar pontos das retas para cada segmento
  for (const seg of segmentos) {
    const passo = (seg.x1 - seg.x0) / 10;
    for (let x = seg.x0; x <= seg.x1; x += passo) {
      dadosInterpolacao.push({
        x: x,
        y: seg.inclinacao * x + seg.intercepto,
      });
    }
  }

  // Configurações visuais do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Gráfico de Interpolação Linear",
        font: {
          size: 16,
        },
      },
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `(${Math.round(ctx.parsed.x)}, ${Math.round(ctx.parsed.y)})`,
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Eixo X",
        },
      },
      y: {
        title: {
          display: true,
          text: "Eixo Y",
        },
      },
    },
  };

  // Criar gráfico com os pontos e linhas da interpolação
  window.graficoInterpolacao = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Interpolação Linear",
          data: dadosInterpolacao,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          borderWidth: 3,
          pointRadius: 0,
          showLine: true,
          tension: 0,
        },
        {
          label: "Pontos Originais",
          data: dadosPontos,
          backgroundColor: "rgb(255, 148, 99)",
          borderColor: "rgb(255, 221, 99)",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: options,
  });
}
