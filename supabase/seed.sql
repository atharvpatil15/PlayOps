-- ==============================================================================
-- PlayOps — KK Wagh Sports Portal Seed Data
-- ==============================================================================

-- 1. Default Administrator
INSERT INTO users (email, password_hash, full_name, role, phone)
VALUES (
    'admin@kkwagh.edu.in',
    '$2a$12$placeholder_hash_replace_with_actual',
    'Sports Administrator',
    'admin',
    '9876543210'
) ON CONFLICT (email) DO NOTHING;

-- 2. Master Sports Catalog
INSERT INTO sports (name, type, max_players_per_team, min_players_per_team, icon) VALUES
    ('Cricket',      'outdoor', 15, 11, '🏏'),
    ('Football',     'outdoor', 18, 11, '⚽'),
    ('Basketball',   'outdoor', 12,  5, '🏀'),
    ('Volleyball',   'outdoor', 12,  6, '🏐'),
    ('Badminton',    'indoor',   2,  1, '🏸'),
    ('Table Tennis', 'indoor',   2,  1, '🏓'),
    ('Chess',        'indoor',   1,  1, '♟️'),
    ('Kho-Kho',     'outdoor', 12,  9, '🏃'),
    ('Kabaddi',      'outdoor',  12, 7, '🤼'),
    ('Athletics',    'outdoor',  1,  1, '🏃‍♂️')
ON CONFLICT (name) DO NOTHING;

-- 3. Campus Venues & Grounds
INSERT INTO venues (name, location, type, capacity, facilities) VALUES
    ('Main Cricket Ground',    'Behind Main Building',        'outdoor',     500, ARRAY['Changing Rooms', 'Scoreboard', 'Seating Gallery']),
    ('Football Field North',   'Sports Complex - North',      'outdoor',     300, ARRAY['Floodlights', 'Changing Rooms', 'First Aid']),
    ('Basketball Court',       'Sports Complex - Central',    'outdoor',     200, ARRAY['Floodlights', 'Scoreboard']),
    ('Indoor Sports Complex',  'Sports Complex - Building A', 'indoor',      150, ARRAY['AC', 'Badminton Nets', 'TT Tables', 'Seating']),
    ('Volleyball Court',       'Sports Complex - South',      'outdoor',     200, ARRAY['Net Post', 'Sand Pit', 'Seating']),
    ('Multipurpose Auditorium','Main Building - Ground Floor','multipurpose', 400, ARRAY['Stage', 'Projector', 'Seating', 'AC'])
ON CONFLICT (name) DO NOTHING;
