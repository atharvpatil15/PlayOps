import { User, QrCode, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminPlayersPage() {
  const players = [
    { name: "Atharva Joshi", prn: "202301048821", dept: "Computer Engg", year: "TE", sports: "Cricket, Badminton", qr: "PLAYOPS-7F3A29B", active: true },
    { name: "Rohan Patil", prn: "202301048822", dept: "Computer Engg", year: "TE", sports: "Cricket", qr: "PLAYOPS-8A4C11D", active: true },
    { name: "Neha Deshmukh", prn: "202401021104", dept: "IT Engg", year: "SE", sports: "Badminton, Chess", qr: "PLAYOPS-9C2E33F", active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Player Directory & Verification
          </h1>
          <p className="text-sm text-muted-foreground">
            Search registered college athletes, inspect QR identity codes, and verify eligibility.
          </p>
        </div>
        <Button className="gap-2">
          <QrCode className="h-4 w-4" />
          <span>Launch QR Scanner</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Registered Athletes</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by PRN or Name..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>PRN Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Sports</TableHead>
                <TableHead>Smart QR Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((p) => (
                <TableRow key={p.prn}>
                  <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.prn}</TableCell>
                  <TableCell>{p.dept}</TableCell>
                  <TableCell>{p.year}</TableCell>
                  <TableCell>{p.sports}</TableCell>
                  <TableCell className="font-mono text-xs text-primary">{p.qr}</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Card</Button>
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
