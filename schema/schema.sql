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

-- more info email
CREATE TABLE more_info_email (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  subject VARCHAR(255) NOT NULL,
  greeting VARCHAR(255) NOT NULL,
  body_content TEXT NOT NULL,
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT only_one_row CHECK (id = TRUE),
  CONSTRAINT greeting_has_name CHECK (greeting LIKE '%<name>%')
);

-- see welcomes
INSERT INTO
  more_info_email (subject, greeting, body_content)
VALUES
  (
    'Welcome to Zidgy Road Labs',
    'Hi <name>,',
    'Thanks for reaching out to learn more about Zidgy Road Labs.\nWe specialize in innovative solutions that help businesses grow and succeed in today''s digital landscape.\nOur team is dedicated to providing exceptional service and results that exceed expectations.\nIf you have any questions or would like to discuss how we can help, feel free to reply to this email.'
  );