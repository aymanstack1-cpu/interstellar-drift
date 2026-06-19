-- Subscribers table for newsletter signups
CREATE TABLE IF NOT EXISTS subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'interstellar-drift'
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for signup form)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only allow reading own email (basic privacy)
CREATE POLICY "Users can read own" ON subscribers
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims')::json->>'email');
