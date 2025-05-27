using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvanceRequest.Domain.Entities;

public class Contract
{
    public Guid Id { get; set; }
    public string ContractCode { get; set; } = string.Empty;
    public Guid ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;

    public ICollection<Installment> Installments { get; set; } = new List<Installment>();
}
