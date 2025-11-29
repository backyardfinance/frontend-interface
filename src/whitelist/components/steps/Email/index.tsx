import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { ErrorMessage, InfoMessage, LockStep, StepWrapper } from "@/whitelist/components/ui";
import { CodeVerificationForm } from "./components/CodeVerificationForm";
import { EmailInputForm } from "./components/EmailInputForm";
import { useEmailVerification } from "./hooks/useEmailVerification";

type Props = {
  disabled: boolean;
  isCompleted: boolean;
  connectedEmail: string | null | undefined;
};

export const Email: FC<Props> = ({ connectedEmail, disabled, isCompleted }) => {
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
    sendEmailErrorMessage,
    verifyEmailErrorMessage,
  } = useEmailVerification();

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="flex items-center gap-2 font-bold text-xs leading-[normal] sm:text-sm">
          /Email
          {connectedEmail && <span className="text-[#8D8D8D] text-xs">({connectedEmail})</span>}
        </p>
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
              isSendEmailError={!!sendEmailErrorMessage}
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

      {sendEmailErrorMessage ? (
        <ErrorMessage message={sendEmailErrorMessage} />
      ) : verifyEmailErrorMessage ? (
        <ErrorMessage message={verifyEmailErrorMessage} />
      ) : !isEmailValid ? (
        <ErrorMessage message="Please enter a valid email" />
      ) : (
        <InfoMessage message="*We'll notify you with early updates, beta access, and major product announcements" />
      )}
    </StepWrapper>
  );
};
