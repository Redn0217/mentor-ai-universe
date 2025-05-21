-- Update RLS policies for the courses table

-- First, drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated users to modify" ON public.courses;

-- Create a more permissive policy for read access
CREATE POLICY "Allow public read access" 
  ON public.courses 
  FOR SELECT 
  USING (true);

-- Create a policy that allows anyone to insert/update/delete
-- In a production environment, you would want to restrict this to authenticated users
CREATE POLICY "Allow anyone to modify" 
  ON public.courses 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
