using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdvanceRequest.Application.DTOs;

namespace AdvanceRequest.Application.Interfaces;

public interface IAdvanceRequestService
{
    Task RequestAdvanceAsync(AdvanceRequestDto request);

   Task<List<AdvanceRequestResponseDto>> GetAllAdvanceRequestsAsync(Guid clientId);

    Task<AdvanceRequestResponseDto?> GetAdvanceRequestByContractCodeAsync(string contractCode);

    Task ApproveInstallmentsAsync(ApproveRequestDto dto);

    Task<List<string>> GetInstallmentsOutsideClientAsync(List<string> codes, Guid clientId);

}
