export const loginTemplate = (
  name: string,
  location?: string,
  device?: string
) => {
  const company = process.env.COMPANY_NAME!;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Alert - ${company}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:30px 15px;">
      <tr>
        <td align="center">
          
          <!-- Simple Card -->
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#ef4444,#dc2626);padding:30px 20px;">
                <div style="background:rgba(255,255,255,0.2);width:60px;height:60px;border-radius:50%;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;">
                  <span style="color:white;font-size:30px;">💪</span>
                </div>
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">NEW LOGIN DETECTED</h1>
                <p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.9);">Stay secure, stay strong</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px 25px;">
                <p style="font-size:18px;font-weight:600;color:#111827;margin:0 0 15px 0;">Hey ${name} 🔥</p>
                
                <p style="font-size:15px;line-height:1.5;color:#4b5563;margin:0 0 20px 0;">
                  Someone just logged into your ${company} account. Here's what we know:
                </p>

                <!-- Details Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;padding:16px;margin:0 0 20px 0;">
                  <tr>
                    <td>
                      <p style="margin:0 0 8px 0;font-size:14px;color:#4b5563;">
                        <span style="color:#6b7280;">📅</span> ${new Date().toLocaleString()}
                      </p>
                      ${location ? `
                      <p style="margin:0 0 8px 0;font-size:14px;color:#4b5563;">
                        <span style="color:#6b7280;">📍</span> ${location}
                      </p>` : ''}
                      ${device ? `
                      <p style="margin:0;font-size:14px;color:#4b5563;">
                        <span style="color:#6b7280;">📱</span> ${device}
                      </p>` : ''}
                    </td>
                  </tr>
                </table>

                <!-- Simple Action -->
                <div style="text-align:center;margin:25px 0;">
                  <a href="#" 
                     style="background:#ef4444;
                            color:#ffffff;
                            text-decoration:none;
                            padding:12px 30px;
                            border-radius:30px;
                            font-size:15px;
                            font-weight:600;
                            display:inline-block;
                            border:1px solid #dc2626;">
                    🛡️ Secure Account
                  </a>
                </div>

                <!-- Message -->
                <p style="font-size:14px;color:#6b7280;line-height:1.5;margin:0;text-align:center;">
                  Not you? Secure your account immediately.<br/>
                  Keep pushing, stay safe! 💪
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:13px;color:#9ca3af;">
                  © ${new Date().getFullYear()} ${company} Fitness.<br/>
                  Every rep counts, every login matters.
                </p>
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

