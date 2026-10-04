"use client";

import { useState, useEffect } from "react";
import {
  Radio,
  Plus,
  Minus,
  CheckCircle,
  Flag,
  AlertCircle,
  Loader2,
  X,
  Trophy,
  History,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  updateLiveScore,
  addMatchEvent,
  endMatch,
  getMatchDetails,
} from "@/actions/matches";

interface LiveScoreConsoleProps {
  match: any;
  onClose: () => void;
}

export function LiveScoreConsole({ match, onClose }: LiveScoreConsoleProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Score state
  const [scoreA, setScoreA] = useState(match.score_team_a || "0");
  const [scoreB, setScoreB] = useState(match.score_team_b || "0");
  const [updatingScore, setUpdatingScore] = useState(false);

  // Event logging state
  const [eventType, setEventType] = useState<any>("goal");
  const [eventTeamId, setEventTeamId] = useState(match.team_a_id);
  const [eventPlayerId, setEventPlayerId] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [loggingEvent, setLoggingEvent] = useState(false);

  // End match state
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [winnerId, setWinnerId] = useState<string>("draw");
  const [endingMatch, setEndingMatch] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getMatchDetails(match.id);
      if (res.data) {
        setDetails(res.data);
        setScoreA(res.data.score_team_a || "0");
        setScoreB(res.data.score_team_b || "0");
      }
      setLoading(false);
    }
    load();
  }, [match.id]);

  const handleUpdateScore = async (newA: string, newB: string) => {
    setScoreA(newA);
    setScoreB(newB);
    setUpdatingScore(true);
    try {
      const res = await updateLiveScore(match.id, newA, newB);
      if (!res.success) throw new Error(res.error || "Update failed");
      toast.success("Live score broadcasted!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update score.");
    } finally {
      setUpdatingScore(false);
    }
  };

  const handleAdjustScore = (team: "a" | "b", delta: number) => {
    if (team === "a") {
      const current = parseInt(scoreA) || 0;
      const next = Math.max(0, current + delta).toString();
      handleUpdateScore(next, scoreB);
    } else {
      const current = parseInt(scoreB) || 0;
      const next = Math.max(0, current + delta).toString();
      handleUpdateScore(scoreA, next);
    }
  };

  const handleLogEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingEvent(true);
    try {
      const res = await addMatchEvent({
        match_id: match.id,
        event_type: eventType,
        team_id: eventTeamId,
        player_id: eventPlayerId || null,
        description: eventDesc.trim() || undefined,
      });

      if (!res.success) throw new Error(res.error || "Failed to log event");

      // Reload match details for updated event log
      const refreshed = await getMatchDetails(match.id);
      if (refreshed.data) {
        setDetails(refreshed.data);
      }

      toast.success(`Logged ${eventType.toUpperCase()} event!`);
      setEventDesc("");
      setEventPlayerId("");
    } catch (err: any) {
      toast.error(err.message || "Could not log event.");
    } finally {
      setLoggingEvent(false);
    }
  };

  const handleFinalizeMatch = async () => {
    setEndingMatch(true);
    try {
      const chosenWinner = winnerId === "draw" ? null : winnerId;
      const res = await endMatch(match.id, chosenWinner, scoreA, scoreB);
      if (!res.success) throw new Error(res.error || "Failed to finalize match");

      toast.success("Match marked as COMPLETED and official results recorded!");
      setIsEndOpen(false);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    } finally {
      setEndingMatch(false);
    }
  };

  const currentTeamPlayers =
    eventTeamId === match.team_a_id
      ? details?.team_a_players || []
      : details?.team_b_players || [];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <DialogTitle className="text-lg">Live Scorekeeper Console</DialogTitle>
            </div>
            <Badge variant="live" className="text-xs">
              M#{match.match_number} In-Play
            </Badge>
          </div>
          <DialogDescription className="text-xs">
            {match.tournaments?.name} • Ground: {match.venues?.name || "Campus Arena"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground mt-2">Loading match console...</p>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Scoreboard Widget */}
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Team A */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                <span className="font-bold text-sm text-foreground block line-clamp-1">
                  {match.team_a?.name || "Team A"}
                </span>
                <div className="font-mono text-5xl font-extrabold text-foreground">
                  {scoreA}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handleAdjustScore("a", -1)}
                    disabled={updatingScore}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3 gap-1 text-xs"
                    onClick={() => handleAdjustScore("a", 1)}
                    disabled={updatingScore}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+1</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2.5 text-xs font-mono"
                    onClick={() => handleAdjustScore("a", 4)}
                    disabled={updatingScore}
                  >
                    +4
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2.5 text-xs font-mono"
                    onClick={() => handleAdjustScore("a", 6)}
                    disabled={updatingScore}
                  >
                    +6
                  </Button>
                </div>
              </div>

              {/* Team B */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                <span className="font-bold text-sm text-foreground block line-clamp-1">
                  {match.team_b?.name || "Team B"}
                </span>
                <div className="font-mono text-5xl font-extrabold text-foreground">
                  {scoreB}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handleAdjustScore("b", -1)}
                    disabled={updatingScore}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3 gap-1 text-xs"
                    onClick={() => handleAdjustScore("b", 1)}
                    disabled={updatingScore}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+1</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2.5 text-xs font-mono"
                    onClick={() => handleAdjustScore("b", 4)}
                    disabled={updatingScore}
                  >
                    +4
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2.5 text-xs font-mono"
                    onClick={() => handleAdjustScore("b", 6)}
                    disabled={updatingScore}
                  >
                    +6
                  </Button>
                </div>
              </div>
            </div>

            {/* Match Event Logger Form */}
            <form
              onSubmit={handleLogEvent}
              className="p-4 rounded-xl bg-muted/40 border border-border space-y-3"
            >
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Record Match Event
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <Select
                  value={eventType}
                  onValueChange={(val: any) => setEventType(val)}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goal">⚽ Goal</SelectItem>
                    <SelectItem value="wicket">🏏 Wicket</SelectItem>
                    <SelectItem value="run">🏃 Run Out</SelectItem>
                    <SelectItem value="point">🏀 Point</SelectItem>
                    <SelectItem value="yellow_card">🟨 Yellow Card</SelectItem>
                    <SelectItem value="red_card">🟥 Red Card</SelectItem>
                    <SelectItem value="foul">⚠️ Foul</SelectItem>
                    <SelectItem value="substitution">🔄 Substitution</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={eventTeamId}
                  onValueChange={(val) => {
                    setEventTeamId(val);
                    setEventPlayerId("");
                  }}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={match.team_a_id}>
                      {match.team_a?.name || "Team A"}
                    </SelectItem>
                    <SelectItem value={match.team_b_id}>
                      {match.team_b?.name || "Team B"}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={eventPlayerId}
                  onValueChange={setEventPlayerId}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Athlete involved" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentTeamPlayers.map((tp: any) => (
                      <SelectItem key={tp.player_id} value={tp.player_id}>
                        {tp.player?.users?.full_name} ({tp.jersey_number ? `#${tp.jersey_number}` : "No jersey"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Notes (e.g. 42nd min, header)"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="bg-card"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={loggingEvent}
                className="gap-1.5 w-full sm:w-auto text-xs"
              >
                {loggingEvent ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>Log Event</span>
              </Button>
            </form>

            {/* Event Log Timeline */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Live Timeline Log ({details?.events?.length || 0} Events)
              </span>

              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-lg border border-border bg-card">
                {details?.events?.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No match events recorded yet.
                  </p>
                ) : (
                  details?.events?.map((ev: any) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between text-xs p-2 rounded bg-muted/40 border border-border/50"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize text-[10px]">
                          {ev.event_type.replace(/_/g, " ")}
                        </Badge>
                        <span className="font-semibold text-foreground">
                          {ev.teams?.name}
                        </span>
                        {ev.player?.users?.full_name && (
                          <span className="text-muted-foreground">
                            • {ev.player.users.full_name}
                          </span>
                        )}
                        {ev.description && (
                          <span className="text-muted-foreground italic">
                            ({ev.description})
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {ev.event_time || "Now"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2 border-t border-border pt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsEndOpen(true)}
            className="w-full sm:w-auto"
          >
            End Match & Finalize Result
          </Button>
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Close Console
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* End Match Confirmation Modal */}
      <Dialog open={isEndOpen} onOpenChange={setIsEndOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalize Match Result</DialogTitle>
            <DialogDescription>
              Confirm winner and final score. Points table will be recalculated automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-muted text-center text-sm font-semibold">
              Final Score: {scoreA} – {scoreB}
            </div>

            <div className="space-y-1">
              <Label>Declared Winner</Label>
              <Select value={winnerId} onValueChange={setWinnerId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draw">Match Tied / Draw</SelectItem>
                  <SelectItem value={match.team_a_id}>
                    {match.team_a?.name || "Team A"} Won
                  </SelectItem>
                  <SelectItem value={match.team_b_id}>
                    {match.team_b?.name || "Team B"} Won
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEndOpen(false)}
              disabled={endingMatch}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleFinalizeMatch}
              disabled={endingMatch}
            >
              {endingMatch && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm & Save Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
