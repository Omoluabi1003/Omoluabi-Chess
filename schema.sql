-- Schema for storing chess games, players, and moves
-- Drops existing tables and recreates them with additional constraints
-- and indexes for advanced query support.

-- Remove existing tables in dependency order
DROP TABLE IF EXISTS chess_moves;
DROP TABLE IF EXISTS chess_games;
DROP TABLE IF EXISTS players;

-- Player information
CREATE TABLE players (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1200,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Game metadata
CREATE TABLE chess_games (
    id BIGSERIAL PRIMARY KEY,
    white_player_id BIGINT NOT NULL REFERENCES players (id),
    black_player_id BIGINT NOT NULL REFERENCES players (id),
    board_state TEXT NOT NULL,
    current_turn TEXT NOT NULL CHECK (current_turn IN ('white', 'black')),
    status TEXT NOT NULL DEFAULT 'ongoing'
    CHECK (status IN ('ongoing', 'completed')),
    result TEXT CHECK (result IN ('1-0', '0-1', '1/2-1/2')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CHECK (white_player_id <> black_player_id)
);

-- Individual moves within a game
CREATE TABLE chess_moves (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL REFERENCES chess_games (id) ON DELETE CASCADE,
    player_id BIGINT NOT NULL REFERENCES players (id),
    move_number INTEGER NOT NULL,
    notation TEXT NOT NULL,
    moved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (game_id, move_number)
);

-- Helpful indexes for query performance
CREATE INDEX idx_chess_moves_game_id ON chess_moves (game_id);
CREATE INDEX idx_chess_games_white_player ON chess_games (white_player_id);
CREATE INDEX idx_chess_games_black_player ON chess_games (black_player_id);
