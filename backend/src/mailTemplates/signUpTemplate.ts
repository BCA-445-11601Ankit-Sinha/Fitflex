export const signUpTemplate = (name: string) => {
  const company = process.env.COMPANY_NAME!;
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to ${company} 💪</title>
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
                <div style="background:rgba(255,255,255,0.2);width:70px;height:70px;border-radius:50%;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;">
                  <span style="color:white;font-size:35px;">🏋️</span>
                </div>
                <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">WELCOME TO THE GYM!</h1>
                <p style="margin:8px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">Your journey starts today</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px 25px;">
                <p style="font-size:20px;font-weight:600;color:#111827;margin:0 0 5px 0;">Hey ${name}!</p>
                <p style="font-size:16px;color:#ef4444;font-weight:500;margin:0 0 20px 0;">Ready to crush your goals? 🔥</p>
                
                <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 20px 0;">
                  Thanks for joining <strong>${company}</strong>. We're here to help you become the strongest version of yourself - inside and out.
                </p>

                <!-- Motivation Quote -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:12px;padding:20px;margin:20px 0;">
                  <tr>
                    <td align="center">
                      <p style="margin:0;font-size:18px;font-weight:500;color:#ef4444;font-style:italic;">
                        "The only bad workout is the one that didn't happen."
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Simple Steps -->
                <div style="margin:25px 0;">
                  <p style="font-size:16px;font-weight:600;color:#111827;margin:0 0 15px 0;">Your first steps:</p>
                  
                  <div style="display:flex;align-items:center;gap:12px;margin:0 0 12px 0;">
                    <span style="background:#ef4444;color:white;width:24px;height:24px;border-radius:30px;display:inline-block;text-align:center;line-height:24px;font-size:14px;">1</span>
                    <span style="font-size:15px;color:#4b5563;">Complete your profile</span>
                  </div>
                  
                  <div style="display:flex;align-items:center;gap:12px;margin:0 0 12px 0;">
                    <span style="background:#ef4444;color:white;width:24px;height:24px;border-radius:30px;display:inline-block;text-align:center;line-height:24px;font-size:14px;">2</span>
                    <span style="font-size:15px;color:#4b5563;">Book your first class</span>
                  </div>
                  
                  <div style="display:flex;align-items:center;gap:12px;">
                    <span style="background:#ef4444;color:white;width:24px;height:24px;border-radius:30px;display:inline-block;text-align:center;line-height:24px;font-size:14px;">3</span>
                    <span style="font-size:15px;color:#4b5563;">Show up and give it your all</span>
                  </div>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin:30px 0 20px;">
                  <a href="#" 
                     style="background:#ef4444;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 35px;
                            border-radius:30px;
                            font-size:16px;
                            font-weight:600;
                            display:inline-block;
                            border:1px solid #dc2626;">
                    LET'S GET STARTED 🚀
                  </a>
                </div>

                <!-- Support -->
                <p style="font-size:14px;color:#6b7280;line-height:1.5;margin:20px 0 0 0;text-align:center;">
                  Questions? We're here to help - support@fitflex.com<br/>
                  Now go crush those goals! 💪
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:13px;color:#9ca3af;">
                  © ${new Date().getFullYear()} ${company}. All rights reserved.<br/>
                  Stronger every day, together.
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