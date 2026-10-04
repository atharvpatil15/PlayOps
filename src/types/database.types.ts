export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "admin" | "player" | "viewer";
export type SportType = "indoor" | "outdoor";
export type VenueType = "indoor" | "outdoor" | "multipurpose";
export type TournamentFormat = "knockout" | "league" | "group+knockout";
export type TournamentStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type RegistrationStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "waived";
export type MatchStatus = "scheduled" | "live" | "completed" | "cancelled" | "postponed";
export type MatchRound =
  "group" | "round_of_16" | "quarter_final" | "semi_final" | "third_place" | "final";
export type EventType =
  | "goal"
  | "assist"
  | "wicket"
  | "run"
  | "foul"
  | "yellow_card"
  | "red_card"
  | "timeout"
  | "substitution"
  | "injury"
  | "penalty"
  | "point"
  | "ace"
  | "smash"
  | "other";
export type CertificateType = "winner" | "runner_up" | "mvp" | "best_player" | "participation";
export type NotificationType = "tournament" | "match" | "result" | "registration" | "general";
export type ReportType =
  "tournament_summary" | "player_stats" | "participation" | "financial" | "annual";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash?: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash?: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      players: {
        Row: {
          id: string;
          user_id: string;
          registration_number: string;
          department: string;
          year: string;
          date_of_birth: string;
          blood_group: string | null;
          height: number | null;
          weight: number | null;
          sports_interested: string[];
          emergency_contact: string;
          medical_info: string | null;
          qr_code: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          registration_number: string;
          department: string;
          year: string;
          date_of_birth: string;
          blood_group?: string | null;
          height?: number | null;
          weight?: number | null;
          sports_interested?: string[];
          emergency_contact: string;
          medical_info?: string | null;
          qr_code?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          registration_number?: string;
          department?: string;
          year?: string;
          date_of_birth?: string;
          blood_group?: string | null;
          height?: number | null;
          weight?: number | null;
          sports_interested?: string[];
          emergency_contact?: string;
          medical_info?: string | null;
          qr_code?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "players_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      sports: {
        Row: {
          id: string;
          name: string;
          type: SportType;
          max_players_per_team: number;
          min_players_per_team: number;
          description: string | null;
          icon: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: SportType;
          max_players_per_team: number;
          min_players_per_team: number;
          description?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: SportType;
          max_players_per_team?: number;
          min_players_per_team?: number;
          description?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          name: string;
          sport_id: string;
          tournament_id: string | null;
          captain_id: string | null;
          logo_url: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport_id: string;
          tournament_id?: string | null;
          captain_id?: string | null;
          logo_url?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sport_id?: string;
          tournament_id?: string | null;
          captain_id?: string | null;
          logo_url?: string | null;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      team_players: {
        Row: {
          id: string;
          team_id: string;
          player_id: string;
          jersey_number: number | null;
          position: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          player_id: string;
          jersey_number?: number | null;
          position?: string | null;
          joined_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          player_id?: string;
          jersey_number?: number | null;
          position?: string | null;
          joined_at?: string;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          id: string;
          name: string;
          location: string;
          type: VenueType;
          capacity: number | null;
          facilities: string[];
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          type: VenueType;
          capacity?: number | null;
          facilities?: string[];
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          type?: VenueType;
          capacity?: number | null;
          facilities?: string[];
          is_available?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      tournaments: {
        Row: {
          id: string;
          name: string;
          sport_id: string;
          format: TournamentFormat;
          start_date: string;
          end_date: string;
          registration_deadline: string;
          venue_id: string | null;
          max_teams: number;
          entry_fee: number;
          rules: string | null;
          status: TournamentStatus;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport_id: string;
          format: TournamentFormat;
          start_date: string;
          end_date: string;
          registration_deadline: string;
          venue_id?: string | null;
          max_teams: number;
          entry_fee?: number;
          rules?: string | null;
          status?: TournamentStatus;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sport_id?: string;
          format?: TournamentFormat;
          start_date?: string;
          end_date?: string;
          registration_deadline?: string;
          venue_id?: string | null;
          max_teams?: number;
          entry_fee?: number;
          rules?: string | null;
          status?: TournamentStatus;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tournaments_sport_id_fkey";
            columns: ["sport_id"];
            isOneToOne: false;
            referencedRelation: "sports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tournaments_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      tournament_registrations: {
        Row: {
          id: string;
          tournament_id: string;
          team_id: string;
          registration_date: string;
          status: RegistrationStatus;
          payment_status: PaymentStatus;
          remarks: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          team_id: string;
          registration_date?: string;
          status?: RegistrationStatus;
          payment_status?: PaymentStatus;
          remarks?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          team_id?: string;
          registration_date?: string;
          status?: RegistrationStatus;
          payment_status?: PaymentStatus;
          remarks?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          sport_id: string;
          team_a_id: string;
          team_b_id: string;
          venue_id: string | null;
          match_date: string;
          start_time: string | null;
          end_time: string | null;
          round: MatchRound;
          match_number: number;
          status: MatchStatus;
          winner_id: string | null;
          score_team_a: string | null;
          score_team_b: string | null;
          remarks: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          sport_id: string;
          team_a_id: string;
          team_b_id: string;
          venue_id?: string | null;
          match_date: string;
          start_time?: string | null;
          end_time?: string | null;
          round: MatchRound;
          match_number: number;
          status?: MatchStatus;
          winner_id?: string | null;
          score_team_a?: string | null;
          score_team_b?: string | null;
          remarks?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          sport_id?: string;
          team_a_id?: string;
          team_b_id?: string;
          venue_id?: string | null;
          match_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          round?: MatchRound;
          match_number?: number;
          status?: MatchStatus;
          winner_id?: string | null;
          score_team_a?: string | null;
          score_team_b?: string | null;
          remarks?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_sport_id_fkey";
            columns: ["sport_id"];
            isOneToOne: false;
            referencedRelation: "sports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_team_a_id_fkey";
            columns: ["team_a_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_team_b_id_fkey";
            columns: ["team_b_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      match_events: {
        Row: {
          id: string;
          match_id: string;
          event_type: EventType;
          player_id: string | null;
          team_id: string | null;
          event_time: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          event_type: EventType;
          player_id?: string | null;
          team_id?: string | null;
          event_time?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          event_type?: EventType;
          player_id?: string | null;
          team_id?: string | null;
          event_time?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_events_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_events_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      points_table: {
        Row: {
          id: string;
          tournament_id: string;
          team_id: string;
          matches_played: number;
          wins: number;
          losses: number;
          draws: number;
          points: number;
          net_score_diff: number;
          rank: number | null;
          group_name: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          team_id: string;
          matches_played?: number;
          wins?: number;
          losses?: number;
          draws?: number;
          points?: number;
          net_score_diff?: number;
          rank?: number | null;
          group_name?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          team_id?: string;
          matches_played?: number;
          wins?: number;
          losses?: number;
          draws?: number;
          points?: number;
          net_score_diff?: number;
          rank?: number | null;
          group_name?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "points_table_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "points_table_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      player_performance: {
        Row: {
          id: string;
          player_id: string;
          tournament_id: string;
          sport_id: string;
          matches_played: number;
          goals_scored: number;
          runs_scored: number;
          points_scored: number;
          assists: number;
          wickets_taken: number;
          awards: string[];
          rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          tournament_id: string;
          sport_id: string;
          matches_played?: number;
          goals_scored?: number;
          runs_scored?: number;
          points_scored?: number;
          assists?: number;
          wickets_taken?: number;
          awards?: string[];
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          tournament_id?: string;
          sport_id?: string;
          matches_played?: number;
          goals_scored?: number;
          runs_scored?: number;
          points_scored?: number;
          assists?: number;
          wickets_taken?: number;
          awards?: string[];
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "player_performance_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_performance_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_performance_sport_id_fkey";
            columns: ["sport_id"];
            isOneToOne: false;
            referencedRelation: "sports";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: NotificationType;
          target_role: UserRole | null;
          target_user_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type: NotificationType;
          target_role?: UserRole | null;
          target_user_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: NotificationType;
          target_role?: UserRole | null;
          target_user_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_target_user_id_fkey";
            columns: ["target_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      certificates: {
        Row: {
          id: string;
          player_id: string;
          tournament_id: string;
          type: CertificateType;
          issued_date: string;
          certificate_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          tournament_id: string;
          type: CertificateType;
          issued_date?: string;
          certificate_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          tournament_id?: string;
          type?: CertificateType;
          issued_date?: string;
          certificate_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          id: string;
          type: ReportType;
          tournament_id: string | null;
          generated_by: string;
          file_url: string;
          parameters: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: ReportType;
          tournament_id?: string | null;
          generated_by: string;
          file_url: string;
          parameters?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: ReportType;
          tournament_id?: string | null;
          generated_by?: string;
          file_url?: string;
          parameters?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_generated_by_fkey";
            columns: ["generated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      sport_type: SportType;
      venue_type: VenueType;
      tournament_format: TournamentFormat;
      tournament_status: TournamentStatus;
      registration_status: RegistrationStatus;
      payment_status: PaymentStatus;
      match_status: MatchStatus;
      match_round: MatchRound;
      event_type: EventType;
      certificate_type: CertificateType;
      notification_type: NotificationType;
      report_type: ReportType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
