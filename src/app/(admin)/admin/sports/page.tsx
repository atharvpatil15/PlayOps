import { getSports } from "@/actions/sports";
import { SportsManagement } from "@/components/admin/sports-management";

export const revalidate = 0;

export default async function AdminSportsPage() {
  const { data: sports, error } = await getSports();

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 text-sm">
          Warning: Could not fetch live sports: {error}
        </div>
      )}
      <SportsManagement initialSports={(sports as any) || []} />
    </div>
  );
}
