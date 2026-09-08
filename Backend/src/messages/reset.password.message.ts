export const resetPasswordBody = (
  OTP: number,
  name: string,
  minutes: number,
) => `Hi ${name},

We received a request to reset the password for your TaskWeb account.

Use the verification code below to continue:

${OTP}

This code will expire in ${minutes} minutes.

If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.

For your security, please don’t share this verification code with anyone.

Thanks,
The TaskWeb Team
`;
export const RESET_PASSWORD_SUBJECT = `Reset your TaskWeb password`;
