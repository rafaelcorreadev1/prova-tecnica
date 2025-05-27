using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvanceRequest.Application.DTOs;

public class AdvanceRequestResponseDto
{
    public string ContractCode { get; set; } = "";
    public string ClientName { get; set; } = "";
    public List<InstallmentInfo> Installments { get; set; } = new();

    public class InstallmentInfo
    {
        public string InstallmentCode { get; set; } = "";
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public bool Anticipated { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string? Status { get; set; }

    }
}

