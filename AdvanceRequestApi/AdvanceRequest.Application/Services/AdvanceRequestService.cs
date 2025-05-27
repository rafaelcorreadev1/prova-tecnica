using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdvanceRequest.Application.DTOs;
using AdvanceRequest.Application.Interfaces;
using AdvanceRequest.Domain.Entities;
using AdvanceRequest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AdvanceRequest.Application.Services;

public class AdvanceRequestService : IAdvanceRequestService
{
    private readonly ApplicationDbContext _context;

    public AdvanceRequestService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task RequestAdvanceAsync(AdvanceRequestDto request)
    {
        var contract = await _context.Contracts
            .Include(c => c.Installments)
            .FirstOrDefaultAsync(c => c.ContractCode == request.ContractCode);

        if (contract == null)
            throw new InvalidOperationException("Contrato não encontrado.");

        if (contract.ClientId != request.ClientId)
            throw new InvalidOperationException("Você só pode antecipar parcelas dos seus próprios contratos.");

        bool hasPendingAdvance = contract.Installments
            .Any(i => i.Anticipated && i.Status == "open");

        if (hasPendingAdvance)
            throw new InvalidOperationException("Você já possui uma solicitação de antecipação em aberto.");

        var installmentsToAdvance = contract.Installments
            .Where(i =>
                request.InstallmentCodes.Contains(i.InstallmentCode)
                && i.DueDate > DateTime.UtcNow.AddDays(30)
                && i.Status == "open"
                && !i.Anticipated
            )
            .ToList();

        if (installmentsToAdvance.Count == 0)
            throw new InvalidOperationException("Nenhuma parcela válida para antecipação.");

        foreach (var inst in installmentsToAdvance)
        {
            inst.Anticipated = true;
        }

        await _context.SaveChangesAsync();
    }


    public async Task<List<AdvanceRequestResponseDto>> GetAllAdvanceRequestsAsync(Guid clientId)
    {
        var contracts = await _context.Contracts
            .Include(c => c.Installments)
            .Where(c =>  c.Installments.Any(i => i.Anticipated))
            .ToListAsync();

        return contracts.Select(c => new AdvanceRequestResponseDto
        {
            ContractCode = c.ContractCode,
            ClientName = c.ClientName,
            Installments = c.Installments
                .Where(i => i.Anticipated && i.Status == "open")
                .Select(i => new AdvanceRequestResponseDto.InstallmentInfo
                {
                    InstallmentCode = i.InstallmentCode,
                    DueDate = i.DueDate,
                    Amount = i.Amount,
                    Anticipated = i.Anticipated,
                    ApprovedAt = i.ApprovedAt
                }).ToList()
        }).ToList();
    }


    public async Task<AdvanceRequestResponseDto?> GetAdvanceRequestByContractCodeAsync(string contractCode)
    {
        var contract = await _context.Contracts
            .Include(c => c.Installments)
            .FirstOrDefaultAsync(c => c.ContractCode == contractCode);

        if (contract == null)
            return null;

        var anticipatedInstallments = contract.Installments
            .ToList();

        return new AdvanceRequestResponseDto
        {
            ContractCode = contract.ContractCode,
            ClientName = contract.ClientName,
            Installments = anticipatedInstallments.Select(i => new AdvanceRequestResponseDto.InstallmentInfo
            {
                InstallmentCode = i.InstallmentCode,
                DueDate = i.DueDate,
                Amount = i.Amount,
                Anticipated = i.Anticipated,
                ApprovedAt = i.ApprovedAt,
                Status = i.Status
            }).ToList()
        };
    }


    public async Task ApproveInstallmentsAsync(ApproveRequestDto dto)
    {
        var installments = await _context.Installments
            .Where(i => dto.InstallmentCodes.Contains(i.InstallmentCode) && i.Anticipated)
            .ToListAsync();

        if (installments.Count == 0)
            throw new Exception("Nenhuma parcela válida para aprovação.");

        foreach (var installment in installments)
        {
           
            installment.Status = "paid";
            installment.ApprovedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<string>> GetInstallmentsOutsideClientAsync(List<string> codes, Guid clientId)
    {
        var installments = await _context.Installments
            .Include(i => i.Contract)
            .Where(i => codes.Contains(i.InstallmentCode))
            .ToListAsync();

        return installments
            .Where(i => i.Contract.ClientId != clientId)
            .Select(i => i.InstallmentCode)
            .ToList();
    }


}
