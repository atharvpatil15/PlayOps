import Link from "next/link";
import { Users, Shield, Plus, Crown, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentPlayerProfile } from "@/actions/players";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 0;

export default async function PlayerTeamPage() {
  const { data: player } = await getCurrentPlayerProfile();
  const admin = createAdminClient();

  let teamData: any = null;
  let squadMembers: any[] = [];

  if (player?.id) {
    const { data: memberShip } = await admin
      .from("team_players")
      .select(
        "team_id, jersey_number, position, teams(*, sports(name, icon, max_players_per_team), captain:players!teams_captain_id_fkey(registration_number, users(full_name)))"
      )
      .eq("player_id", player.id)
      .limit(1)
      .maybeSingle();

    if (memberShip?.teams) {
      teamData = memberShip.teams;
      const { data: members } = await admin
        .from("team_players")
        .select("*, player:players(*, users(full_name, email))")
        .eq("team_id", memberShip.team_id)
        .order("jersey_number", { ascending: true, nullsFirst: false });
      squadMembers = members || [];
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Team Squad
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your registered team members, jerseys, and tournament lineups.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/tournaments">
            <Trophy className="h-4 w-4" />
            <span>Browse Tournaments</span>
          </Link>
        </Button>
      </div>

      {teamData ? (
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <span className="text-2xl">{teamData.sports?.icon || "🏆"}</span>
                  <span>{teamData.name}</span>
                </CardTitle>
                <CardDescription className="mt-1 text-xs">
                  {teamData.sports?.name} Squad • Max Roster:{" "}
                  {teamData.sports?.max_players_per_team} Athletes
                </CardDescription>
              </div>
              <Badge variant="success">
                Active Squad ({squadMembers.length}/{teamData.sports?.max_players_per_team})
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {squadMembers.map((member) => {
                const isCaptain = teamData.captain_id === member.player_id;
                const isSelf = member.player_id === player?.id;

                return (
                  <div key={member.id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                        {member.jersey_number ? `#${member.jersey_number}` : "—"}
                      </span>
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <span>
                            {member.player?.users?.full_name}{" "}
                            {isSelf && (
                              <span className="text-xs font-normal text-primary">(You)</span>
                            )}
                          </span>
                          {isCaptain && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.position || (isCaptain ? "Captain" : "Player")} • PRN:{" "}
                          <span className="font-mono">{member.player?.registration_number}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant={isCaptain ? "default" : "outline"} className="text-[11px]">
                      {isCaptain ? "Captain" : "Squad Member"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-4">
            <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-bold text-foreground">No Squad Assigned Yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                You are not registered in any team squad yet. Reach out to your department sports
                coordinator or admin to be added to an official team roster.
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/player/profile">
                <span>View My Athlete ID Pass</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
