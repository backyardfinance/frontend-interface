import type { FC } from "react";
import { Button } from "@/pages/landing/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui";
import { ResendTimer } from "./ResendTimer";

type CodeVerificationFormProps = {
  code: string;
  isVerifyingEmail: boolean;
  verifyEmailErrorMessage?: string;
  onCodeChange: (value: string) => void;
  onVerifyCode: () => void;
  handleResendCode: () => void;
  resendTimer: number;
};

export const CodeVerificationForm: FC<CodeVerificationFormProps> = ({
  code,
  isVerifyingEmail,
  verifyEmailErrorMessage,
  onCodeChange,
  onVerifyCode,
  handleResendCode,
  resendTimer,
}) => {
  return (
    <>
      <InputOTP containerClassName="flex-1" maxLength={4} onChange={onCodeChange} value={code}>
        <InputOTPGroup>
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={0} />
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={1} />
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={2} />
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={3} />
        </InputOTPGroup>
      </InputOTP>
      <ResendTimer onResendCode={handleResendCode} resendTimer={resendTimer} />
      <Button border="none" loading={isVerifyingEmail} onClick={onVerifyCode} size="sm">
        {verifyEmailErrorMessage ? "Try again" : "Verify"}
      </Button>
    </>
  );
};
