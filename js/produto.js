$(() => {
  $(document).ready(() => {
    preencherTela();
  });

  async function preencherTela() {
    const idProduto = +window.location.hash.split("#")[1];

    if (!idProduto) {
      alert("Id produto não encontrado/inválido!");
      hideLoader();
      return;
    }

    const resultado = await ajaxCall(`/products/${idProduto}`);

    if (resultado.temErro) {
      alert("Erro ao carregar informações do produto!");
      hideLoader();
      return;
    }

    hideLoader();
  }
});
