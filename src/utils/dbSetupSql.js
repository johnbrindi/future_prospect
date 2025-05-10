
export const getRLSFixSQL = () => `
-- This SQL script fixes RLS issues by creating proper policies
-- Run this in your Supabase SQL Editor if you encounter RLS policy errors

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read access to profiles" ON public.profiles;

-- Create new policies with proper permissions for profiles
CREATE POLICY "Public read access to profiles" ON public.profiles
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Anyone can create profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (TRUE);
  
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Drop existing students policies
DROP POLICY IF EXISTS "Anyone can view students" ON public.students;
DROP POLICY IF EXISTS "Users can create their own student profile" ON public.students;
DROP POLICY IF EXISTS "Users can update their own student profile" ON public.students;
DROP POLICY IF EXISTS "Anyone can create student profiles" ON public.students;
DROP POLICY IF EXISTS "Public read access to students" ON public.students;

-- Create new policies with proper permissions for students
CREATE POLICY "Public read access to students" ON public.students
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Anyone can create student profiles" ON public.students
  FOR INSERT TO authenticated WITH CHECK (TRUE);
  
CREATE POLICY "Users can update their own student profile" ON public.students
  FOR UPDATE USING (auth.uid() = user_id);

-- Drop existing companies policies
DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Users can create their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Anyone can create company profiles" ON public.companies;
DROP POLICY IF EXISTS "Public read access to companies" ON public.companies;

-- Create new policies with proper permissions for companies
CREATE POLICY "Public read access to companies" ON public.companies
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Anyone can create company profiles" ON public.companies
  FOR INSERT TO authenticated WITH CHECK (TRUE);
  
CREATE POLICY "Users can update their own company profile" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

-- Create bypass function for profile creation
CREATE OR REPLACE FUNCTION bypass_rls_for_profile_creation(uid UUID, profile_type TEXT)
RETURNS UUID AS $$
DECLARE
  new_profile_id UUID;
BEGIN
  -- This function is executed with SECURITY DEFINER privileges 
  -- which means it runs with the permissions of the function creator
  INSERT INTO profiles (user_id, type)
  VALUES (uid, profile_type)
  RETURNING id INTO new_profile_id;
  
  RETURN new_profile_id;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Profile creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to fix RLS policies
CREATE OR REPLACE FUNCTION fix_rls_policies_direct_sql()
RETURNS void AS $$
BEGIN
  -- Drop existing policies for profiles
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Public read access to profiles" ON public.profiles;
  
  -- Create new policies with proper permissions for profiles
  CREATE POLICY "Public read access to profiles" ON public.profiles
    FOR SELECT USING (TRUE);
    
  CREATE POLICY "Anyone can create profiles" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (TRUE);
    
  CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);
    
  -- Drop existing policies for students
  DROP POLICY IF EXISTS "Anyone can view students" ON public.students;
  DROP POLICY IF EXISTS "Users can create their own student profile" ON public.students;
  DROP POLICY IF EXISTS "Users can update their own student profile" ON public.students;
  DROP POLICY IF EXISTS "Anyone can create student profiles" ON public.students;
  DROP POLICY IF EXISTS "Public read access to students" ON public.students;
  
  -- Create new policies with proper permissions for students
  CREATE POLICY "Public read access to students" ON public.students
    FOR SELECT USING (TRUE);
    
  CREATE POLICY "Anyone can create student profiles" ON public.students
    FOR INSERT TO authenticated WITH CHECK (TRUE);
    
  CREATE POLICY "Users can update their own student profile" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);
    
  -- Drop existing policies for companies
  DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
  DROP POLICY IF EXISTS "Users can create their own company profile" ON public.companies;
  DROP POLICY IF EXISTS "Users can update their own company profile" ON public.companies;
  DROP POLICY IF EXISTS "Anyone can create company profiles" ON public.companies;
  DROP POLICY IF EXISTS "Public read access to companies" ON public.companies;
  
  -- Create new policies with proper permissions for companies
  CREATE POLICY "Public read access to companies" ON public.companies
    FOR SELECT USING (TRUE);
    
  CREATE POLICY "Anyone can create company profiles" ON public.companies
    FOR INSERT TO authenticated WITH CHECK (TRUE);
    
  CREATE POLICY "Users can update their own company profile" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;
`;

export const getCreateTablesSQL = () => `
-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    university TEXT NOT NULL,
    department TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Enable RLS on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Enable RLS on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
${getRLSFixSQL()}
`;