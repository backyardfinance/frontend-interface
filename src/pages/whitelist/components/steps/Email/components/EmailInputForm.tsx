import type { FC } from "react";
import { Button, EmailInput } from "@/pages/whitelist/components/ui";

type EmailInputFormProps = {
  email: string;
  isEmailValid: boolean;
  isSendingEmail: boolean;
  isSendEmailError: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendEmail: () => void;
};

export const EmailInputForm: FC<EmailInputFormProps> = ({
  email,
  isEmailValid,
  isSendingEmail,
  isSendEmailError,
  onEmailChange,
  onSendEmail,
}) => {
  return (
    <>
      <EmailInput aria-invalid={!isEmailValid} className="flex-1" onChange={onEmailChange} value={email} />
      <Button border="none" className="flex-shrink-0" loading={isSendingEmail} onClick={onSendEmail} size="sm">
        {isSendEmailError ? "Try again" : "Confirm"}
      </Button>
    </>
  );
};
