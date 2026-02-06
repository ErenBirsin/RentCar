using FluentValidation;
using GenericRepository;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Customers;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerForgotPasswordCommand(string Email) : IRequest<Result<string>>;

public sealed class CustomerForgotPasswordCommandValidator : AbstractValidator<CustomerForgotPasswordCommand>
{
    public CustomerForgotPasswordCommandValidator()
    {
        RuleFor(p => p.Email)
            .NotEmpty().WithMessage("Geçerli bir mail adresi girin")
            .EmailAddress().WithMessage("Geçerli bir mail adresi girin");
    }
}

internal sealed class CustomerForgotPasswordCommandHandler(
    ICustomerRepository customerRepository,
    IUnitOfWork unitOfWork,
    IMailService mailService) : IRequestHandler<CustomerForgotPasswordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CustomerForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var customer = await customerRepository.FirstOrDefaultAsync(p => p.Email.Value == request.Email, cancellationToken);

        if (customer is null)
        {
            return Result<string>.Failure("Kullanıcı bulunamadı");
        }

        customer.CreateForgotPasswordId();
        customerRepository.Update(customer);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        string to = customer.Email.Value;
        string subject = "Şifre Sıfırla";
        string body = @"<!DOCTYPE html>
<html lang=""tr"">

<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Şifre Sıfırlama</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        body {
            font-family: Arial, sans-serif !important;
            line-height: 1.6 !important;
            color: #333 !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f9f9f9 !important;
            width: 100% !important;
            min-width: 100% !important;
            height: 100% !important;
        }

        .container {
            background: #ffffff !important;
            padding: 30px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .header {
            text-align: center !important;
            margin-bottom: 30px !important;
            padding-bottom: 20px !important;
            border-bottom: 2px solid #ff6b35 !important;
        }

        .logo {
            font-size: 24px !important;
            font-weight: bold !important;
            color: #ff6b35 !important;
            margin-bottom: 5px !important;
            display: block !important;
        }

        .email-title {
            color: #333 !important;
            font-size: 20px !important;
            margin: 0 !important;
            font-weight: normal !important;
        }

        .button-container {
            text-align: center !important;
            margin: 25px 0 !important;
        }

        .button {
            display: inline-block !important;
            padding: 12px 20px !important;
            background-color: #ff6b35 !important;
            color: #ffffff !important;
            text-decoration: none !important;
            text-align: center !important;
            border-radius: 5px !important;
            font-weight: bold !important;
            font-size: 14px !important;
            border: none !important;
            min-width: 200px !important;
        }

        .warning {
            background: #fff3cd !important;
            border: 1px solid #ffeaa7 !important;
            padding: 15px !important;
            border-radius: 5px !important;
            margin: 20px 0 !important;
            font-size: 14px !important;
        }

        .link-text {
            background: #f8f9fa !important;
            padding: 10px !important;
            border: 1px solid #ddd !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            word-break: break-all !important;
            color: #007bff !important;
        }

        .footer {
            margin-top: 30px !important;
            padding-top: 20px !important;
            border-top: 1px solid #eee !important;
            text-align: center !important;
            font-size: 12px !important;
            color: #666 !important;
        }

        @media screen and (max-width: 600px) {
            .container {
                padding: 20px !important;
            }

            .logo {
                font-size: 20px !important;
            }

            .email-title {
                font-size: 18px !important;
            }

            .button {
                width: 90% !important;
                min-width: auto !important;
            }
        }
    </style>
</head>

<body>
    <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"" style=""background-color: #f9f9f9;"">
        <tr>
            <td align=""center"" style=""padding: 20px;"">
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"" style=""max-width: 500px;"">
                    <tr>
                        <td>
                            <div class=""container"">
                                <div class=""header"">
                                    <div class=""logo"">RentCar</div>
                                    <h1 class=""email-title"">Şifre Sıfırlama</h1>
                                </div>

                                <div>
                                    <div style=""font-weight: bold; margin-bottom: 15px;"">Merhaba {UserName},</div>

                                    <div style=""margin-bottom: 20px; font-size: 14px;"">
                                        Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın:
                                    </div>

                                    <div class=""button-container"">
                                        <a href=""{ResetPasswordUrl}"" target=""_blank"" class=""button"">Şifremi Sıfırla</a>
                                    </div>

                                    <div class=""warning"">
                                        <strong>⚠️ Önemli:</strong> Bu bağlantı 24 saat sonra geçersiz olacaktır. Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelin.
                                    </div>

                                    <div style=""margin: 15px 0;"">
                                        <div style=""font-weight: bold; margin-bottom: 10px;"">Butona tıklayamıyorsanız bu bağlantıyı kopyalayın:</div>
                                        <div class=""link-text"">{ResetPasswordUrl}</div>
                                    </div>
                                </div>

                                <div class=""footer"">
                                    Bu e-posta otomatik gönderilmiştir.<br>
                                    © 2025 RentCar - Tüm hakları saklıdır.
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>";

        body = body.Replace("{UserName}", customer.FirstName.Value + " " + customer.LastName.Value);
        body = body.Replace("{ResetPasswordUrl}", $"http://localhost:4202/reset-password/{customer.ForgotPasswordCode!.Value}");

        await mailService.SendAsync(to, subject, body, cancellationToken);
        return "Şifre sıfırlama maili gönderilmiştir. Lütfen mail adresinizi kontrol ediniz";
    }
}