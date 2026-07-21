CREATE TABLE IF NOT EXISTS usage_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_type TEXT NOT NULL,
  event_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_responses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  age TEXT,
  gender TEXT,
  occupation TEXT,
  satisfaction_score INTEGER,
  how_known TEXT,
  expectations TEXT,
  is_helpful TEXT,
  feedback TEXT,
  assessment_scores TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diaries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  system_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'assistant',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospitals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  lat REAL,
  lng REAL,
  address TEXT,
  phone TEXT,
  region TEXT,
  province TEXT,
  type TEXT
);

ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for anyone" ON diaries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for specific user" ON diaries FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR true);

CREATE POLICY "Enable insert for anyone" ON survey_responses FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for anyone" ON usage_logs FOR INSERT WITH CHECK (true);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for anyone" ON hospitals FOR SELECT USING (true);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for anyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for anyone" ON posts FOR INSERT WITH CHECK (true);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for anyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Enable insert for anyone" ON comments FOR INSERT WITH CHECK (true);
