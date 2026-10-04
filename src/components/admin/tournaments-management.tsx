"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  Search,
  Calendar,
  Users,
  MapPin,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createTournament, deleteTournament, type TournamentInput } from "@/actions/tournaments";

interface Tournament {
  id: string;
  name: string;
  sport_id: string;
  format: "knockout" | "league" | "group+knockout";
  start_date: string;
  end_date: string;
  registration_deadline: string;
  venue_id: string | null;
  max_teams: number;
  entry_fee: number;
  rules: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  sports?: { name: string; icon: string | null } | null;
  venues?: { name: string; location: string } | null;
  tournament_registrations?: Array<{ id: string; status: string }>;
}

interface TournamentsManagementProps {
  initialTournaments: Tournament[];
  sports: Array<{ id: string; name: string; icon: string | null }>;
  venues: Array<{ id: string; name: string }>;
}

export function TournamentsManagement({
  initialTournaments,
  sports,
  venues,
}: TournamentsManagementProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTournament, setDeletingTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<TournamentInput>({
    name: "",
    sport_id: sports[0]?.id || "",
    format: "knockout",
    start_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    registration_deadline: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    venue_id: venues[0]?.id || null,
    max_teams: 8,
    entry_fee: 0,
    rules: "Standard college athletic rules and code of conduct apply.",
  });

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesSport = sportFilter === "all" || t.sport_id === sportFilter;
    return matchesSearch && matchesStatus && matchesSport;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a tournament name.");
      return;
    }
    if (!formData.sport_id) {
      toast.error("Please select a sport.");
      return;
    }

    setLoading(true);
    try {
      const res = await createTournament(formData);
      if (!res.success || !res.data) throw new Error(res.error || "Creation failed");

      const created = {
        ...res.data,
        sports: sports.find((s) => s.id === formData.sport_id) || null,
        venues: venues.find((v) => v.id === formData.venue_id) || null,
        tournament_registrations: [],
      } as Tournament;

      setTournaments((prev) => [created, ...prev]);
      toast.success(`Created tournament: ${formData.name}!`);
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create tournament.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTournament) return;
    setLoading(true);
    try {
      const res = await deleteTournament(deletingTournament.id);
      if (!res.success) throw new Error(res.error || "Delete failed");

      setTournaments((prev) => prev.filter((t) => t.id !== deletingTournament.id));
      toast.success(`Deleted ${deletingTournament.name}`);
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tournament.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tournament Operations & Brackets
          </h1>
          <p className="text-sm text-muted-foreground">
            Create campus championships, review team registrations, and generate automated knockout
            brackets.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>New Tournament</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card pl-9"
          />
        </div>

        <div className="w-full sm:w-44">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.icon || "🏆"} {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            No tournaments found matching your filters. Click &quot;New Tournament&quot; to organize
            one.
          </div>
        ) : (
          filteredTournaments.map((t) => {
            const approvedTeams =
              t.tournament_registrations?.filter((r) => r.status === "approved").length || 0;

            return (
              <Card
                key={t.id}
                className="flex flex-col justify-between shadow-sm transition-colors hover:border-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-2xl">{t.sports?.icon || "🏆"}</span>
                    <Badge
                      variant={
                        t.status === "ongoing"
                          ? "live"
                          : t.status === "completed"
                            ? "secondary"
                            : "default"
                      }
                      className="capitalize"
                    >
                      {t.status}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1 text-lg text-foreground">{t.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-xs">
                    <span>{t.sports?.name}</span>
                    <span>•</span>
                    <span className="capitalize">{t.format}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      {new Date(t.start_date).toLocaleDateString()} –{" "}
                      {new Date(t.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      {approvedTeams} / {t.max_teams} Teams Approved
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="line-clamp-1">{t.venues?.name || "Campus Ground"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                    <Button asChild size="sm" className="w-full gap-1.5">
                      <Link href={`/admin/tournaments/${t.id}`}>
                        <Zap className="h-3.5 w-3.5" />
                        <span>Manage & Fixtures</span>
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeletingTournament(t);
                        setIsDeleteOpen(true);
                      }}
                      className="h-8 w-8 shrink-0 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Tournament Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Organize New Tournament</DialogTitle>
              <DialogDescription>
                Set up championship format, eligibility deadlines, and campus venue allocation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="tName">Tournament Name</Label>
                <Input
                  id="tName"
                  placeholder="e.g. Annual Cricket Trophy 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Sport Discipline</Label>
                  <Select
                    value={formData.sport_id}
                    onValueChange={(val) => setFormData({ ...formData, sport_id: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.icon || "🏆"} {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Format</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(val: any) => setFormData({ ...formData, format: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="knockout">Single Elimination (Knockout)</SelectItem>
                      <SelectItem value="league">Round-Robin (League)</SelectItem>
                      <SelectItem value="group+knockout">Group Stage + Knockout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Reg Deadline</Label>
                  <Input
                    type="date"
                    value={formData.registration_deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, registration_deadline: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Primary Campus Ground</Label>
                  <Select
                    value={formData.venue_id || ""}
                    onValueChange={(val) => setFormData({ ...formData, venue_id: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Max Participating Teams</Label>
                  <Input
                    type="number"
                    min={2}
                    max={64}
                    value={formData.max_teams}
                    onChange={(e) =>
                      setFormData({ ...formData, max_teams: parseInt(e.target.value) || 8 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Tournament Rules & Guidelines</Label>
                <Textarea
                  value={formData.rules || ""}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="Outline match duration, tie-breaker criteria, and disciplinary actions..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Tournament
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Tournament</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{deletingTournament?.name}</strong>? All fixtures
              and registrations will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
