import { formataNumeroParaBRL, hideLoader } from "./helpers.js";
import { getAllProducts } from "./interface_ws.js";
import { ativaToastErro } from "./toasts.js";

$(() => {
  $(document).ready(() => {
    preencherTela();
  });
});

async function preencherTela() {
  const resultado = await getAllProducts();

  if (resultado.temErro) {
    ativaToastErro("Erro ao carregar informações dos produtos!");
    hideLoader();
    return;
  }

  resultado.data.forEach((produto) => {
    const html = `<div class="card-produto">
                    <a href="./produto.html#${produto.id}">
                      <div>
                        <img src="${produto.pictures[0]}" alt="${produto.name}" />
                      </div>
                    </a>
                    <div class="card-produto-precos">
                      <h2>${produto.name}</h2>
                      <h3>${formataNumeroParaBRL(produto.price)}</h3>
                    </div>
                  </div>`;
    $("main > .hero-container").append(html);
  });

  hideLoader();
}
