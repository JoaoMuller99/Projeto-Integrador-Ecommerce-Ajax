import { formataNumeroParaBRL, hideLoader, showLoader } from "./helpers.js";
import { getAllProducts, updateSingleProduct } from "./interface_ws.js";
import { ativaToastErro, ativaToastSucesso } from "./toasts.js";

window.itensCarrinho = null;
const store = "itens-carrinho";

$(() => {
  $(document).ready(() => {
    getItensLocalStorage();
    atualizaBannerItensCarrinho();
    criaEventos();
  });

  function criaEventos() {
    // ? Evento btn carrinho
    $("#button-carrinho").on("click", () => {
      atualizaListagemCarrinho();
      $("#carrinho-container").show();
    });

    // ? Evento fechar carrinho ao clicar no fundo escuro
    $(".bg-fundo-carrinho").on("click", fecharCarrinho);

    // ? Evento fechar carrinho ao clicar no btn fechar
    $("#btn-fechar-carrinho").on("click", fecharCarrinho);

    // ? Evento finalizar compra
    $("#btn-finalizar-compra").on("click", async () => {
      if (!window.itensCarrinho || window.itensCarrinho.length === 0) {
        ativaToastErro("Nenhum item no carrinho!");
        return;
      }

      showLoader();

      const resultado = await getAllProducts();

      if (resultado.temErro) {
        ativaToastErro("Erro ao finalizar a compra!");
        hideLoader();
        return;
      }

      const updates = window.itensCarrinho
        .map((item) => {
          const produtoCarrinho = resultado.data.find((produto) => item.id === produto.id);

          if (!produtoCarrinho || produtoCarrinho.quantity < item.quantity) {
            ativaToastErro(
              `O produto ${item.name} nao possui estoque suficiente! \n ${(produtoCarrinho || {}).quantity || 0} itens disponiveis`
            );
            hideLoader();
            return false;
          }

          return new Promise(async (resolve) => {
            await updateSingleProduct({ ...item, quantity: produtoCarrinho.quantity - item.quantity });
            resolve(true);
          });
        })
        .filter((item) => item);

      if (updates.length === window.itensCarrinho.length) {
        Promise.all(updates).then(() => {
          window.itensCarrinho = [];
          atualizaListagemCarrinho();
          atualizaBannerItensCarrinho();
          setItensLocalStorage();
          sessionStorage.setItem("sucesso-compra", true);
          window.location.href = "./index.html";
          setTimeout(() => hideLoader(), 1000);
        });
      }
    });
  }
});

export function adicionarItemAoCarrinho(itemAdicionar) {
  const mensagemItemAdicionado = "Item adicionado ao carrinho!";

  if (!window.itensCarrinho) {
    window.itensCarrinho = [itemAdicionar];
    setItensLocalStorage();
    ativaToastSucesso(mensagemItemAdicionado);
    return;
  }

  const itemExistente = window.itensCarrinho.find((item) => item.id === itemAdicionar.id);
  if (itemExistente) {
    itemExistente.quantity = itemAdicionar.quantity;
    setItensLocalStorage();
    ativaToastSucesso(mensagemItemAdicionado);
    return;
  }

  window.itensCarrinho.push(itemAdicionar);
  setItensLocalStorage();
  ativaToastSucesso(mensagemItemAdicionado);
}

export function removeItemDoCarrinho(idItem) {
  window.itensCarrinho = window.itensCarrinho.filter((item) => item.id !== idItem);
  setItensLocalStorage();
  ativaToastErro("Item removido do carrinho!");
  atualizaListagemCarrinho();
  atualizaBannerItensCarrinho();
}

function atualizaBannerItensCarrinho() {
  $("#banner-qtd-carrinho").remove();
  if (!window.itensCarrinho || window.itensCarrinho.length === 0) return;

  const html = `<span id="banner-qtd-carrinho">${window.itensCarrinho.length}</span>`;
  $("#button-carrinho").append(html);
}

function getItensLocalStorage() {
  let itensCarrinho = localStorage.getItem(store);

  if (!itensCarrinho) return;

  try {
    itensCarrinho = JSON.parse(itensCarrinho);

    window.itensCarrinho = itensCarrinho;
  } catch (error) {
    ativaToastErro("Erro ao carregar itens do carrinho!");
  }
}

function atualizaListagemCarrinho() {
  $("#carrinho-itens-container").empty();
  if (!window.itensCarrinho || window.itensCarrinho.length === 0) {
    $("#carrinho-itens-container").append("<h4 id='nenhum-item'>Você possui algumas compras a fazer 😉</h4>");
    $("#carrinho-container #subtotal").text(formataNumeroParaBRL(0));
  } else {
    window.itensCarrinho.forEach((item) => {
      const html = `<div class="item-carrinho">
                    <img src="${item.picture}" loading="lazy" alt="${item.name}" />
                    <div>
                      <h3>${item.name}</h3>
                      <h3>${formataNumeroParaBRL(item.price * item.quantity)}</h3>
                      <div>
                        <p>Quantidade: <span>${item.quantity}</span></p>
                        <button type="button" data-id="${item.id}" class="btn-excluir-item-carrinho">Excluir</button>
                      </div>
                    </div>
                  </div>`;
      $("#carrinho-itens-container").append(html);
    });
    $(".btn-excluir-item-carrinho").off();
    $(".btn-excluir-item-carrinho").on("click", (e) => {
      const idItem = $(e.target).attr("data-id");
      removeItemDoCarrinho(+idItem);
    });
    $("#carrinho-container #subtotal").text(
      formataNumeroParaBRL(window.itensCarrinho.reduce((somador, item) => somador + item.price * item.quantity, 0))
    );
  }
}

function setItensLocalStorage() {
  localStorage.setItem(store, JSON.stringify(window.itensCarrinho));
  atualizaBannerItensCarrinho();
}

function fecharCarrinho() {
  $("#carrinho-container").hide();
}
