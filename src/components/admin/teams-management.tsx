"use client";

import { useState } from "react";
import { Users, Plus, Search, Shield, Trash2, UserPlus, Crown, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createTeam,
  deleteTeam,
  getTeamDetails,
  addPlayerToTeam,
  removePlayerFromTeam,
  setTeamCaptain,
  type TeamInput,
} from "@/actions/teams";

interface Sport {
  id: string;
  name: string;
  icon: string | null;
}

interface Player {
  id: string;
  registration_number: string;
  users: {
    full_name: string;
    email: string;
  };
}

interface Team {
  id: string;
  name: string;
  sport_id: string;
  tournament_id: string | null;
  captain_id: string | null;
  sports?: { name: string; icon: string | null } | null;
  captain?: { registration_number: string; users: { full_name: string } } | null;
  team_players?: Array<{ id: string }>;
}

interface TeamsManagementProps {
  initialTeams: Team[];
  sports: Sport[];
  players: Player[];
  tournaments: Array<{ id: string; name: string }>;
}

export function TeamsManagement({
  initialTeams,
  sports,
  players,
  tournaments,
}: TeamsManagementProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Roster inspection modal
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [activeTeamDetails, setActiveTeamDetails] = useState<any>(null);
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Add athlete to squad form
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [jerseyNum, setJerseyNum] = useState<number | "">("");
  const [position, setPosition] = useState("");
  const [addingPlayer, setAddingPlayer] = useState(false);

  // Create team form
  const [formData, setFormData] = useState<TeamInput>({
    name: "",
    sport_id: sports[0]?.id || "",
    captain_id: players[0]?.id || null,
    tournament_id: null,
  });

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.captain?.users?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesSport = selectedSport === "all" || t.sport_id === selectedSport;
    return matchesSearch && matchesSport;
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a squad name.");
      return;
    }
    if (!formData.sport_id) {
      toast.error("Please select a sport.");
      return;
    }

    setLoading(true);
    try {
      const res = await createTeam(formData);
      if (!res.success || !res.data) throw new Error(res.error || "Creation failed");

      const createdTeam: Team = {
        ...res.data,
        sports: sports.find((s) => s.id === formData.sport_id) || null,
        captain: players.find((p) => p.id === formData.captain_id)
          ? {
              registration_number: players.find((p) => p.id === formData.captain_id)!
                .registration_number,
              users: {
                full_name: players.find((p) => p.id === formData.captain_id)!.users.full_name,
              },
            }
          : null,
        team_players: formData.captain_id ? [{ id: "temp" }] : [],
      };

      setTeams((prev) => [createdTeam, ...prev]);
      toast.success(`Created squad: ${formData.name}`);
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  const handleInspectRoster = async (team: Team) => {
    setLoadingRoster(true);
    setIsRosterOpen(true);
    try {
      const res = await getTeamDetails(team.id);
      if (res.data) {
        setActiveTeamDetails(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load roster.");
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !activeTeamDetails) return;

    setAddingPlayer(true);
    try {
      const res = await addPlayerToTeam(
        activeTeamDetails.id,
        selectedPlayerId,
        jerseyNum ? Number(jerseyNum) : undefined,
        position
      );
      if (!res.success) throw new Error(res.error || "Failed to add athlete");

      // Reload squad details
      const refreshed = await getTeamDetails(activeTeamDetails.id);
      setActiveTeamDetails(refreshed.data);
      toast.success("Athlete added to squad!");
      setSelectedPlayerId("");
      setJerseyNum("");
      setPosition("");
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    } finally {
      setAddingPlayer(false);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!activeTeamDetails) return;
    try {
      const res = await removePlayerFromTeam(activeTeamDetails.id, playerId);
      if (!res.success) throw new Error(res.error || "Failed to remove athlete");

      const refreshed = await getTeamDetails(activeTeamDetails.id);
      setActiveTeamDetails(refreshed.data);
      toast.success("Athlete removed from squad.");
    } catch (err: any) {
      toast.error(err.message || "Cannot remove athlete.");
    }
  };

  const handleMakeCaptain = async (playerId: string) => {
    if (!activeTeamDetails) return;
    try {
      const res = await setTeamCaptain(activeTeamDetails.id, playerId);
      if (!res.success) throw new Error(res.error || "Failed to update captain");

      const refreshed = await getTeamDetails(activeTeamDetails.id);
      setActiveTeamDetails(refreshed.data);
      toast.success("Assigned new squad captain!");
    } catch (err: any) {
      toast.error(err.message || "Cannot assign captain.");
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this squad?")) return;
    try {
      const res = await deleteTeam(teamId);
      if (!res.success) throw new Error(res.error || "Delete failed");

      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      toast.success("Squad deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete squad.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wider">
              <Users className="mr-1 h-3 w-3" />
              Athletic Roster Governance • Department Squads
            </Badge>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Team &amp; Squad Management
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Form departmental squads, allocate jersey numbers, assign captains, and review rosters.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="gap-2 font-semibold text-xs shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Register Squad</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search squads or captains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card pl-9"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
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

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Registered Squads ({filteredTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Squad Name</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Captain</TableHead>
                  <TableHead>Roster Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No squads found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeams.map((team) => (
                    <TableRow key={team.id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold text-foreground">{team.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <span>{team.sports?.icon || "🏆"}</span>
                          <span>{team.sports?.name}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {team.captain ? (
                          <div className="text-xs">
                            <span className="font-medium text-foreground">
                              {team.captain.users?.full_name}
                            </span>
                            <span className="block font-mono text-muted-foreground">
                              ({team.captain.registration_number})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.team_players?.length || 0} Players</Badge>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInspectRoster(team)}
                        >
                          Manage Roster
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Register Squad Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateTeam}>
            <DialogHeader>
              <DialogTitle>Register New Squad</DialogTitle>
              <DialogDescription>
                Define squad identity, select sport, and assign team captain.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="squadName">Squad / Team Name</Label>
                <Input
                  id="squadName"
                  placeholder="e.g. Computer Strikers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

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
                <Label>Team Captain (Student Athlete)</Label>
                <Select
                  value={formData.captain_id || ""}
                  onValueChange={(val) => setFormData({ ...formData, captain_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign captain" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.users?.full_name} ({p.registration_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {tournaments.length > 0 && (
                <div className="space-y-1">
                  <Label>Register for Tournament (Optional)</Label>
                  <Select
                    value={formData.tournament_id || "none"}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        tournament_id: val === "none" ? null : val,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No immediate tournament</SelectItem>
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Squad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Roster Dialog */}
      <Dialog open={isRosterOpen} onOpenChange={setIsRosterOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {loadingRoster ? (
            <div className="py-16 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading squad roster...</p>
            </div>
          ) : activeTeamDetails ? (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeTeamDetails.sports?.icon || "🏆"}</span>
                  <div>
                    <DialogTitle>{activeTeamDetails.name}</DialogTitle>
                    <DialogDescription className="text-xs">
                      {activeTeamDetails.sports?.name} • Roster limit:{" "}
                      {activeTeamDetails.sports?.min_players_per_team} –{" "}
                      {activeTeamDetails.sports?.max_players_per_team} players
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Add Athlete Form */}
              <form
                onSubmit={handleAddPlayer}
                className="space-y-3 rounded-lg border border-border bg-muted/40 p-4"
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
                  Add Student Athlete to Squad
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select athlete" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.users?.full_name} ({p.registration_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Jersey No (1-99)"
                    type="number"
                    min={1}
                    max={99}
                    value={jerseyNum}
                    onChange={(e) =>
                      setJerseyNum(e.target.value === "" ? "" : parseInt(e.target.value))
                    }
                    className="bg-card"
                  />

                  <Input
                    placeholder="Position (e.g. Striker)"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="bg-card"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!selectedPlayerId || addingPlayer}
                  className="w-full gap-1.5 sm:w-auto"
                >
                  {addingPlayer ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  <span>Add to Roster</span>
                </Button>
              </form>

              {/* Roster List */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Squad Members ({activeTeamDetails.players?.length || 0})
                </span>

                <div className="overflow-hidden rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Jersey</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>PRN</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTeamDetails.players?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No athletes added to this squad yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activeTeamDetails.players?.map((tp: any) => {
                          const isCaptain = activeTeamDetails.captain_id === tp.player_id;

                          return (
                            <TableRow key={tp.id}>
                              <TableCell className="font-mono font-bold text-foreground">
                                {tp.jersey_number ? `#${tp.jersey_number}` : "—"}
                              </TableCell>
                              <TableCell className="font-semibold text-foreground">
                                <div className="flex items-center gap-1.5">
                                  <span>{tp.player?.users?.full_name}</span>
                                  {isCaptain && (
                                    <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {tp.player?.registration_number}
                              </TableCell>
                              <TableCell className="text-xs">{tp.position || "Player"}</TableCell>
                              <TableCell className="space-x-1 text-right">
                                {!isCaptain && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-amber-600 hover:text-amber-700"
                                    onClick={() => handleMakeCaptain(tp.player_id)}
                                  >
                                    Set Captain
                                  </Button>
                                )}
                                {!isCaptain && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                    onClick={() => handleRemovePlayer(tp.player_id)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRosterOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
