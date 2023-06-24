import { ativaToastCarrinho, ativaToastErro } from "./toasts.js";

window.quantidadeItensCarrinho = 0;
window.itensCarrinho = null;
const store = "itens-carrinho";

$(() => {
  $(document).ready(() => {
    getItensLocalStorage();
    atualizaBannerItensCarrinho();
  });
});

export function adicionarItemAoCarrinho(itemAdicionar) {
  if (!window.itensCarrinho) {
    window.itensCarrinho = [itemAdicionar];
    setItensLocalStorage();
    return;
  }

  const itemExistente = window.itensCarrinho.find((item) => item.id === itemAdicionar.id);
  if (itemExistente) {
    itemExistente.quantity = itemAdicionar.quantity;
    setItensLocalStorage();
    return;
  }

  window.itensCarrinho.push(itemAdicionar);
  setItensLocalStorage();
}

function atualizaBannerItensCarrinho() {
  if (window.quantidadeItensCarrinho < 1) {
    $("#banner-qtd-carrinho").remove();
    return;
  }
  const html = `<span id="banner-qtd-carrinho">${window.quantidadeItensCarrinho}</span>`;
  $("#button-carrinho").append(html);
}

function getItensLocalStorage() {
  let itensCarrinho = localStorage.getItem(store);

  if (!itensCarrinho) return;

  try {
    itensCarrinho = JSON.parse(itensCarrinho);

    window.quantidadeItensCarrinho = itensCarrinho.length;
    window.itensCarrinho = itensCarrinho;
  } catch (error) {
    ativaToastErro("Erro ao carregar itens do carrinho!");
  }
}

function setItensLocalStorage() {
  localStorage.setItem(store, JSON.stringify(window.itensCarrinho));
  window.quantidadeItensCarrinho = window.itensCarrinho.length;
  atualizaBannerItensCarrinho();
  ativaToastCarrinho("Item adicionado ao carrinho!");
}
