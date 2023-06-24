export function ativaToastErro(mensagem = "Erro") {
  Toastify({
    text: mensagem,
    duration: 3000,
    close: false,
    gravity: "top",
    position: "center",
    style: {
      background: getComputedStyle(document.body).getPropertyValue("--bg-qtd-carrinho"),
    },
  }).showToast();
}

export function ativaToastCarrinho(mensagem = "") {
  Toastify({
    text: mensagem,
    duration: 3000,
    close: false,
    gravity: "top",
    position: "center",
    style: {
      background: getComputedStyle(document.body).getPropertyValue("--bg-adicionado-carrinho"),
    },
  }).showToast();
}
