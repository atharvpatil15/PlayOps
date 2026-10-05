"use client";

import { useState } from "react";
import { Award, Plus, Printer, Users, Eye, Search, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CertificateCard, type CertificateData } from "@/components/shared/certificate-card";
import {
  issueCertificate,
  bulkIssueParticipationCertificates,
  type IssueCertificateInput,
} from "@/actions/certificates";
import { isGroupSport } from "@/lib/utils/helpers";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

export interface TournamentItem {
  id: string;
  name: string;
  sport_id?: string;
  sports?: {
    id?: string;
    name: string;
    min_players_per_team?: number;
    max_players_per_team?: number;
    type?: string;
  } | null;
}

export interface PlayerItem {
  id: string;
  registration_number: string;
  department?: string;
  users: { full_name: string; email?: string } | null;
}

export interface TeamMembershipItem {
  player_id: string;
  tournament_id: string;
  team_name: string;
}

interface CertificatesManagementProps {
  initialCertificates: CertificateData[];
  tournaments: TournamentItem[];
  players: PlayerItem[];
  teamMemberships?: TeamMembershipItem[];
}

export function CertificatesManagement({
  initialCertificates,
  tournaments,
  players,
  teamMemberships = [],
}: CertificatesManagementProps) {
  const [certificates, setCertificates] = useState<CertificateData[]>(initialCertificates);
  const [search, setSearch] = useState("");
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<IssueCertificateInput>({
    player_id: players[0]?.id || "",
    tournament_id: tournaments[0]?.id || "",
    type: "winner",
  });
  const [bulkTournamentId, setBulkTournamentId] = useState(tournaments[0]?.id || "");

  const currentTournament = tournaments.find((t) => t.id === formData.tournament_id);
  const isGroupGame = isGroupSport(currentTournament?.sports);

  // Check if selected player is part of a team in this tournament
  const playerTeam = teamMemberships.find(
    (tm) => tm.player_id === formData.player_id && tm.tournament_id === formData.tournament_id
  );

  // Group games strictly require team membership
  const canIssue = !isGroupGame || !!playerTeam;

  const handleTournamentChange = (tourneyId: string) => {
    const tourney = tournaments.find((t) => t.id === tourneyId);
    const isGroup = isGroupSport(tourney?.sports);
    let newPlayerId = formData.player_id;

    if (isGroup && teamMemberships.length > 0) {
      const eligible = teamMemberships.filter((tm) => tm.tournament_id === tourneyId);
      if (eligible.length > 0 && !eligible.some((e) => e.player_id === formData.player_id)) {
        newPlayerId = eligible[0].player_id;
      }
    }
    setFormData({ ...formData, tournament_id: tourneyId, player_id: newPlayerId });
  };

  const handleIssueSingle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGroupGame && !playerTeam) {
      toast.error(
        `Cannot issue certificate: Selected athlete is not part of any team in this group sport (${currentTournament?.sports?.name || "Team Game"}).`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await issueCertificate(formData);
      if (!res.success || !res.data) throw new Error(res.error || "Failed to issue certificate");

      const player = players.find((p) => p.id === formData.player_id);
      const tournament = tournaments.find((t) => t.id === formData.tournament_id);

      const newCert: CertificateData = {
        ...res.data,
        players: res.data.players || (player
          ? {
              registration_number: player.registration_number,
              department: player.department || "",
              users: player.users,
            }
          : null),
        tournaments: res.data.tournaments || (tournament
          ? {
              name: tournament.name,
              start_date: "",
              end_date: "",
              sports: tournament.sports ? { name: tournament.sports.name } : null,
            }
          : null),
        metadata: res.data.metadata || {
          sport_name: tournament?.sports?.name,
          department: player?.department,
          team_name: playerTeam?.team_name,
        },
      };

      setCertificates((prev) => [newCert, ...prev]);
      toast.success("Sports certificate successfully issued!");
      setIsIssueOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to issue certificate.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkIssue = async () => {
    if (!bulkTournamentId) return;
    setLoading(true);
    try {
      const res = await bulkIssueParticipationCertificates(bulkTournamentId);
      if (!res.success) throw new Error(res.error || "Bulk issue failed");

      toast.success(res.message || "Bulk certificates issued!");
      setIsBulkOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to bulk generate certificates.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = certificates.filter((c) => {
    const q = search.toLowerCase();
    const playerName = c.players?.users?.full_name?.toLowerCase() || "";
    const rollNo =
      c.players?.registration_number?.toLowerCase() ||
      c.players?.roll_number?.toLowerCase() ||
      "";
    const tourneyName = c.tournaments?.name?.toLowerCase() || "";
    return playerName.includes(q) || rollNo.includes(q) || tourneyName.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sports Certificate Hub</h2>
          <p className="text-sm text-muted-foreground">
            Generate and verify official achievement &amp; participation certificates for athletes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setIsBulkOpen(true)} className="gap-2">
            <Users className="h-4 w-4" />
            <span>Bulk Issue (All Squads)</span>
          </Button>
          <Button onClick={() => setIsIssueOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Issue Certificate</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student name, registration number, or tournament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="outline" className="hidden sm:inline-flex">
          {filteredCerts.length} Certificates
        </Badge>
      </div>

      {/* Certificates Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="font-bold">Athlete &amp; ID</TableHead>
                <TableHead className="font-bold">Tournament</TableHead>
                <TableHead className="font-bold">Award Category</TableHead>
                <TableHead className="font-bold">Issue Date</TableHead>
                <TableHead className="text-right font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCerts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="font-semibold text-foreground">
                      {c.players?.users?.full_name || "Athlete"}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {c.players?.registration_number || c.players?.roll_number}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {c.tournaments?.name || "Tournament"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        c.type === "winner"
                          ? "success"
                          : c.type === "runner_up"
                            ? "secondary"
                            : "outline"
                      }
                      className="capitalize text-xs"
                    >
                      {c.type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.issued_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewCert(c)}
                      className="h-8 gap-1.5 text-xs text-primary"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview / Print</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No certificates issued yet matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Issue Single Certificate Dialog */}
      <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleIssueSingle} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>Issue Sports Certificate</span>
              </DialogTitle>
              <DialogDescription>
                Award an official college certificate of achievement or participation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="tourney">Select Tournament</Label>
                  {currentTournament?.sports && (
                    <Badge
                      variant={isGroupGame ? "secondary" : "outline"}
                      className={`text-[10px] font-semibold ${
                        isGroupGame
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {isGroupGame ? "👥 Group Game" : "👤 Individual Game"} • {currentTournament.sports.name}
                    </Badge>
                  )}
                </div>
                <Select
                  value={formData.tournament_id}
                  onValueChange={handleTournamentChange}
                >
                  <SelectTrigger id="tourney">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({isGroupSport(t.sports) ? "Group" : "Individual"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="player">Select Athlete</Label>
                <Select
                  value={formData.player_id}
                  onValueChange={(val) => setFormData({ ...formData, player_id: val })}
                >
                  <SelectTrigger id="player">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {players.map((p) => {
                      const tm = teamMemberships.find(
                        (m) => m.player_id === p.id && m.tournament_id === formData.tournament_id
                      );
                      return (
                        <SelectItem key={p.id} value={p.id}>
                          {p.users?.full_name || "Athlete"} ({p.registration_number})
                          {isGroupGame
                            ? tm
                              ? ` — [Team: ${tm.team_name}]`
                              : " — [No Team]"
                            : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Team Membership Eligibility Feedback */}
                {isGroupGame && !playerTeam && (
                  <div className="mt-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Team Membership Required</p>
                      <p className="text-[11px] leading-tight text-muted-foreground mt-0.5">
                        This is a group game ({currentTournament?.sports?.name || "Team Sport"}). Athletes cannot be issued a certificate unless they are an active member of a registered team in this tournament.
                      </p>
                    </div>
                  </div>
                )}

                {isGroupGame && playerTeam && (
                  <div className="mt-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified Squad Member: <strong>{playerTeam.team_name}</strong></span>
                  </div>
                )}

                {!isGroupGame && currentTournament && (
                  <div className="mt-2 rounded-md border border-blue-500/20 bg-blue-500/10 p-2 text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Individual Sport: Eligible for direct individual certification.</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="cert_type">Certificate Distinction</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger id="cert_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="winner">Winner (1st Place)</SelectItem>
                    <SelectItem value="runner_up">Runner-Up (2nd Place)</SelectItem>
                    <SelectItem value="mvp">MVP (Most Valuable Player)</SelectItem>
                    <SelectItem value="best_player">Best Player / Merit</SelectItem>
                    <SelectItem value="participation">Certificate of Participation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsIssueOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !canIssue} className="gap-1.5">
                <Award className="h-4 w-4" />
                <span>{loading ? "Issuing..." : "Issue Certificate"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Issue Dialog */}
      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Bulk Issue Participation Certificates</span>
              </DialogTitle>
              <DialogDescription>
                Automatically generate verifiable participation certificates for all athletes in approved team rosters.
              </DialogDescription>
            </DialogHeader>

            <div>
              <Label htmlFor="bulk_tourney">Select Tournament</Label>
              <Select value={bulkTournamentId} onValueChange={setBulkTournamentId}>
                <SelectTrigger id="bulk_tourney">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBulkOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleBulkIssue} disabled={loading} className="gap-1.5">
                <Award className="h-4 w-4" />
                <span>{loading ? "Generating..." : "Generate for All Rosters"}</span>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Print Preview Modal */}
      <Dialog open={!!previewCert} onOpenChange={(open) => !open && setPreviewCert(null)}>
        <DialogContent className="max-w-5xl max-h-[96vh] overflow-y-auto p-3 sm:p-5 print:p-0 print:border-none print:shadow-none print:max-w-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {previewCert && <CertificateCard certificate={previewCert} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
