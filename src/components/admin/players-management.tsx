"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Search,
  QrCode,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getPlayerByQR, updatePlayerProfile } from "@/actions/players";

const DEPARTMENTS = [
  "All Departments",
  "Computer Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Telecommunication",
  "Electrical Engineering",
  "Chemical Engineering",
];

interface Player {
  id: string;
  registration_number: string;
  department: string;
  year: string;
  date_of_birth: string;
  blood_group: string | null;
  height: number | null;
  weight: number | null;
  sports_interested: string[] | null;
  emergency_contact: string;
  medical_info: string | null;
  qr_code: string | null;
  is_active: boolean;
  users: {
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
}

interface PlayersManagementProps {
  initialPlayers: Player[];
}

export function PlayersManagement({ initialPlayers }: PlayersManagementProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scannedPlayer, setScannedPlayer] = useState<Player | null>(null);
  const [scanning, setScanning] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      p.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.qr_code?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "All Departments" || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleLookupQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    setScanning(true);
    setScannedPlayer(null);
    try {
      const res = await getPlayerByQR(scanCode);
      if (!res.data) {
        toast.error("No player found with that QR or PRN.");
      } else {
        setScannedPlayer(res.data as unknown as Player);
        toast.success(`Verified: ${(res.data as any).users?.full_name}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Lookup failed.");
    } finally {
      setScanning(false);
    }
  };

  const handleToggleStatus = async (player: Player) => {
    setToggling(true);
    try {
      const newStatus = !player.is_active;
      const res = await updatePlayerProfile(player.id, {
        is_active: newStatus,
      } as any);
      if (!res.success) throw new Error(res.error || "Failed to update status");

      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, is_active: newStatus } : p))
      );
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer({ ...selectedPlayer, is_active: newStatus });
      }
      toast.success(`Player marked as ${newStatus ? "Eligible" : "Suspended / Inactive"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle status.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Player Directory & Verification
          </h1>
          <p className="text-sm text-muted-foreground">
            Search registered student athletes, inspect digital QR passes, and verify tournament
            eligibility.
          </p>
        </div>
        <Button onClick={() => setIsScanOpen(true)} className="gap-2">
          <QrCode className="h-4 w-4" />
          <span>Scan / Verify Pass</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name, PRN, or QR code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card pl-9"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <span>Registered Athletes ({filteredPlayers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Athlete</TableHead>
                  <TableHead>PRN Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Registered Sports</TableHead>
                  <TableHead>Digital ID</TableHead>
                  <TableHead>Eligibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No athletes found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        <div>{player.users?.full_name}</div>
                        <div className="text-xs text-muted-foreground">{player.users?.email}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">
                        {player.registration_number}
                      </TableCell>
                      <TableCell>{player.department}</TableCell>
                      <TableCell>{player.year}</TableCell>
                      <TableCell>
                        <div className="flex max-w-[180px] flex-wrap gap-1">
                          {player.sports_interested && player.sports_interested.length > 0 ? (
                            player.sports_interested.slice(0, 2).map((s, i) => (
                              <Badge key={i} variant="outline" className="py-0 text-[10px]">
                                {s}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                          {(player.sports_interested?.length || 0) > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{player.sports_interested!.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-primary">
                        {player.qr_code || `PLAYOPS-${player.registration_number}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={player.is_active ? "success" : "destructive"}>
                          {player.is_active ? "Eligible" : "Suspended"}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPlayer(player);
                            setIsDetailOpen(true);
                          }}
                        >
                          View Pass
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Pass Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedPlayer && (
            <div className="space-y-4">
              <DialogHeader className="pb-2 text-center">
                <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {selectedPlayer.users?.full_name?.slice(0, 2).toUpperCase() || "KK"}
                </div>
                <DialogTitle className="text-lg">{selectedPlayer.users?.full_name}</DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  PRN: {selectedPlayer.registration_number} • {selectedPlayer.department}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border border-border bg-white p-4 text-center shadow-sm">
                <div className="inline-block">
                  <QRCodeSVG
                    value={`${origin}/verify/${selectedPlayer.qr_code || selectedPlayer.registration_number}`}
                    size={130}
                    level="M"
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] font-semibold text-slate-700">
                  {selectedPlayer.qr_code || `PLAYOPS-${selectedPlayer.registration_number}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded border bg-muted/40 p-2">
                  <span className="block text-muted-foreground">Year</span>
                  <span className="font-semibold text-foreground">{selectedPlayer.year}</span>
                </div>
                <div className="rounded border bg-muted/40 p-2">
                  <span className="block text-muted-foreground">Blood Group</span>
                  <span className="font-semibold text-foreground">
                    {selectedPlayer.blood_group || "N/A"}
                  </span>
                </div>
                <div className="col-span-2 rounded border bg-muted/40 p-2">
                  <span className="block text-muted-foreground">Emergency Contact</span>
                  <span className="font-mono text-foreground">
                    {selectedPlayer.emergency_contact}
                  </span>
                </div>
              </div>

              <DialogFooter className="flex-col gap-2 pt-2 sm:flex-row">
                <Button
                  variant={selectedPlayer.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleStatus(selectedPlayer)}
                  disabled={toggling}
                  className="w-full sm:w-auto"
                >
                  {selectedPlayer.is_active ? "Suspend Athlete" : "Reinstate Athlete"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Scanner / Lookup Dialog */}
      <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <span>Verify Athlete Pass</span>
            </DialogTitle>
            <DialogDescription>
              Scan with handheld scanner or enter PRN / QR code for instant lookup.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLookupQR} className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter PRN (e.g. 202301048821) or QR code"
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                autoFocus
                required
              />
              <Button type="submit" disabled={scanning}>
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
            </div>
          </form>

          {scannedPlayer && (
            <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground">{scannedPlayer.users?.full_name}</h4>
                  <p className="font-mono text-xs text-muted-foreground">
                    PRN: {scannedPlayer.registration_number}
                  </p>
                </div>
                <Badge variant={scannedPlayer.is_active ? "success" : "destructive"}>
                  {scannedPlayer.is_active ? "✓ Eligible" : "✗ Suspended"}
                </Badge>
              </div>

              <div className="space-y-1 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Dept:</strong> {scannedPlayer.department} (
                  {scannedPlayer.year})
                </p>
                <p>
                  <strong className="text-foreground">Emergency:</strong>{" "}
                  {scannedPlayer.emergency_contact}
                </p>
                {scannedPlayer.medical_info && (
                  <p className="text-amber-500">
                    <strong>Medical:</strong> {scannedPlayer.medical_info}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScanOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
