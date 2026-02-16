CREATE DATABASE zrl_db;

-- admin user(s)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL
);

-- subscribers
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL CHECK (
    status IN ('pending', 'confirmed', 'unsubscribed')
  ),
  confirmation_token TEXT,
  confirmation_token_expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  unsubscribe_token TEXT NOT NULL DEFAULT gen_random_uuid() :: text,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);