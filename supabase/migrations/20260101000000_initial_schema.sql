-- ==============================================================================
-- PlayOps — KK Wagh Sports Portal Database Schema Migration
-- Version: 1.0 (PostgreSQL 15+ / Supabase)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
CREATE TYPE user_role AS ENUM ('admin', 'player', 'viewer');
CREATE TYPE sport_type AS ENUM ('indoor', 'outdoor');
CREATE TYPE venue_type AS ENUM ('indoor', 'outdoor', 'multipurpose');
CREATE TYPE tournament_format AS ENUM ('knockout', 'league', 'group+knockout');
CREATE TYPE tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded', 'waived');
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled', 'postponed');
CREATE TYPE match_round AS ENUM ('group', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final');
CREATE TYPE event_type AS ENUM (
    'goal', 'assist', 'wicket', 'run', 'foul', 'yellow_card',
    'red_card', 'timeout', 'substitution', 'injury', 'penalty',
    'point', 'ace', 'smash', 'other'
);
CREATE TYPE certificate_type AS ENUM ('winner', 'runner_up', 'mvp', 'best_player', 'participation');
CREATE TYPE notification_type AS ENUM ('tournament', 'match', 'result', 'registration', 'general');
CREATE TYPE report_type AS ENUM ('tournament_summary', 'player_stats', 'participation', 'financial', 'annual');

-- 3. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TABLE DEFINITIONS

-- 4.1 users
CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         varchar(255) NOT NULL UNIQUE,
    password_hash varchar(255),
    full_name     varchar(150) NOT NULL,
    role          user_role NOT NULL DEFAULT 'viewer',
    avatar_url    text,
    phone         varchar(15),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.2 players
CREATE TABLE players (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    registration_number varchar(30) NOT NULL UNIQUE,
    department          varchar(100) NOT NULL,
    year                varchar(20) NOT NULL,
    date_of_birth       date NOT NULL,
    blood_group         varchar(5),
    height              decimal(5,2),
    weight              decimal(5,2),
    sports_interested   text[] DEFAULT '{}',
    emergency_contact   varchar(15) NOT NULL,
    medical_info        text,
    qr_code             text UNIQUE,
    is_active           boolean NOT NULL DEFAULT true,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.3 sports
CREATE TABLE sports (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(100) NOT NULL UNIQUE,
    type                 sport_type NOT NULL,
    max_players_per_team integer NOT NULL CHECK (max_players_per_team > 0),
    min_players_per_team integer NOT NULL CHECK (min_players_per_team > 0),
    description          text,
    icon                 varchar(100),
    is_active            boolean NOT NULL DEFAULT true,
    created_at           timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_player_limits CHECK (min_players_per_team <= max_players_per_team)
);

-- 4.4 venues
CREATE TABLE venues (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name         varchar(150) NOT NULL UNIQUE,
    location     text NOT NULL,
    type         venue_type NOT NULL,
    capacity     integer CHECK (capacity > 0),
    facilities   text[] DEFAULT '{}',
    is_available boolean NOT NULL DEFAULT true,
    created_at   timestamptz NOT NULL DEFAULT now()
);

-- 4.5 tournaments
CREATE TABLE tournaments (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                  varchar(200) NOT NULL,
    sport_id              uuid NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    format                tournament_format NOT NULL,
    start_date            date NOT NULL,
    end_date              date NOT NULL,
    registration_deadline timestamptz NOT NULL,
    venue_id              uuid REFERENCES venues(id) ON DELETE SET NULL,
    max_teams             integer NOT NULL CHECK (max_teams >= 2),
    entry_fee             decimal(10,2) DEFAULT 0.00,
    rules                 text,
    status                tournament_status NOT NULL DEFAULT 'upcoming',
    created_by            uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_tournament_dates CHECK (end_date >= start_date)
);

CREATE TRIGGER set_tournaments_updated_at
    BEFORE UPDATE ON tournaments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.6 teams
CREATE TABLE teams (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name          varchar(100) NOT NULL,
    sport_id      uuid NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
    captain_id    uuid REFERENCES players(id) ON DELETE SET NULL,
    logo_url      text,
    created_by    uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_team_name_per_tournament UNIQUE (name, tournament_id)
);

-- 4.7 team_players
CREATE TABLE team_players (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id       uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id     uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    jersey_number integer,
    position      varchar(50),
    joined_at     timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_player_per_team UNIQUE (team_id, player_id),
    CONSTRAINT uq_jersey_per_team UNIQUE (team_id, jersey_number),
    CONSTRAINT chk_jersey_number CHECK (jersey_number > 0 AND jersey_number <= 99)
);

-- 4.8 tournament_registrations
CREATE TABLE tournament_registrations (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id     uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id           uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    registration_date timestamptz NOT NULL DEFAULT now(),
    status            registration_status NOT NULL DEFAULT 'pending',
    payment_status    payment_status NOT NULL DEFAULT 'unpaid',
    remarks           text,
    reviewed_at       timestamptz,
    reviewed_by       uuid REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT uq_team_per_tournament UNIQUE (tournament_id, team_id)
);

-- 4.9 matches
CREATE TABLE matches (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    sport_id      uuid NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    team_a_id     uuid NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    team_b_id     uuid NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    venue_id      uuid REFERENCES venues(id) ON DELETE SET NULL,
    match_date    date NOT NULL,
    start_time    time,
    end_time      time,
    round         match_round NOT NULL,
    match_number  integer NOT NULL,
    status        match_status NOT NULL DEFAULT 'scheduled',
    winner_id     uuid REFERENCES teams(id) ON DELETE SET NULL,
    score_team_a  varchar(50),
    score_team_b  varchar(50),
    remarks       text,
    updated_by    uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_different_teams CHECK (team_a_id <> team_b_id),
    CONSTRAINT uq_match_number_per_tournament UNIQUE (tournament_id, match_number)
);

CREATE TRIGGER set_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.10 match_events
CREATE TABLE match_events (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id    uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    event_type  event_type NOT NULL,
    player_id   uuid REFERENCES players(id) ON DELETE SET NULL,
    team_id     uuid REFERENCES teams(id) ON DELETE SET NULL,
    event_time  time,
    description text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4.11 points_table
CREATE TABLE points_table (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id   uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id         uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    matches_played  integer NOT NULL DEFAULT 0,
    wins            integer NOT NULL DEFAULT 0,
    losses          integer NOT NULL DEFAULT 0,
    draws           integer NOT NULL DEFAULT 0,
    points          integer NOT NULL DEFAULT 0,
    net_score_diff  decimal(10,4) DEFAULT 0.0,
    rank            integer,
    group_name      varchar(50),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_team_per_tournament_points UNIQUE (tournament_id, team_id),
    CONSTRAINT chk_matches_sum CHECK (matches_played = wins + losses + draws)
);

-- 4.12 player_performance
CREATE TABLE player_performance (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    tournament_id   uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    sport_id        uuid NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    matches_played  integer NOT NULL DEFAULT 0,
    goals_scored    integer DEFAULT 0,
    runs_scored     integer DEFAULT 0,
    points_scored   integer DEFAULT 0,
    assists         integer DEFAULT 0,
    wickets_taken   integer DEFAULT 0,
    awards          text[] DEFAULT '{}',
    rating          decimal(3,1) CHECK (rating >= 0 AND rating <= 10),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_player_per_tournament_perf UNIQUE (player_id, tournament_id)
);

CREATE TRIGGER set_player_performance_updated_at
    BEFORE UPDATE ON player_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4.13 notifications
CREATE TABLE notifications (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title           varchar(200) NOT NULL,
    message         text NOT NULL,
    type            notification_type NOT NULL,
    target_role     user_role,
    target_user_id  uuid REFERENCES users(id) ON DELETE CASCADE,
    is_read         boolean NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- 4.14 certificates
CREATE TABLE certificates (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id       uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    tournament_id   uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    type            certificate_type NOT NULL,
    issued_date     date NOT NULL DEFAULT CURRENT_DATE,
    certificate_url text,
    metadata        jsonb DEFAULT '{}',
    created_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT uq_certificate_per_player UNIQUE (player_id, tournament_id, type)
);

-- 4.15 reports
CREATE TABLE reports (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type          report_type NOT NULL,
    tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
    generated_by  uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_url      text NOT NULL,
    parameters    jsonb DEFAULT '{}',
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- 5. BUSINESS LOGIC TRIGGERS

-- Auto-generate QR code for players
CREATE OR REPLACE FUNCTION generate_player_qr_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.qr_code IS NULL THEN
        NEW.qr_code = 'PLAYOPS-' || UPPER(REPLACE(NEW.id::text, '-', ''));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_qr_code
    BEFORE INSERT ON players
    FOR EACH ROW
    EXECUTE FUNCTION generate_player_qr_code();

-- Auto-create points table entry on approved tournament registration
CREATE OR REPLACE FUNCTION create_points_table_entry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
        INSERT INTO points_table (tournament_id, team_id)
        VALUES (NEW.tournament_id, NEW.team_id)
        ON CONFLICT (tournament_id, team_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_points_entry
    AFTER UPDATE ON tournament_registrations
    FOR EACH ROW
    EXECUTE FUNCTION create_points_table_entry();

-- 6. INDEXES
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_players_user_id ON players (user_id);
CREATE INDEX idx_players_dept ON players (department);
CREATE INDEX idx_tournaments_sport_id ON tournaments (sport_id);
CREATE INDEX idx_tournaments_status ON tournaments (status);
CREATE INDEX idx_matches_tourn ON matches (tournament_id);
CREATE INDEX idx_matches_date ON matches (match_date);
CREATE INDEX idx_notifications_user ON notifications (target_user_id);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Read policies for public and authenticated entities
CREATE POLICY "public_read_sports" ON sports FOR SELECT USING (true);
CREATE POLICY "public_read_venues" ON venues FOR SELECT USING (true);
CREATE POLICY "public_read_tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "public_read_matches" ON matches FOR SELECT USING (true);
CREATE POLICY "public_read_points" ON points_table FOR SELECT USING (true);
CREATE POLICY "public_read_teams" ON teams FOR SELECT USING (true);
