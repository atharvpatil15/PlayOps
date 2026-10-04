import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types/database.types";

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  switch (role) {
    case "admin":
      return <Badge variant="destructive">Admin</Badge>;
    case "player":
      return <Badge variant="default">Player</Badge>;
    case "viewer":
    default:
      return <Badge variant="secondary">Viewer</Badge>;
  }
}
