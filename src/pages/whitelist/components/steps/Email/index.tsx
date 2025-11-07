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
        {!emailSent ? (
          <EmailInputForm
            email={email}
            isEmailValid={isEmailValid}
            isSendEmailError={isSendEmailError}
            isSendingEmail={isSendingEmail}
            onEmailChange={handleEmailChange}
            onSendEmail={handleSendEmail}
          />
        ) : (
          <CodeVerificationForm
            code={code}
            handleResendCode={handleResendCode}
            isVerifyingEmail={isVerifyingEmail}
            onCodeChange={setCode}
            onVerifyCode={handleVerifyCode}
            resendTimer={resendTimer}
            verifyEmailErrorMessage={verifyEmailErrorMessage}
          />
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
