import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import type { UsertInfoResponse } from "@/api";
import { ErrorMessage, InfoMessage, LockStep, StepWrapper } from "@/pages/whitelist/components/ui";
import { CodeVerificationForm } from "./components/CodeVerificationForm";
import { EmailInputForm } from "./components/EmailInputForm";
import { useEmailVerification } from "./hooks/useEmailVerification";

type Props = {
  disabled: boolean;
  isCompleted: boolean;
  user: UsertInfoResponse | undefined;
};

export const Email: FC<Props> = ({ disabled, isCompleted, user }) => {
  const {
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
    isSendEmailError,
    verifyEmailErrorMessage,
  } = useEmailVerification(user?.email);

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="font-bold text-xs leading-[normal] sm:text-sm">/Email</p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-xs leading-[normal] sm:text-sm">/Email</p>
        <LockStep />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="whitespace-nowrap font-bold text-xs leading-[normal] sm:text-sm">/Email</p>
        {!emailSent ? (
          <div className="flex w-full gap-2">
            <EmailInputForm
              email={email}
              isEmailValid={isEmailValid}
              isSendEmailError={isSendEmailError}
              isSendingEmail={isSendingEmail}
              onEmailChange={handleEmailChange}
              onSendEmail={handleSendEmail}
            />
          </div>
        ) : (
          <div className="flex w-full gap-2">
            <CodeVerificationForm
              code={code}
              handleResendCode={handleResendCode}
              isVerifyingEmail={isVerifyingEmail}
              onCodeChange={setCode}
              onVerifyCode={handleVerifyCode}
              resendTimer={resendTimer}
              verifyEmailErrorMessage={verifyEmailErrorMessage}
            />
          </div>
        )}
      </div>

      {verifyEmailErrorMessage ? (
        <ErrorMessage message={verifyEmailErrorMessage} />
      ) : (
        <InfoMessage message="*We'll notify you with early updates, beta access, and major product announcements" />
      )}
    </StepWrapper>
  );
};
