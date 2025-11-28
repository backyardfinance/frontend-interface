import { useEffect, useState } from "react";
import { z } from "zod";
import { useWhitelistSendEmail, useWhitelistVerifyEmail } from "@/whitelist/queries/useWhitelist";

const emailSchema = z.object({
  email: z.email(),
});

const RESEND_TIMER_SECONDS = 60; // 1 minute

export const useEmailVerification = () => {
  const { mutateAsync: sendEmail, isPending: isSendingEmail, error: sendEmailError } = useWhitelistSendEmail();
  const { mutateAsync: verifyEmail, isPending: isVerifyingEmail, error: verifyEmailError } = useWhitelistVerifyEmail();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer effect for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateEmail = (value: string) => {
    if (!value) {
      setIsEmailValid(true);
      return true;
    }
    const result = emailSchema.safeParse({ email: value });
    const isValid = result.success;
    setIsEmailValid(isValid);
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSendEmail = async () => {
    if (!isEmailValid) return;

    try {
      await sendEmail({ email });
      setEmailSent(true);
      setResendTimer(RESEND_TIMER_SECONDS);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      await sendEmail({ email });
      setResendTimer(RESEND_TIMER_SECONDS);
      setCode("");
    } catch (error) {
      console.error("Failed to resend email:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (code.length < 4) return;
      await verifyEmail({ code });
    } catch (error) {
      console.error("Failed to verify code:", error);
    }
  };

  const sendEmailErrorMessage = sendEmailError?.response?.data.message;
  const verifyEmailErrorMessage = verifyEmailError?.response?.data.message[0];

  return {
    email,
    code,
    emailSent,
    isEmailValid,
    resendTimer,

    handleEmailChange,
    handleSendEmail,
    handleResendCode,
    handleVerifyCode,
    setCode,

    isSendingEmail,
    isVerifyingEmail,

    sendEmailErrorMessage,
    verifyEmailErrorMessage,
  };
};
