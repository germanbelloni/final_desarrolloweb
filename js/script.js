const $d = document;
const $table = $d.querySelector(".crud-table");
const $form = $d.querySelector(".crud-form");
const $title = $d.querySelector(".crud-title");
const $template = $d.getElementById("crud-template").content;
const $fragement = $d.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await axios.get("http://localhost:4444/productos");
    let json = await res.data;

    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.name;
      $template.querySelector(".amount").textContent = el.amount;
      $template.querySelector(".price").textContent = el.price;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.name;
      $template.querySelector(".edit").dataset.amount = el.amount;
      $template.querySelector(".edit").dataset.price = el.price;
      $template.querySelector(".delete").dataset.id = el.id;

      let $clone = $d.importNode($template, true);

      $fragement.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragement);
  } catch (error) {
    let message = error.statusText || "Hubo un error";
    $table.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
  }
};

$d.addEventListener("DOMContentLoaded", getAll);

$d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      try {
        let options = {
          method: "POST",
          headers: { "Content-type": "application/json; charset=utf-8" },
          data: JSON.stringify({
            name: e.target.name.value,
            amount: e.target.amount.value,
            price: e.target.price.value,
          }),
        };
        let res = await axios("http://localhost:4444/productos", options);
        let json = await res.data;

        location.reload();
      } catch (error) {
        let message = error.statusText || "Hubo un error";
        $form.insertAdjacentHTML(
          "afterend",
          `Error: ${error.status}: ${message}`
        );
      }
    } else {
      try {
        let options = {
          method: "PUT",
          headers: { "Content-type": "application/json; charset=utf-8" },
          data: JSON.stringify({
            name: e.target.name.value,
            amount: e.target.amount.value,
            price: e.target.price.value,
          }),
        };
        let res = await axios(
          `http://localhost:4444/productos/${e.target.id.value}`,
          options
        );
        let json = await res.data;

        location.reload();
      } catch (error) {
        let message = error.statusText || "Hubo un error";
        $form.insertAdjacentHTML(
          "afterend",
          `Error: ${error.status}: ${message}`
        );
      }
    }
  }
});

$d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "EDITAR PRODUCTO";
    $form.name.value = e.target.dataset.name;
    $form.amount.value = e.target.dataset.amount;
    $form.price.value = e.target.dataset.price;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    let ok = confirm("Estas seguro que deseas eliminar?");
    if (ok) {
      try {
        let options = {
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=utf-8" },
        };
        let res = await axios(
          `http://localhost:4444/productos/${e.target.dataset.id}`,
          options
        );
        let json = await res.data;

        location.reload();
      } catch (error) {
        let message = error.statusText || "Hubo un error";
        $form.insertAdjacentHTML(
          "afterend",
          `Error: ${error.status}: ${message}`
        );
      }
    }
  }
});
