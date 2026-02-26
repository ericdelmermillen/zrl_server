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

-- welcome email/more info email
CREATE TABLE welcome_email_versions (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  body_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- see welcomes
INSERT INTO
  welcome_email_versions (subject, body_content)
VALUES
  (
    'oldest',
    'Thanks for reaching out to learn more about Zidgy Road Labs.\nWe specialize in innovative solutions that help businesses grow and succeed in today''s digital landscape.\nOur team is dedicated to providing exceptional service and results that exceed expectations.\nIf you have any questions or would like to discuss how we can help, feel free to reply to this email.'
  ),
  (
    'newer',
    'Thank you for your interest in Zidgy Road Labs.\nWe build cutting-edge digital solutions tailored to help businesses scale and thrive.\nOur experienced team is committed to delivering outstanding results on every project.\nDon''t hesitate to reply to this email if you''d like to learn more about what we can do for you.'
  ),
  (
    'newest',
    'Welcome, and thanks for getting in touch with Zidgy Road Labs.\nWe craft innovative digital products that drive real business growth.\nFrom concept to delivery, our team brings expertise and dedication to everything we build.\nFeel free to reply to this email anytime — we''d love to discuss how we can help.'
  );