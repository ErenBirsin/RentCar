using FluentValidation;
using GenericRepository;
using RentCarServer.Domain.Categories;
using RentCarServer.Domain.Shared;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Categories;

public sealed record CategoryUpdateCommand(
    Guid Id,
    string Name,
    bool IsActive) : IRequest<Result<string>>;

public sealed class CategoryUpdateCommandValidator : AbstractValidator<CategoryUpdateCommand>
{
    public CategoryUpdateCommandValidator()
    {
        RuleFor(p => p.Name).NotEmpty().WithMessage("Geçerli bir kategori adı girin");
    }
}

internal sealed class CategoryUpdateCommandHandler(
    ICategoryRepository categoryRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<CategoryUpdateCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CategoryUpdateCommand request, CancellationToken cancellationToken)
    {
        var category = await categoryRepository.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (category is null)
        {
            return Result<string>.Failure("Kategori bulunamadı");
        }

        if (!string.Equals(category.Name.Value, request.Name, StringComparison.OrdinalIgnoreCase))
        {
            var nameExists = await categoryRepository.AnyAsync(
                p => p.Name.Value == request.Name && p.Id != request.Id,
                cancellationToken);

            if (nameExists)
            {
                return Result<string>.Failure("Kategori adı daha önce tanımlanmış");
            }
        }

        Name name = new(request.Name);
        category.SetName(name);
        category.SetStatus(request.IsActive);
        categoryRepository.Update(category);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return "Kategori başarıyla güncellendi";
    }
}