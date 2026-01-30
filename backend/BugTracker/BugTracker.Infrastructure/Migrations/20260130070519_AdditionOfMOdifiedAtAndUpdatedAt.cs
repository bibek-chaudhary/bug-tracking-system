using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BugTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdditionOfMOdifiedAtAndUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CreatedByUserId",
                table: "Bugs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedToUserId",
                table: "Bugs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AssignedAt",
                table: "Bugs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Bugs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bugs_AssignedToUserId",
                table: "Bugs",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Bugs_CreatedByUserId",
                table: "Bugs",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_AspNetUsers_AssignedToUserId",
                table: "Bugs",
                column: "AssignedToUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_AspNetUsers_CreatedByUserId",
                table: "Bugs",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_AspNetUsers_AssignedToUserId",
                table: "Bugs");

            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_AspNetUsers_CreatedByUserId",
                table: "Bugs");

            migrationBuilder.DropIndex(
                name: "IX_Bugs_AssignedToUserId",
                table: "Bugs");

            migrationBuilder.DropIndex(
                name: "IX_Bugs_CreatedByUserId",
                table: "Bugs");

            migrationBuilder.DropColumn(
                name: "AssignedAt",
                table: "Bugs");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Bugs");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedByUserId",
                table: "Bugs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedToUserId",
                table: "Bugs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
