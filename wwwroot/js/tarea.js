
    async function cargarCategorias() {
        try {
            // Obtener las categorías simplificadas desde la API
            let response = await fetch("https://localhost:7067/api/categoria/categorias-simplificadas");
            if (!response.ok) {
                throw new Error("Error al obtener las categorías");
            }

            let categorias = await response.json();
            console.log("Categorías obtenidas:", categorias); // Verificar las categorías obtenidas

            // Llenar el select de categorías en el formulario de agregar tarea
            let selectAgregar = document.getElementById("categoriaTarea");
            if (selectAgregar) {
                categorias.forEach(categoria => {
                    let option = document.createElement("option");
                    option.value = categoria.id; // Usar el ID de la categoría  
                    option.text = categoria.nombre; // Mostrar el nombre de la categoría
                    selectAgregar.appendChild(option);
                });
            }

            // Llenar el select con las categorías en cada fila
            document.querySelectorAll("tr[id^='row-']").forEach(fila => {
                let select = fila.querySelector("select[name='NombreCategoria']");
                let categoriaIdInput = fila.querySelector("input[name='CategoriaId']");

                if (select && categoriaIdInput) {
                    // Limpiar el select antes de llenarlo
                    select.innerHTML = "";

                    // Llenar el select con las categorías
                    categorias.forEach(categoria => {
                        let option = document.createElement("option");
                        option.value = categoria.id; // Usar el ID de la categoría
                        option.text = categoria.nombre; // Mostrar el nombre de la categoría

                        // Seleccionar la categoría actual
                        if (categoria.id == categoriaIdInput.value) {
                            option.selected = true;
                        }

                        select.appendChild(option);
                    });

                    console.log("Select llenado:", select); // Verificar el select llenado
                }
            });
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
        }
    }

    // Llamar a la función para cargar las categorías cuando la página se cargue
    window.onload = cargarCategorias;

    function habilitarEdicion(tareaId) {
        let fila = document.getElementById(`row-${tareaId}`);
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

    async function guardarEdicion(tareaId) {
        let fila = document.getElementById(`row-${tareaId}`);

        // Obtener los valores de los campos editables
        let selectCategoria = fila.querySelector("select[name='NombreCategoria']");
        let tarea = {
            TareaId: tareaId,
            NombreTarea: fila.querySelector("[name='NombreTarea']").value,
            DescripcionTarea: fila.querySelector("[name='DescripcionTarea']").value,
            PrioridadTarea: fila.querySelector("[name='PrioridadTarea']").value,
            CategoriaId: selectCategoria.value, // Obtener el ID de la categoría seleccionada
            NuevoNombreCategoria: selectCategoria.selectedOptions[0].text // Obtener el nombre de la categoría seleccionada
        };

        console.log("Datos enviados:", JSON.stringify(tarea));

        // Validar que la categoría no tenga un ID inválido
        if (!tarea.CategoriaId || tarea.CategoriaId === "00000000-0000-0000-0000-000000000000") {
            alert("Error: La categoría seleccionada no es válida.");
            return;
        }

        try {
            // Enviar la solicitud PUT al backend
            let response = await fetch(`https://localhost:7067/api/Tarea/${tareaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarea)
            });

            if (response.ok) {
                // Recargar la página si la actualización fue exitosa
                location.reload();
            } else {
                // Mostrar un mensaje de error si la respuesta no fue exitosa
                let errorData = await response.text(); // Usar response.text() en lugar de response.json()
                alert(`Error al actualizar la tarea: ${errorData}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud. Revisa la consola para más detalles.");
        }
    }

    // Agregar el manejador de eventos para el formulario de agregar tarea
    document.getElementById("formAgregarTarea").addEventListener("submit", async function (event) {
        event.preventDefault();

        let tarea = {
            NombreTarea: document.getElementById("nombreTarea").value,
            DescripcionTarea: document.getElementById("descripcionTarea").value,
            PrioridadTarea: convertirPrioridad(document.getElementById("prioridadTarea").value),
            CategoriaId: document.getElementById("categoriaTarea").value // Asegúrate de que esto sea un GUID válido
        };

        console.log("Datos enviados:", JSON.stringify(tarea)); // Verifica que el JSON sea correcto

        try {
            let response = await fetch("https://localhost:7067/api/Tarea", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarea)
            });

            if (response.ok) {
                location.reload();
            } else {
                let errorData = await response.text();
                alert(`Error al agregar la tarea: ${errorData}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud. Revisa la consola para más detalles.");
        }
    });

    // Función para convertir la prioridad de cadena a entero
    function convertirPrioridad(prioridad) {
        switch (prioridad) {
            case "Baja":
                return 0;
            case "Media":
                return 1;
            case "Alta":
                return 2;
            default:
                return 0; // Valor por defecto
        }
    }

    async function eliminarTarea(tareaId) {
        if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7067/api/Tarea/${tareaId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                // Eliminar la fila visualmente sin recargar la página
                const fila = document.getElementById(`row-${tareaId}`);
                fila.remove();
                alert("Tarea eliminada correctamente");
            } else {
                const errorData = await response.text();
                alert(`Error al eliminar la tarea: ${errorData}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la solicitud. Revisa la consola para más detalles.");
        }
    }
