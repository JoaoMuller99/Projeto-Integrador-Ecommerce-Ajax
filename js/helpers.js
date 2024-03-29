export function formataNumeroParaBRL(numero) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numero);
}

export function showLoader() {
  $("#loader-container").css("display", "flex");
}

export function hideLoader() {
  setTimeout(() => $("#loader-container").hide(), 500);
}
