using System.Security.Claims;
using AdvanceRequest.Application.DTOs;
using AdvanceRequest.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdvanceRequest.Api.Controllers;

[ApiController]
[Route("advance-request")]
[Authorize] 
public class AdvanceRequestController : ControllerBase
{
    private readonly IAdvanceRequestService _service;

    public AdvanceRequestController(IAdvanceRequestService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AdvanceRequestDto dto)
    {
        var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(clientIdClaim, out var clientIdFromToken) || clientIdFromToken != dto.ClientId)
            return Forbid();

        try
        {
            await _service.RequestAdvanceAsync(dto);
            return Ok(new { message = "Solicitação registrada com sucesso." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(clientIdClaim, out var clientId))
            return Forbid();

        var result = await _service.GetAllAdvanceRequestsAsync(clientId);
        return Ok(result);
    }


    [HttpGet("{contractCode}")]
    public async Task<IActionResult> GetById(string contractCode)
    {
        var result = await _service.GetAdvanceRequestByContractCodeAsync(contractCode);
        if (result == null)
            return NotFound(new { message = "Contrato não encontrado." });

        return Ok(result);
    }

    [HttpPut("approve")]
    public async Task<IActionResult> Approve([FromBody] ApproveRequestDto dto)
    {
        var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(clientIdClaim, out var clientIdFromToken))
            return Forbid();

        try
        {
            var unauthorizedInstallments = await _service.GetInstallmentsOutsideClientAsync(dto.InstallmentCodes, clientIdFromToken);
            if (unauthorizedInstallments.Any())
            {
                return StatusCode(403, new { error = "Você tentou aprovar parcelas que não pertencem ao seu contrato." });

            }

            await _service.ApproveInstallmentsAsync(dto);
            return Ok(new { message = "Parcelas aprovadas com sucesso." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

}
