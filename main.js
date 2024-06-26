const express = require("express");
const axios = require("axios");
const fs = require("fs/promises");

const app = express();

// MUDAR AQUI
const marca = '59';

let modelos = [];

async function getModelos() {
  const base_url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/`;

  try {  //h7yg7y
    const response = await axios.get(base_url);

    modelos = response.data.modelos.map(item => item.codigo);

  } catch (error) {
    console.error("Erro ao fazer solicitação:", error);
  }
}

async function getVeiculos() {
  const resultadosTotais = [];

  const initialValue = 151;
  const finalValue = 181;

  for (let i = initialValue; i < finalValue; i++) {
    const modelo = modelos[i];

    if (modelos[i]) {
      const base_url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos/`;

      try {
        const response = await axios.get(base_url);

        const codigos = response.data.map((item) => item.codigo);

        const resultados = [];

        for (let codigo of codigos) {
          try {
            const response = await axios.get(base_url + codigo);
            resultados.push(response.data);
          } catch (error) {
            
            console.error("Erro ao fazer solicitação:", error);
          }
        }

        resultadosTotais.push(...resultados);
      } catch (error) {
        console.error("Erro ao fazer solicitação:", error);
      }
    }

  }

  return resultadosTotais;
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  try {
    await getModelos();

    const resultados = await getVeiculos();

    await fs.appendFile("resultados.json", JSON.stringify(resultados, null, 2));
    console.log("Resultados gravados com sucesso");
  } catch (error) {
    console.error("Erro ao automatizar a consulta:", error);
  }
});
