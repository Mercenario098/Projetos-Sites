const consultaForm = document.querySelector(".consulta-form");
const consultaInput = document.querySelector("#residuo");
const consultaStatus = document.querySelector(".consulta-status");

// ================================
// NAVEGAÇÃO DA PÁGINA
// ================================

function navegarPara(seletor) {
  document
    .querySelector(seletor)
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

document.querySelector(".btnODS12")?.addEventListener("click", () => {
  navegarPara("#ods12");
});

document.querySelector(".btnContato")?.addEventListener("click", () => {
  navegarPara("#consulta");

  window.setTimeout(() => {
    consultaInput?.focus();
  }, 500);
});


// ================================
// NORMALIZAÇÃO DA PESQUISA
// ================================

function normalizarBusca(valor) {
  return valor
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


// ================================
// CONSULTA À API
// ================================

async function consultarResiduo(nome) {

  // Mostra uma mensagem enquanto aguarda a API
  consultaStatus.textContent = "Consultando...";
  consultaStatus.classList.remove("consulta-status-erro");

  try {

    const resposta = await fetch(
      `http://localhost:3000/api/residuos?nome=${encodeURIComponent(nome)}`
    );

    // Se a API retornar 404
    if (resposta.status === 404) {
      consultaStatus.textContent =
        "Material não encontrado no banco de dados.";

      consultaStatus.classList.add("consulta-status-erro");
      return;
    }

    // Outros erros HTTP
    if (!resposta.ok) {
      throw new Error("Erro ao consultar a API.");
    }

    // Converte o JSON recebido
    const residuo = await resposta.json();

    // Mostra o resultado
    exibirResultado(residuo);

  } catch (erro) {

    console.error("Erro:", erro);

    consultaStatus.textContent =
      "Não foi possível consultar o servidor. Verifique se a API está funcionando.";

    consultaStatus.classList.add("consulta-status-erro");
  }
}


// ================================
// MANIPULAÇÃO DO DOM
// ================================

function exibirResultado(residuo) {

  const reciclavel =
    residuo.reciclavel === 1 || residuo.reciclavel === true
      ? "Sim"
      : "Não";

  consultaStatus.innerHTML = `
    <strong>${residuo.nome}</strong><br><br>

    <strong>Categoria:</strong>
    ${residuo.categoria}<br>

    <strong>Reciclável:</strong>
    ${reciclavel}<br><br>

    <strong>Descrição:</strong><br>
    ${residuo.descricao}<br><br>

    <strong>Como descartar:</strong><br>
    ${residuo.descarte}
  `;

  consultaStatus.classList.remove("consulta-status-erro");
}


// ================================
// ENVIO DO FORMULÁRIO
// ================================

consultaForm?.addEventListener("submit", (evento) => {

  // Impede a página de recarregar
  evento.preventDefault();

  const busca = normalizarBusca(consultaInput.value);

  if (!busca) {

    consultaStatus.textContent =
      "Digite o nome de um material para realizar a consulta.";

    consultaStatus.classList.add("consulta-status-erro");

    consultaInput.focus();

    return;
  }

  // Consulta a API
  consultarResiduo(busca);
});


// ================================
// BOTÕES DE EXEMPLO
// ================================

document.querySelectorAll("[data-residuo]").forEach((botao) => {

  botao.addEventListener("click", () => {

    const residuo = botao.dataset.residuo;

    // Coloca o nome no campo
    consultaInput.value = residuo;

    // Consulta a API
    consultarResiduo(residuo);

    consultaInput.focus();
  });

});