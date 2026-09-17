const materiais = {
  celular: {
    nome: "Celulares",
    orientacao: "Faça backup, remova seus dados e entregue o aparelho em um ponto de coleta de eletrônicos."
  },
  computador: {
    nome: "Computadores",
    orientacao: "Doe ou conserte quando possível. Para o descarte, procure uma cooperativa ou ponto de coleta especializado."
  },
  bateria: {
    nome: "Baterias",
    orientacao: "Não descarte no lixo comum. Leve a um ponto de coleta de pilhas e baterias e evite perfurar o componente."
  },
  pilha: {
    nome: "Pilhas",
    orientacao: "Guarde as pilhas usadas em um recipiente seco e entregue-as em coletores específicos."
  },
  carregador: {
    nome: "Cabos e carregadores",
    orientacao: "Separe cabos e carregadores do lixo comum e encaminhe-os para um ponto de coleta de eletrônicos."
  },
  notebook: {
    nome: "Notebooks",
    orientacao: "Priorize o reparo ou a doação. Antes de entregar, apague seus dados e remova a bateria se isso for possível com segurança."
  }
};

const consultaSection = document.querySelector("#consulta");
const consultaForm = document.querySelector(".consulta-form");
const consultaInput = document.querySelector("#residuo");
const consultaStatus = document.querySelector(".consulta-status");

function navegarPara(seletor) {
  document.querySelector(seletor)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector(".btnODS12")?.addEventListener("click", () => navegarPara("#ods12"));
document.querySelector(".btnContato")?.addEventListener("click", () => {
  navegarPara("#consulta");
  window.setTimeout(() => consultaInput?.focus(), 500);
});

function normalizarBusca(valor) {
  return valor
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function exibirResultado(chave) {
  const material = materiais[chave];

  if (!material) {
    consultaStatus.textContent = "Material não encontrado. Tente celular, computador, bateria, pilha ou carregador.";
    consultaStatus.classList.add("consulta-status-erro");
    return;
  }

  consultaStatus.textContent = `${material.nome}: ${material.orientacao}`;
  consultaStatus.classList.remove("consulta-status-erro");
}

consultaForm?.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const busca = normalizarBusca(consultaInput.value);

  if (!busca) {
    consultaStatus.textContent = "Digite o nome de um material para realizar a consulta.";
    consultaStatus.classList.add("consulta-status-erro");
    consultaInput.focus();
    return;
  }

  const buscaSemPlural = busca.endsWith("s") ? busca.slice(0, -1) : busca;
  const chave = Object.keys(materiais).find(
    (nome) => busca.includes(nome) || nome.includes(busca) || buscaSemPlural.includes(nome)
  );
  exibirResultado(chave);
});

document.querySelectorAll("[data-residuo]").forEach((botao) => {
  botao.addEventListener("click", () => {
    consultaInput.value = botao.dataset.residuo;
    exibirResultado(botao.dataset.residuo);
    consultaInput.focus();
  });
});