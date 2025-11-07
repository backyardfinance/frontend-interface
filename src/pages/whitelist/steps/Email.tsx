import { CheckIcon } from "lucide-react";
import { type FC, useState } from "react";
import { z } from "zod";
import { useUsersSendEmail, useUsersVerifyEmail } from "@/hooks/useUsers";
import { Button } from "@/pages/landing/button";
import { EmailInput, InfoMessage, LockStep, StepWrapper } from "./ui";

type Props = {
  disabled: boolean;
  isCompleted: boolean;
};

const emailSchema = z.object({
  email: z.email(),
});

export const Email: FC<Props> = ({ disabled, isCompleted }) => {
  const { mutateAsync: sendEmail, isPending: isSendingEmail, isError: isSendEmailError } = useUsersSendEmail();
  const { mutateAsync: verifyEmail, isPending: isVerifyingEmail, isError: isVerifyEmailError } = useUsersVerifyEmail();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleSendEmail = async () => {
    if (!isEmailValid) return;

    try {
      await sendEmail({ email });
      setEmailSent(true);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyEmail({ email, code });
    } catch (error) {
      console.error("Failed to verify code:", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setIsEmailValid(true);
      return;
    }
    const result = emailSchema.safeParse({ email: value });
    setIsEmailValid(result.success);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 4);
    setCode(value);
  };

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="font-bold text-sm leading-[normal]">/Email</p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-sm leading-[normal]">/Email</p>
        <LockStep />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full items-center gap-4">
        <p className="font-bold text-sm leading-[normal]">/Email</p>
        <EmailInput aria-invalid={!isEmailValid} disabled={emailSent} onChange={handleEmailChange} value={email} />
        {!emailSent ? (
          <Button border="none" loading={isSendingEmail} onClick={handleSendEmail} size="sm">
            {isSendEmailError ? "Try again" : "Confirm"}
          </Button>
        ) : (
          <>
            <EmailInput
              aria-invalid={!!isVerifyEmailError}
              maxLength={4}
              onChange={handleCodeChange}
              placeholder="Code"
              type="text"
              value={code}
            />
            <Button border="none" loading={isVerifyingEmail} onClick={handleVerifyCode} size="sm">
              {isVerifyEmailError ? "Try again" : "Verify"}
            </Button>
          </>
        )}
      </div>

      {/* TODO: add error message */}
      <InfoMessage message="*We'll notify you with early updates, beta access, and major product announcements" />
    </StepWrapper>
  );
};
