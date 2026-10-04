import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role =
    (user?.app_metadata?.role as string) ||
    (user?.user_metadata?.role as string);

  if (role === "admin") {
    redirect(ROUTES.ADMIN_DASHBOARD);
  }

  redirect(ROUTES.PLAYER_DASHBOARD);
}
