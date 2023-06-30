import { formataNumeroParaBRL, hideLoader } from "./helpers.js";
import { getAllProducts } from "./interface_ws.js";
import { ativaToastCarrinho, ativaToastErro } from "./toasts.js";

$(() => {
  $(document).ready(() => {
    preencherTela();

    hideLoader();

    if (sessionStorage.getItem("sucesso-compra") === "true") {
      setTimeout(() => ativaToastCarrinho("Compra efetuada com sucesso"), 1000);
      sessionStorage.removeItem("sucesso-compra");
    }
  });
});

async function preencherTela() {
  const resultado = await getAllProducts();

  if (resultado.temErro) {
    ativaToastErro("Erro ao carregar informações dos produtos!");

    return;
  }

  resultado.data.forEach((produto) => {
    if (produto.quantity <= 0) return;

    const html = `<div class="card-produto">
                    <a href="./produto.html#${produto.id}">
                      <div>
                        <img src="${produto.pictures[0]}" loading="lazy" alt="${produto.name}" />
                      </div>
                    </a>
                    <div class="card-produto-precos">
                      <h2>${produto.name}</h2>
                      <h3>${formataNumeroParaBRL(produto.price)}</h3>
                    </div>
                  </div>`;
    $("main > .hero-container").append(html);
  });
}
