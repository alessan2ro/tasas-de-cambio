const url = "https://cubadivisas.vercel.app/informal.json";

const monedasInfo = {
    "USD": { nombre: "USD", icon: "assets/icons/usa.svg" },
    "ECU": { nombre: "EUR", icon: "assets/icons/europe.svg" },
    "MLC": { nombre: "MLC", icon: "assets/icons/cuba.svg" }
};

// Objeto que se llenará con las tasas reales
let tasasCUP = {};

// Elementos del DOM
const monedaSelect = document.getElementById('moneda-select');
const inputCantidad = document.getElementById('input-cantidad');
const outputCantidad = document.getElementById('output-cantidad');

// Controla si el usuario está editando arriba o abajo
let editandoArriba = true;

function actualizarConversion() {
  const moneda = monedaSelect.value;
  const tasa = tasasCUP[moneda] || 0;
  if (editandoArriba) {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    outputCantidad.value = cantidad * tasa;
  } else {
    const cantidadCUP = parseFloat(outputCantidad.value) || 0;
    inputCantidad.value = tasa ? (cantidadCUP / tasa).toFixed(4) : 0;
  }
}

monedaSelect.addEventListener('change', actualizarConversion);

inputCantidad.addEventListener('input', () => {
  editandoArriba = true;
  actualizarConversion();
});

outputCantidad.addEventListener('input', () => {
  editandoArriba = false;
  actualizarConversion();
});

async function obtenerTasas() {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Sobrescribir tasasCUP con los valores reales
    tasasCUP = data.tasas;

    // Mostrar en el panel
    mostrarTasas(data.tasas);

    // Actualizar la conversión inicial (ya con las tasas correctas)
    actualizarConversion();

  } catch (error) {
    console.error("error al obtener las tasas:", error);
    document.getElementById("tasas").innerHTML = "<p>No se pudieron cargar las tasas.</p>"
  }
}

function mostrarTasas(tasas) {
  const contenedor = document.getElementById("tasas");
  contenedor.innerHTML = "";
  /*
  for (let moneda in tasas) {
    if (monedasInfo[moneda]) {
      const div = document.createElement("div");
      div.classList.add("rate");
      div.innerHTML = `
        <img src="${monedasInfo[moneda].icon}" alt="${monedasInfo[moneda].nombre}">
        <span>${monedasInfo[moneda].nombre}</span>
        <strong>${tasas[moneda]}</strong>`;
      contenedor.appendChild(div);
    }
  }
    */
}

// Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  inputCantidad.value = 1;       // valor por defecto
  editandoArriba = true;         // forzar edición arriba
  obtenerTasas();                // cargar tasas y luego actualizar
});