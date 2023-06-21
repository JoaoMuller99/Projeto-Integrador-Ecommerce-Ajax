$(() => {
  $(document).ready(() => {
    preencherTela();
  });

  async function preencherTela() {
    const resultado = await ajaxCall();

    if (resultado.temErro) {
      alert("Erro ao carregar informações dos produtos!");
      return;
    }

    resultado.data.forEach((produto) => {
      const html = ``;
      $("main").append(html);
    });
  }

  function ajaxCall(method = "GET", aditionlOptions) {
    return new Promise((resposta) =>
      $.ajax({
        url: "http://localhost:3000/products",
        type: method,
        dataType: "json",
        ...aditionlOptions,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          resposta({ temErro: false, data });
        },
        error: function (error) {
          resposta({ temErro: true, error });
        },
      })
    );
  }
});
