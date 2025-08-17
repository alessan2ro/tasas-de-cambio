const url = "https://san2ro.github.io/tasas-de-cambio/informal.json";

const monedasInfo = {
    "USD":{ nombre: "Dólar estadounidense", icon: "assets/icons/usa.svg"},
    "ECU":{ nombre: "Euro", icon: "assets/icons/europe.svg"}
};

async function obtenerTasas() {
    try{
        const response = await fetch(url,{cache: "no-store"});
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        mostrarTasas(data.tasas);
    }catch(error){
        console.error("error al obtener las tasas:", error);
        document.getElementById("tasas").innerHTML = "<p>No se pudieron cargar las tasas.</p>"
    }
}

function mostrarTasas(tasas){
    const contenedor = document.getElementById("tasas");
    contenedor.innerHTML = "";
    for(let moneda in tasas){
        if(monedasInfo[moneda]){
            const div = document.createElement("div");
            div.classList.add("rate");
            div.innerHTML = `<img src="${monedasInfo[moneda].icon}" alt="${monedasInfo[moneda].nombre}">
            <span>${monedasInfo[moneda].nombre}</span>
            <strong>${tasas[moneda]}</strong>`;
            contenedor.appendChild(div);
        }
    }
}

obtenerTasas();