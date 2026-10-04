import { Shield, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SUPPORTED_SPORTS } from "@/lib/constants/sport";

export default function AdminSportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sports Master Catalog
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure rules, roster thresholds, and venue requirements for college sports.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New Sport</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Configured Sports ({SUPPORTED_SPORTS.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Sport Name</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Min Players</TableHead>
                <TableHead>Max Roster</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUPPORTED_SPORTS.map((sport) => (
                <TableRow key={sport.name}>
                  <TableCell className="text-2xl">{sport.icon}</TableCell>
                  <TableCell className="font-semibold text-foreground">{sport.name}</TableCell>
                  <TableCell className="capitalize">{sport.type}</TableCell>
                  <TableCell>{sport.minPlayers}</TableCell>
                  <TableCell>{sport.maxPlayers}</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit Rules</Button>
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
