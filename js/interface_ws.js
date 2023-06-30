const url = "/products";

export function ajaxCall(endpoint, method = "GET", aditionlOptions) {
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

export async function getAllProducts() {
  return await ajaxCall(url);
}

export async function getSingleProduct(idProduto) {
  return await ajaxCall(`${url}/${idProduto}`);
}

export async function updateSingleProduct(item) {
  return await ajaxCall(`${url}/${item.id}`, "PUT", { data: JSON.stringify(item) });
}
