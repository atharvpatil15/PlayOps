import { getVenues } from "@/actions/venues";
import { VenuesManagement } from "@/components/admin/venues-management";

export const revalidate = 0;

export default async function AdminVenuesPage() {
  const { data: venues, error } = await getVenues();

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 text-sm">
          Warning: Could not fetch live venues: {error}
        </div>
      )}
      <VenuesManagement initialVenues={(venues as any) || []} />
    </div>
  );
}
