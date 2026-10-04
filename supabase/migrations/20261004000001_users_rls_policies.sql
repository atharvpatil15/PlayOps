-- ==============================================================================
-- Migration: Add Row Level Security (RLS) policies for users table
-- ==============================================================================

-- 1. Enable RLS on users table (idempotent)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Allow authenticated users to read their own user record
DROP POLICY IF EXISTS "users_read_self" ON public.users;
CREATE POLICY "users_read_self" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 3. Allow admins to read all user records
DROP POLICY IF EXISTS "admin_read_all_users" ON public.users;
CREATE POLICY "admin_read_all_users" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. Allow users to update their own profile (name, phone, avatar)
DROP POLICY IF EXISTS "users_update_self" ON public.users;
CREATE POLICY "users_update_self" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
