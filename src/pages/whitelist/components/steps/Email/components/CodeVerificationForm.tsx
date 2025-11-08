import type { FC } from "react";
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from "@/pages/whitelist/components/ui";
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
      <InputOTP containerClassName="flex-1 min-w-0" maxLength={4} onChange={onCodeChange} value={code}>
        <InputOTPGroup className="gap-2">
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={0} />
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={1} />
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={2} />
          <InputOTPSlot aria-invalid={!!verifyEmailErrorMessage} index={3} />
        </InputOTPGroup>
      </InputOTP>
      <ResendTimer onResendCode={handleResendCode} resendTimer={resendTimer} />
      <Button border="none" className="flex-shrink-0" loading={isVerifyingEmail} onClick={onVerifyCode} size="sm">
        {verifyEmailErrorMessage ? "Try again" : "Verify"}
      </Button>
    </>
  );
};
