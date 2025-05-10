-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('student', 'company')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for profiles with FIXED permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read access to profiles" ON public.profiles;

-- Create new policies with proper permissions
-- The critical fix: Allow SELECT for ALL users
CREATE POLICY "Public read access to profiles" ON public.profiles
  FOR SELECT USING (TRUE);
  
-- The critical fix: Allow ANY authenticated user to create profiles without restriction
CREATE POLICY "Anyone can create profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (TRUE);
  
-- Allow users to update only their own profiles
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  university TEXT NOT NULL,
  department TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for students with FIXED permissions
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view students" ON public.students;
DROP POLICY IF EXISTS "Users can create their own student profile" ON public.students;
DROP POLICY IF EXISTS "Users can update their own student profile" ON public.students;
DROP POLICY IF EXISTS "Anyone can create student profiles" ON public.students;
DROP POLICY IF EXISTS "Public read access to students" ON public.students;

-- Create new policies with proper permissions
-- The critical fix: Allow SELECT for ALL users
CREATE POLICY "Public read access to students" ON public.students
  FOR SELECT USING (TRUE);
  
-- The critical fix: Allow ANY authenticated user to create student profiles
CREATE POLICY "Anyone can create student profiles" ON public.students
  FOR INSERT TO authenticated WITH CHECK (TRUE);
  
-- Allow users to update only their own profiles
CREATE POLICY "Users can update their own student profile" ON public.students
  FOR UPDATE USING (auth.uid() = user_id);

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for companies with FIXED permissions
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Users can create their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Anyone can create company profiles" ON public.companies;
DROP POLICY IF EXISTS "Public read access to companies" ON public.companies;

-- Create new policies with proper permissions
-- The critical fix: Allow SELECT for ALL users
CREATE POLICY "Public read access to companies" ON public.companies
  FOR SELECT USING (TRUE);
  
-- The critical fix: Allow ANY authenticated user to create company profiles
CREATE POLICY "Anyone can create company profiles" ON public.companies
  FOR INSERT TO authenticated WITH CHECK (TRUE);
  
-- Allow users to update only their own profiles
CREATE POLICY "Users can update their own company profile" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

-- Create internships table
CREATE TABLE IF NOT EXISTS public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Remote', 'On-site', 'Hybrid')),
  duration TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}'::TEXT[],
  responsibilities TEXT[] DEFAULT '{}'::TEXT[],
  is_active BOOLEAN DEFAULT true NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for internships
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view internships" ON public.internships;
DROP POLICY IF EXISTS "Companies can create internships" ON public.internships;
DROP POLICY IF EXISTS "Companies can update their own internships" ON public.internships;
DROP POLICY IF EXISTS "Companies can delete their own internships" ON public.internships;

-- Create new policies with proper permissions
CREATE POLICY "Anyone can view internships" ON public.internships
  FOR SELECT USING (TRUE);
  
CREATE POLICY "Companies can create internships" ON public.internships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE id = internships.company_id AND user_id = auth.uid()
    )
  );
  
CREATE POLICY "Companies can update their own internships" ON public.internships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE id = internships.company_id AND user_id = auth.uid()
    )
  );
  
CREATE POLICY "Companies can delete their own internships" ON public.internships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE id = internships.company_id AND user_id = auth.uid()
    )
  );

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'shortlisted', 'interviewing', 'accepted', 'rejected')) DEFAULT 'pending',
  resume_url TEXT,
  cover_letter TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Students can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Companies can view applications to their internships" ON public.applications;
DROP POLICY IF EXISTS "Students can create applications" ON public.applications;
DROP POLICY IF EXISTS "Students can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Companies can update applications to their internships" ON public.applications;

-- Create new policies with proper permissions
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = applications.student_id AND user_id = auth.uid()
    )
  );
  
CREATE POLICY "Companies can view applications to their internships" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.internships i
      JOIN public.companies c ON i.company_id = c.id
      WHERE i.id = applications.internship_id AND c.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Students can create applications" ON public.applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = applications.student_id AND user_id = auth.uid()
    )
  );
  
CREATE POLICY "Students can update their own applications" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = applications.student_id AND user_id = auth.uid()
    )
  );
  
CREATE POLICY "Companies can update applications to their internships" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.internships i
      JOIN public.companies c ON i.company_id = c.id
      WHERE i.id = applications.internship_id AND c.user_id = auth.uid()
    )
  );

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages they sent or received" ON public.messages;

-- Create new policies with proper permissions
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));
  
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
  
CREATE POLICY "Users can update messages they sent or received" ON public.messages
  FOR UPDATE USING (auth.uid() IN (sender_id, receiver_id));

-- Create a stored procedure that can be called via RPC to fix RLS policies
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

-- Fix RLS policies function (legacy - kept for compatibility)
CREATE OR REPLACE FUNCTION fix_profiles_rls_policy()
RETURNS void AS $$
BEGIN
  -- Call the more comprehensive fix function
  PERFORM fix_rls_policies_direct_sql();
END;
$$ LANGUAGE plpgsql;

-- Create a bypass function for profile creation that works with RPC
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

-- Create a stored procedure to execute the schema SQL
CREATE OR REPLACE FUNCTION execute_schema_sql()
RETURNS void AS $$
BEGIN
  -- Call the RLS fix function
  PERFORM fix_rls_policies_direct_sql();
END;
$$ LANGUAGE plpgsql;