
function habilitarEdicion(categoriaId) {
    let fila = document.getElementById(`row-${categoriaId}`);
    fila.querySelectorAll(".text").forEach(el => el.classList.add("d-none")); // Ocultar textos
    fila.querySelectorAll("input, select").forEach(el => el.classList.remove("d-none")); // Mostrar inputs
    fila.querySelector(".btn-warning").classList.add("d-none"); // Ocultar botón "Editar"
    fila.querySelector(".btn-success").classList.remove("d-none"); // Mostrar botón "Guardar"
}

document.getElementById('toggleFormBtn').onclick = function() {
    const form = document.getElementById('formContainer');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    this.innerHTML = form.style.display === 'none' 
        ? '<i class="fas fa-plus-circle"></i> Mostrar Formulario' 
        : '<i class="fas fa-minus-circle"></i> Ocultar Formulario';
};

async function guardarEdicion(categoriaId) {
    let fila = document.getElementById(`row-${categoriaId}`);

    // Obtener los valores de los campos editables
    let categoria = {
        CategoriaId: categoriaId,
        NombreCategoria: fila.querySelector("[name='NombreCategoria']").value,
        DescripcionCategoria: fila.querySelector("[name='DescripcionCategoria']").value,
        PesoCategoria: fila.querySelector("[name='PesoCategoria']").value,
    };

    console.log("Datos enviados:", JSON.stringify(categoria));

    // Validar que la categoría no tenga un ID inválido
    if (!categoria.CategoriaId || categoria.CategoriaId === "00000000-0000-0000-0000-000000000000") {
        alert("Error: La categoría seleccionada no es válida.");
        return;
    }

    try {
        // Enviar la solicitud PUT al backend
        let response = await fetch(`https://localhost:7067/api/Categoria/${categoriaId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoria)
        });

        if (response.ok) {
            // Recargar la página si la actualización fue exitosa
            location.reload();
        } else {
            // Mostrar un mensaje de error si la respuesta no fue exitosa
            let errorData = await response.text(); // Usar response.text() en lugar de response.json()
            alert(`Error al actualizar la categoria: ${errorData}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud. Revisa la consola para más detalles.");
    }
}

document.getElementById("formAgregarCategoria").addEventListener("submit", async function (event) {
    event.preventDefault();

    let categoria = {
        NombreCategoria: document.getElementById("nombreCategoria").value,
        DescripcionCategoria: document.getElementById("descripcionCategoria").value,
        PesoCategoria: document.getElementById("pesoCategoria").value
    };

    console.log("Datos enviados:", JSON.stringify(categoria)); // Verifica que el JSON sea correcto

    try {
        let response = await fetch("https://localhost:7067/api/Categoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoria) 
        });

        if (response.ok) {
            location.reload();
        } else {
            let errorData = await response.text();
            alert(`Error al agregar la categoria: ${errorData}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud. Revisa la consola para más detalles.");
    }
});

async function eliminarCategoria(categoriaId) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoria?")) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:7067/api/Categoria/${categoriaId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            // Eliminar la fila visualmente sin recargar la página
            const fila = document.getElementById(`row-${categoriaId}`);
            fila.remove();
            alert("Categoria eliminada correctamente");
        } else {
            const errorData = await response.text();
            alert(`Error al eliminar la categoria: ${errorData}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la solicitud. Revisa la consola para más detalles.");
    }
}