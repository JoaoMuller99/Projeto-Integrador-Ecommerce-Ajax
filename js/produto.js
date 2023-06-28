import { adicionarItemAoCarrinho } from "./carrinho.js";
import { formataNumeroParaBRL, hideLoader } from "./helpers.js";
import { getSingleProduct } from "./interface_ws.js";
import { ativaToastErro } from "./toasts.js";

window.item = null;
window.quantidadeSelecionada = 1;

$(() => {
  $(document).ready(() => {
    preencherTela();
    criarEventos();
  });
});

async function preencherTela() {
  const idProduto = +window.location.hash.split("#")[1];

  if (!idProduto) {
    ativaToastErro("Id produto não encontrado/inválido!");
    $("#hero-container").hide();
    hideLoader();
    return;
  }

  const resultado = await getSingleProduct(idProduto);

  if (resultado.temErro) {
    ativaToastErro("Erro ao carregar informações do produto!");
    $("#hero-container").hide();
    hideLoader();
    return;
  }

  $(".img-container > img").attr("src", resultado.data.pictures[0]).attr("alt", resultado.data.name);
  $(".info-produto-container > h5").text(resultado.data.name);
  $(".info-produto-container > #description").text(resultado.data.description);
  window.precoProduto = resultado.data.price;
  atualizaExibicaoValorProduto();
  $(".info-produto-container > #estoque > span").text(resultado.data.quantity);
  atualizaExibicaoQuantidadeSelecionada();

  window.item = resultado.data;

  hideLoader();
}

function criarEventos() {
  // ? Evento btn menos quantidade
  $("#btn-menos").on("click", () => {
    if (window.quantidadeSelecionada === 1) return;

    window.quantidadeSelecionada--;
    atualizaExibicaoValorProduto();
    atualizaExibicaoQuantidadeSelecionada();
  });

  // ? Evento btn mais quantidade
  $("#btn-mais").on("click", () => {
    if (window.quantidadeSelecionada === window.item.quantity) return;

    window.quantidadeSelecionada++;
    atualizaExibicaoValorProduto();
    atualizaExibicaoQuantidadeSelecionada();
  });

  // ? Evento btn adicionar ao carrinho
  $("#btn-adicionar-carrinho").on("click", () => {
    adicionarItemAoCarrinho({ ...window.item, quantity: window.quantidadeSelecionada });
  });
}

function atualizaExibicaoValorProduto() {
  $(".info-produto-container > #price").text(formataNumeroParaBRL(window.precoProduto * window.quantidadeSelecionada));
}

function atualizaExibicaoQuantidadeSelecionada() {
  $(".info-produto-container > .seletor-quantidade-container > span").text(window.quantidadeSelecionada);
}
