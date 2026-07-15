export const otpEmailHtml = (username, otp, title, subtitle) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: #dd6b20; font-size: 28px; margin: 0;">${title}</h2>
      <p style="font-size: 14px; color: #718096; margin-top: 4px;">${subtitle}</p>
    </div>
    <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568; text-align: center;">
      <p>Hello <strong>${username}</strong>,</p>
      <p>Please use the 6-digit verification code below:</p>
      <div style="font-size: 32px; font-weight: bold; color: #dd6b20; background-color: #f7fafc; border: 1px dashed #e2e8f0; padding: 16px; margin: 24px 0; border-radius: 8px; letter-spacing: 4px;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #718096;">This code is valid for 10 minutes. If you did not make this request, please ignore this email.</p>
    </div>
    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
      <p>© ${new Date().getFullYear()} Growths Store. All rights reserved.</p>
    </div>
  </div>
`;
