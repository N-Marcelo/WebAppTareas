using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppTareas.Models;

namespace WebAppTareas.Controllers;

    [Route("[controller]")]
    public class CategoriaController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<CategoriaController> _logger;

        public CategoriaController (IHttpClientFactory httpClientFactory, ILogger<CategoriaController> logger)
        {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("ApiClient");
        }

        [HttpGet("categorias")]
        public async Task<IActionResult> IndexCategoria()
        {
            
            //Creación de una lsita en donde se mostrarán las tareas
            List<CategoriaViewModel> categorias = new List<CategoriaViewModel>();

            try
            {
                var response = await _httpClient.GetAsync("api/categoria");

                if(response.IsSuccessStatusCode)
                {
                    var jsonCategoria = await response.Content.ReadAsStringAsync();
                    categorias = JsonSerializer.Deserialize<List<CategoriaViewModel>>(jsonCategoria, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    })?? new List<CategoriaViewModel>();
                    _logger.LogInformation($"Se obtuvieron {categorias.Count} categorias desde la API.");
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

            return View("~/Views/Home/IndexCategoria.cshtml", categorias);
        }
    }