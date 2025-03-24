using System.Text.Json.Serialization;

namespace WebAppTareas.Models;
    public class TareaViewModel
    {
        public Guid TareaId { get; set; }
        public string? NombreTarea { get; set; }
        public string? DescripcionTarea { get; set; }
        public Guid CategoriaId { get; set; }
        public string? NombreCategoria { get; set; }
        public string? NuevoNombreCategoria { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Prioridad PrioridadTarea { get; set; }
        public DateTime FechaCreacionTarea { get; set; }

        public enum Prioridad
        {
        Baja = 0,
        Media = 1,
        Alta = 2
        }
    }

