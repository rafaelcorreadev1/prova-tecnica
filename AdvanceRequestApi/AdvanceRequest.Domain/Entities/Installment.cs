using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvanceRequest.Domain.Entities;

public class Installment
{
    public Guid Id { get; set; }
    public string InstallmentCode { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = "open"; 
    public bool Anticipated { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }

    public Guid ContractId { get; set; }
    public Contract Contract { get; set; } = null!;
}