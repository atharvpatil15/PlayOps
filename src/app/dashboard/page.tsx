import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default function DashboardRedirect() {
  redirect(ROUTES.PLAYER_DASHBOARD);
}
