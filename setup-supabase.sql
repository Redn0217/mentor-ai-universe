
-- This is a SQL script to set up the necessary tables in Supabase
-- You'll need to run this in the Supabase SQL editor

-- Create the courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  tutor JSONB,
  last_updated TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to set up the database
CREATE OR REPLACE FUNCTION setup_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create tables if they don't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'courses') THEN
    CREATE TABLE public.courses (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      modules JSONB NOT NULL DEFAULT '[]'::jsonb,
      tutor JSONB,
      last_updated TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;

  -- Set up RLS policies
  ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

  -- Create policies
  DROP POLICY IF EXISTS "Allow public read access" ON public.courses;
  CREATE POLICY "Allow public read access"
    ON public.courses
    FOR SELECT
    USING (true);

  DROP POLICY IF EXISTS "Allow authenticated users to modify" ON public.courses;
  CREATE POLICY "Allow authenticated users to modify"
    ON public.courses
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
END;
$$;

-- Create a function that our application can call to create the courses table
CREATE OR REPLACE FUNCTION create_courses_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'courses') THEN
    CREATE TABLE public.courses (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      modules JSONB NOT NULL DEFAULT '[]'::jsonb,
      tutor JSONB,
      last_updated TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Set up RLS policies
    ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow public read access"
      ON public.courses
      FOR SELECT
      USING (true);

    CREATE POLICY "Allow authenticated users to modify"
      ON public.courses
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_courses_table TO anon, authenticated;
GRANT EXECUTE ON FUNCTION setup_database TO anon, authenticated;

-- Set up profile table to store additional user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY "Allow public read access to profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow users to update their own profiles
CREATE POLICY "Allow users to update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create a trigger to create a profile when a user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
