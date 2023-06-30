$(() => {
  $(document).ready(() => {
    criaEventos();
  });

  function criaEventos() {
    // ? Evento para o botao voltar
    $("#button-voltar").on("click", () => history.back());
  }
});
