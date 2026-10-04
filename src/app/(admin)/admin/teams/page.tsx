import { Users, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminTeamsPage() {
  const teams = [
    { name: "Computer Strikers", sport: "Cricket", captain: "Atharva Joshi", dept: "Computer Engg", players: 15, status: "Approved" },
    { name: "Mech Warriors", sport: "Cricket", captain: "Sanket Shinde", dept: "Mechanical Engg", players: 14, status: "Approved" },
    { name: "IT Tigers FC", sport: "Football", captain: "Rohan Patel", dept: "Information Tech", players: 18, status: "Approved" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Team & Squad Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Approve team registrations, check student eligibility, and review rosters.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Register Team</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Registered Squads</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search squads or captains..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Squad Name</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Roster Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((t) => (
                <TableRow key={t.name}>
                  <TableCell className="font-semibold text-foreground">{t.name}</TableCell>
                  <TableCell>{t.sport}</TableCell>
                  <TableCell>{t.dept}</TableCell>
                  <TableCell>{t.captain}</TableCell>
                  <TableCell>{t.players} Players</TableCell>
                  <TableCell>
                    <Badge variant="success">{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Inspect Roster</Button>
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
