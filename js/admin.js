import { formataNumeroParaBRL, hideLoader, showLoader } from "./helpers.js";
import { addSingleProduct, deleteSingleProduct, getAllProducts, updateSingleProduct } from "./interface_ws.js";
import { ativaToastErro, ativaToastSucesso } from "./toasts.js";

$(() => {
  window.produtos = [];
  const modal = new bootstrap.Modal("#modal-produto-container");

  $(document).ready(() => {
    preencherTela();
  });

  async function preencherTela() {
    showLoader();
    $("#container-produtos").empty();
    const resultado = await getAllProducts();

    if (resultado.temErro) {
      ativaToastErro("Erro ao carregar informações dos produtos!");
      hideLoader();
      return;
    }

    window.produtos = resultado.data;

    window.produtos
      .sort((a, b) => a.price - b.price)
      .forEach((produto) => {
        const html = `<tr id="${produto.id}">
                      <td class="nome">${produto.name}</td>
                      <td class="text-center preco">${formataNumeroParaBRL(produto.price)}</td>
                      <td class="text-center estoque">${produto.quantity}</td>
                      <td class="d-flex align-items-center justify-content-center flex-wrap gap-1 gap-md-4">
                        <button type="button" data-id="${produto.id}" class="btn btn-primary btn-editar-item">Editar</button>
                        <button type="button" data-id="${produto.id}" class="btn btn-danger btn-excluir-item">Excluir</button>
                      </td>
                    </tr>`;

        $("#container-produtos").append(html);
      });

    criaEventos();
    hideLoader();
  }

  function criaEventos() {
    $("#btn-adicionar-produto")
      .off()
      .on("click", async () => {
        $("#modal-produto > span").text("Adicionar");
        limparCamposModal();

        $("#btn-salvar-item")
          .off()
          .on("click", async (e) => {
            if (!document.querySelector("#form-produto").checkValidity()) return;

            e.preventDefault();
            showLoader();
            const novasInfosProduto = {
              name: $("#nome-produto").val(),
              price: +$("#preco-produto").val(),
              picture: $("#imagens-produto").val(),
              description: $("#descricao-produto").val(),
              quantity: +$("#estoque-produto").val(),
            };
            const resultado = await addSingleProduct(novasInfosProduto);

            if (resultado.temErro) {
              ativaToastErro("Erro ao adicionar produto!");
            } else {
              preencherTela();
              ativaToastSucesso("Produto adicionado com sucesso!");
            }
            modal.hide();
          });

        modal.show();
      });

    // ? Evento editar produto
    $(".btn-editar-item")
      .off()
      .on("click", (e) => {
        const idProduto = $(e.target).attr("data-id");
        let produto = window.produtos.find((produto) => produto.id === +idProduto);
        $("#modal-produto > span").text("Editar");
        limparCamposModal();

        $("#nome-produto").val(produto.name);
        $("#preco-produto").val(produto.price);
        $("#descricao-produto").val(produto.description);
        $("#estoque-produto").val(produto.quantity);
        $("#imagens-produto").val(produto.picture);

        $("#btn-salvar-item")
          .off()
          .on("click", (e) => {
            if (!document.querySelector("#form-produto").checkValidity()) return;

            e.preventDefault();
            showLoader();
            const novasInfosProduto = {
              id: +idProduto,
              name: $("#nome-produto").val(),
              price: +$("#preco-produto").val(),
              picture: $("#imagens-produto").val(),
              description: $("#descricao-produto").val(),
              quantity: +$("#estoque-produto").val(),
            };
            const resultado = updateSingleProduct(novasInfosProduto);

            if (resultado.temErro) {
              ativaToastErro("Erro ao salvar alteracoes!");
            } else {
              produto.name = novasInfosProduto.name;
              produto.price = novasInfosProduto.price;
              produto.picture = novasInfosProduto.picture;
              produto.description = novasInfosProduto.description;
              produto.quantity = novasInfosProduto.quantity;
              $(`#${idProduto} > .nome`).text(novasInfosProduto.name);
              $(`#${idProduto} > .preco`).text(formataNumeroParaBRL(novasInfosProduto.price));
              $(`#${idProduto} > .estoque`).text(novasInfosProduto.quantity);
              ativaToastSucesso("Alteracoes salvas com sucesso!");

              modal.hide();
              hideLoader();
            }
          });

        modal.show();
      });

    // ? Evento deletar produto
    $(".btn-excluir-item")
      .off()
      .on("click", async (e) => {
        const idProduto = $(e.target).attr("data-id");
        const confirma = confirm(`Deseja excluir o produto ${window.produtos.find((produto) => produto.id === +idProduto).name}?`);

        if (confirma) {
          const resultado = await deleteSingleProduct(idProduto);

          if (resultado.temErro) {
            ativaToastErro("Erro ao deletar o produto!");
            return;
          }

          preencherTela();
          ativaToastSucesso("Produto excluído com sucesso!");
        }
      });

    // ? Evento para padronizacao do input preco
    $("#preco-produto").off().on("keydown", removerCaracteresInputNumber);

    // ? Evento para padronizacao do input estoque
    $("#estoque-produto")
      .off()
      .on("keydown", (e) => removerCaracteresInputNumber(e, true));
  }

  function limparCamposModal() {
    $("#nome-produto").val("");
    $("#preco-produto").val("");
    $("#descricao-produto").val("");
    $("#estoque-produto").val("");
    $("#imagens-produto").val("");
  }

  function removerCaracteresInputNumber(e, incluirVirgula = false) {
    const keysInvalidas = ["e", "E", "+", "-", "."];
    if (incluirVirgula) keysInvalidas.push(",");
    keysInvalidas.includes(e.key) && e.preventDefault();
  }
});
