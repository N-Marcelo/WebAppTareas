using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppTareas.Models;

namespace WebAppTareas.Controllers;

    [Route("[controller]")]
    public class TareaController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<TareaController> _logger;

        public TareaController (IHttpClientFactory httpClientFactory, ILogger<TareaController> logger)
            {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("ApiClient");
        }


        [HttpGet("tareas")]
        public async Task<IActionResult> IndexTarea()
        {
            //Creación de una lsita en donde se mostrarán las tareas
            List<TareaViewModel> tareas = new List<TareaViewModel>();

            try
            {
                var response = await _httpClient.GetAsync("api/tarea");

                if(response.IsSuccessStatusCode)
                {
                    var jsonTarea = await response.Content.ReadAsStringAsync();
                    tareas = JsonSerializer.Deserialize<List<TareaViewModel>>(jsonTarea, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    })?? new List<TareaViewModel>();
                    _logger.LogInformation($"Se obtuvieron {tareas.Count} tareas desde la API.");
                }
                else
                {
                    ViewData["Error"] = "Error al obtener las tareas de la API.";
                    _logger.LogError($"Error en la API: Código {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                ViewData["Error"] = $"Excepción: {ex.Message}";
                _logger.LogError($"Excepción en la solicitud: {ex.Message}");
            }

            return View("~/Views/Home/IndexTarea.cshtml", tareas);
        }


        [HttpPut]
        public async Task<IActionResult> EditPostTarea([FromBody] TareaViewModel tarea)
        {
            if (tarea == null || tarea.TareaId == Guid.Empty)
            {
                return BadRequest("Datos no válidos: Tarea es nula o ID vacío.");
            }

            try
            {
                // Crear el objeto que la API espera
                var tareaRequest = new
                {
                    TareaId = tarea.TareaId,
                    NombreTarea = tarea.NombreTarea,
                    DescripcionTarea = tarea.DescripcionTarea,
                    PrioridadTarea = tarea.PrioridadTarea,
                    CategoriaId = tarea.CategoriaId,
                    NuevoNombreCategoria = tarea.NuevoNombreCategoria // Enviar el nuevo nombre de categoría
                };

                // Serializar el objeto
                var jsonPutTarea = JsonSerializer.Serialize(tareaRequest);
                var content = new StringContent(jsonPutTarea, Encoding.UTF8, "application/json");

                // Hacer la solicitud PUT a la API
                var response = await _httpClient.PutAsync($"api/tarea/{tarea.TareaId}", content);

                // Leer la respuesta
                string responseText = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    return Ok("Tarea actualizada correctamente");
                }
                else
                {
                    return StatusCode((int)response.StatusCode, $"Error en la API: {responseText}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Excepción: {ex.Message}");
            }
        }

    }