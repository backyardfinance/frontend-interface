import { Navigate } from "react-router";
import { APP_ROUTES } from "@/config/routes";

export default function IndexPage() {
  return <Navigate replace to={APP_ROUTES.VAULTS} />;
}
