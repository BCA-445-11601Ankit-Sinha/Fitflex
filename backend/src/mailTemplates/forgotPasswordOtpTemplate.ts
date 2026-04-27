export const forgotPasswordOtpTemplate = (name: string, otp: string) => {
  const company = process.env.COMPANY_NAME ?? "FitFlex";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password reset code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:30px 15px;">
      <tr>
        <td align="center">
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 20px;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Password reset</h1>
                <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.9);">Hi ${name}, use this code in the app</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px;text-align:center;">
                <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.5;">
                  Enter this 6-digit code where prompted. It expires in <strong>15 minutes</strong>.
                </p>
                <div style="font-size:32px;font-weight:800;letter-spacing:0.35em;color:#111827;font-family:ui-monospace,monospace;padding:16px 12px;background:#f3f4f6;border-radius:12px;display:inline-block;">
                  ${otp}
                </div>
                <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">
                  If you did not request this, you can ignore this email. Do not share this code with anyone.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">${company}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
