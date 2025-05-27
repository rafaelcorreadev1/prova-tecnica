using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using AdvanceRequest.Domain.Entities;
using AdvanceRequest.Infrastructure.Data;

namespace AdvanceRequest.Infrastructure.SeedData;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (context.Contracts.Any()) return;

        var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "contracts-mock.json");

        if (!File.Exists(filePath))
        {
            Console.WriteLine("Arquivo JSON de seed não encontrado.");
            return;
        }

        var json = await File.ReadAllTextAsync(filePath);
        var contractDtos = JsonSerializer.Deserialize<List<ContractDto>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (contractDtos == null) return;

        foreach (var dto in contractDtos)
        {
            var contract = new Contract
            {
                Id = Guid.NewGuid(),
                ContractCode = dto.ContractCode,
                ClientId = Guid.Parse(dto.ClientId),
                ClientName = dto.ClientName,
                Installments = dto.Installments.Select(i => new Installment
                {
                    Id = Guid.NewGuid(),
                    InstallmentCode = i.InstallmentCode,
                    DueDate = DateTime.SpecifyKind(i.DueDate, DateTimeKind.Utc),
                    Amount = i.Amount,
                    Status = i.Status,
                    Anticipated = i.Anticipated
                }).ToList()
            };

            context.Contracts.Add(contract);
        }

        await context.SaveChangesAsync();
    }

    private class ContractDto
    {
        public string ContractCode { get; set; } = "";
        public string ClientId { get; set; } = "";
        public string ClientName { get; set; } = "";
        public List<InstallmentDto> Installments { get; set; } = new();
    }

    private class InstallmentDto
    {
        public string InstallmentCode { get; set; } = "";
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = "";
        public bool Anticipated { get; set; }
    }
}
