import { Trophy, Plus, Search, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminTournamentsPage() {
  const tournaments = [
    {
      name: "Inter-Department Cricket Premier League 2026",
      sport: "Cricket",
      teams: "12 / 12",
      format: "Knockout",
      status: "Upcoming",
      dates: "15 Oct - 22 Oct",
    },
    {
      name: "Monsoon Football Championship",
      sport: "Football",
      teams: "8 / 8",
      format: "Group + Knockout",
      status: "Ongoing",
      dates: "05 Oct - 12 Oct",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tournament Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, configure, and orchestrate athletic tournaments and brackets.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>New Tournament</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Active & Upcoming Tournaments</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tournament..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament Name</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.map((t) => (
                <TableRow key={t.name}>
                  <TableCell className="font-semibold text-foreground">{t.name}</TableCell>
                  <TableCell>{t.sport}</TableCell>
                  <TableCell>{t.format}</TableCell>
                  <TableCell>{t.teams}</TableCell>
                  <TableCell>{t.dates}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "Ongoing" ? "success" : "default"}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
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
