"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getPlayerAnalytics(userId?: string) {
  try {
    const admin = createAdminClient();

    // 1. Get player record
    let playerQuery = admin.from("players").select("*, users(full_name, email)");
    if (userId) {
      playerQuery = playerQuery.eq("user_id", userId);
    }
    const { data: player, error: pErr } = await playerQuery.limit(1).maybeSingle();

    if (!player) {
      return { data: null, error: "Player profile not found" };
    }

    // 2. Get teams player is member of
    const { data: teamMemberships } = await admin
      .from("team_players")
      .select("team_id, teams(*, sports(name, icon))")
      .eq("player_id", player.id);

    const teamIds = teamMemberships?.map((tm) => tm.team_id) || [];
    const myTeams = teamMemberships?.map((tm) => tm.teams).filter(Boolean) || [];

    // 3. Get matches involving player's teams
    let matches: any[] = [];
    if (teamIds.length > 0) {
      const { data: teamMatches } = await admin
        .from("matches")
        .select(
          "*, tournaments(id, name, format), sports(name, icon), team_a:teams!matches_team_a_id_fkey(id, name), team_b:teams!matches_team_b_id_fkey(id, name), venues(name)"
        )
        .or(
          `team_a_id.in.(${teamIds.join(",")}),team_b_id.in.(${teamIds.join(",")})`
        )
        .order("match_date", { ascending: false });

      matches = teamMatches || [];
    }

    // 4. Calculate stats
    const completedMatches = matches.filter((m) => m.status === "completed");
    const upcomingMatches = matches.filter((m) => m.status === "scheduled");

    let wins = 0;
    let losses = 0;
    let draws = 0;

    for (const m of completedMatches) {
      if (!m.winner_id) {
        draws++;
      } else if (teamIds.includes(m.winner_id)) {
        wins++;
      } else {
        losses++;
      }
    }

    const totalGames = completedMatches.length;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    // 5. Get certificates count
    const { count: certCount } = await admin
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("player_id", player.id);

    // 6. Get performance row
    const { data: performance } = await admin
      .from("player_performance")
      .select("*, sports(name)")
      .eq("player_id", player.id);

    return {
      data: {
        player,
        teams: myTeams,
        stats: {
          totalMatches: matches.length,
          completedMatches: totalGames,
          wins,
          losses,
          draws,
          winRate,
          certificatesCount: certCount || 0,
        },
        upcomingMatches,
        completedMatches,
        performance: performance || [],
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to load player analytics" };
  }
}

export async function getAdminAnalytics() {
  try {
    const admin = createAdminClient();

    const [
      { count: totalPlayers },
      { count: totalTeams },
      { count: totalTournaments },
      { count: totalMatches },
      { data: sports },
      { data: tournaments },
      { data: players },
      { data: matches },
    ] = await Promise.all([
      admin.from("players").select("*", { count: "exact", head: true }),
      admin.from("teams").select("*", { count: "exact", head: true }),
      admin.from("tournaments").select("*", { count: "exact", head: true }),
      admin.from("matches").select("*", { count: "exact", head: true }),
      admin.from("sports").select("id, name, icon").eq("is_active", true),
      admin.from("tournaments").select("id, name, sport_id, status"),
      admin.from("players").select("id, department, year"),
      admin.from("matches").select("id, status, match_date"),
    ]);

    // Calculate sport-wise tournament distribution
    const sportDistribution = (sports || []).map((s) => {
      const tourneyCount = (tournaments || []).filter((t) => t.sport_id === s.id).length;
      return {
        name: s.name,
        tournaments: tourneyCount,
        icon: s.icon || "🏅",
      };
    });

    // Calculate department distribution
    const deptMap: Record<string, number> = {};
    (players || []).forEach((p) => {
      const dept = p.department || "Other";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departmentDistribution = Object.entries(deptMap).map(([dept, count]) => ({
      department: dept,
      count,
    }));

    // Calculate match status breakdown
    const matchStatusMap = {
      scheduled: (matches || []).filter((m) => m.status === "scheduled").length,
      live: (matches || []).filter((m) => m.status === "live").length,
      completed: (matches || []).filter((m) => m.status === "completed").length,
      cancelled: (matches || []).filter((m) => m.status === "cancelled").length,
    };

    return {
      data: {
        totals: {
          players: totalPlayers || 0,
          teams: totalTeams || 0,
          tournaments: totalTournaments || 0,
          matches: totalMatches || 0,
        },
        sportDistribution,
        departmentDistribution,
        matchStatusMap,
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to load admin analytics" };
  }
}
