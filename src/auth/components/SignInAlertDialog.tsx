import bs58 from "bs58";
import { useState } from "react";
import { authApi } from "@/api/apis";
import { useAuthVerifySignature } from "@/auth/queries/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/common/components/ui/alert-dialog";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

interface SignInAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignInAlertDialog = ({ open, onOpenChange }: SignInAlertDialogProps) => {
  const { signOut, address, signMessage } = useSolanaWallet();
  const { mutateAsync: verifySignature } = useAuthVerifySignature();
  const [isPending, setIsPending] = useState(false);

  const handleSign = async () => {
    if (!address) return;
    try {
      setIsPending(true);
      const { data: nonce } = await authApi.authControllerClaimNonce({ claimNonceDto: { wallet: address } });
      const signature = await signMessage(nonce.nonce);
      if (!signature) throw new Error("Failed to sign message");
      const signatureBase58 = bs58.encode(signature);
      await verifySignature({ wallet: address, signature: signatureBase58 });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to sign message", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      signOut();
    }
    onOpenChange(isOpen);
  };

  return (
    <AlertDialog onOpenChange={handleClose} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify your wallet</AlertDialogTitle>
          <AlertDialogDescription>
            Sign in to your account to continue. This will allow you to access your account and continue your journey
            with Backyard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={signOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleSign}>
            {isPending ? "Signing..." : "Sign message"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
