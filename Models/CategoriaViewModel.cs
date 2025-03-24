using System.Text.Json.Serialization;

namespace WebAppTareas.Models;

public class CategoriaViewModel
{
    public Guid CategoriaId {get;set;}
    public string? NombreCategoria {get;set;}
    public string? DescripcionCategoria {get;set;}
    public int? PesoCategoria {get;set;}

    [JsonIgnore]
    public virtual ICollection<TareaViewModel>? Tareas {get;set;}
}