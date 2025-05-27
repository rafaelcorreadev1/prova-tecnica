﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdvanceRequest.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedAtToInstallments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedAt",
                table: "Installments",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovedAt",
                table: "Installments");
        }
    }
}
