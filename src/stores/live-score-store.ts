import { create } from "zustand";

interface LiveMatchUpdate {
  matchId: string;
  scoreTeamA: string;
  scoreTeamB: string;
  status: string;
  currentEvent?: string;
  timestamp: string;
}

interface LiveScoreState {
  liveMatches: Record<string, LiveMatchUpdate>;
  updateScore: (update: LiveMatchUpdate) => void;
  removeMatch: (matchId: string) => void;
}

export const useLiveScoreStore = create<LiveScoreState>((set) => ({
  liveMatches: {},
  updateScore: (update) =>
    set((state) => ({
      liveMatches: {
        ...state.liveMatches,
        [update.matchId]: update,
      },
    })),
  removeMatch: (matchId) =>
    set((state) => {
      const updated = { ...state.liveMatches };
      delete updated[matchId];
      return { liveMatches: updated };
    }),
}));
