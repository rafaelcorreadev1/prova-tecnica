using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AdvanceRequest.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AdvanceRequest.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Installment> Installments => Set<Installment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Installment>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.ApprovedAt).IsRequired(false);
        });

        modelBuilder.Entity<Installment>(entity =>
        {
            entity.HasKey(i => i.Id);
        });
    }
}

