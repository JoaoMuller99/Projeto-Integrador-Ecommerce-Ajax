function ajaxCall(endpoint, method = "GET", aditionlOptions) {
  return new Promise((resposta) =>
    $.ajax({
      url: `http://localhost:3000${endpoint}`,
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

function formataNumeroParaBRL(numero) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numero);
}

function showLoader() {
  $("#loader-container").css("display", "flex");
}

function hideLoader() {
  setTimeout(() => $("#loader-container").hide(), 500);
}