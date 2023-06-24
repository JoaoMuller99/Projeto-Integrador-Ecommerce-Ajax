$(() => {
  window.precoProduto = 0;
  window.quantidadeEmEstoque = 0;
  window.quantidadeSelecionada = 1;

  $(document).ready(() => {
    preencherTela();
    criarEventos();
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

    $(".img-container > img").attr("src", resultado.data.pictures[0]).attr("alt", resultado.data.name);
    $(".info-produto-container > h5").text(resultado.data.name);
    $(".info-produto-container > #description").text(resultado.data.description);
    window.precoProduto = resultado.data.price;
    atualizaExibicaoValorProduto();
    $(".info-produto-container > #estoque > span").text(resultado.data.quantity);
    atualizaExibicaoQuantidadeSelecionada();

    window.quantidadeEmEstoque = resultado.data.quantity;

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
      if (window.quantidadeSelecionada === window.quantidadeEmEstoque) return;

      window.quantidadeSelecionada++;
      atualizaExibicaoValorProduto();
      atualizaExibicaoQuantidadeSelecionada();
    });
  }

  function atualizaExibicaoValorProduto() {
    $(".info-produto-container > #price").text(formataNumeroParaBRL(window.precoProduto * window.quantidadeSelecionada));
  }

  function atualizaExibicaoQuantidadeSelecionada() {
    $(".info-produto-container > .seletor-quantidade-container > span").text(window.quantidadeSelecionada);
  }
});
