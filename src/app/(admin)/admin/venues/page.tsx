import { MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminVenuesPage() {
  const venues = [
    { name: "Main Cricket Ground", location: "Behind Main Building", type: "Outdoor", capacity: 500, facilities: "Changing Rooms, Scoreboard", available: true },
    { name: "Football Field North", location: "Sports Complex North", type: "Outdoor", capacity: 300, facilities: "Floodlights, First Aid", available: true },
    { name: "Basketball Court", location: "Sports Complex Central", type: "Outdoor", capacity: 200, facilities: "Floodlights, Electronic Clock", available: true },
    { name: "Indoor Sports Complex", location: "Sports Complex Bldg A", type: "Indoor", capacity: 150, facilities: "AC, Wooden Court, TT Tables", available: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Campus Sports Venues & Facilities
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage sports grounds, indoor arenas, floodlight schedules, and venue availability.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Venue</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Campus Facilities ({venues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ground / Court Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((v) => (
                <TableRow key={v.name}>
                  <TableCell className="font-semibold text-foreground">{v.name}</TableCell>
                  <TableCell>{v.location}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>{v.capacity} spectators</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.facilities}</TableCell>
                  <TableCell>
                    <Badge variant="success">Available</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
