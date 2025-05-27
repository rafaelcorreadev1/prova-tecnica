using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvanceRequest.Application.DTOs;

public class AdvanceRequestDto
{
    public Guid ClientId { get; set; }
    public string ContractCode { get; set; } = string.Empty;
    public List<string> InstallmentCodes { get; set; } = new();
}
