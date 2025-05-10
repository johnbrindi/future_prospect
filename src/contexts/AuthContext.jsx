import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { createStudent, verifyStudentExists } from '@/services/studentService';
import { createCompany, verifyCompanyExists } from '@/services/companyService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (session?.user) {
          try {
            if (event === 'SIGNED_IN') {
              console.log("User signed in, fetching profile...");

              // Wait a moment for any database triggers to complete
              setTimeout(async () => {
                const profileData = await fetchProfile(session.user.id);

                // Redirect based on user type
                if (profileData) {
                  if (profileData.type === 'student') {
                    navigate('/student-dashboard');
                  } else if (profileData.type === 'company') {
                    navigate('/company-dashboard');
                  }
                } else {
                  // No profile found - could be a new social login
                  console.log("Checking if we need to create a profile for social auth");
                  const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                  if (!existingProfile) {
                    await handleSocialAuthUserCreation(session.user);
                  }
                }
              }, 1000);
            }
          } catch (error) {
            console.error("Error in auth change handler:", error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      console.log("Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return null;
      }

      if (!data) {
        console.log("No profile found for user:", userId);
        setProfile(null);
        return null;
      }

      console.log("Found profile:", data);

      let profileData = null;

      if (data.type === 'student') {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (studentError) {
          console.error('Error fetching student details:', studentError);

          const verifyResult = await verifyStudentExists(userId);
          if (!verifyResult.exists) {
            console.error("Student verification failed:", verifyResult.error);
          }
        }

        profileData = {
          id: data.id,
          type: data.type,
          studentId: studentData?.id
        };

        console.log("Set student profile:", profileData);
      } else if (data.type === 'company') {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (companyError) {
          console.error('Error fetching company details:', companyError);

          const verifyResult = await verifyCompanyExists(userId);
          if (!verifyResult.exists) {
            console.error("Company verification failed:", verifyResult.error);
          }
        }

        profileData = {
          id: data.id,
          type: data.type,
          companyId: companyData?.id
        };

        console.log("Set company profile:", profileData);
      }

      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfile(null);
      return null;
    }
  };

  const handleSocialAuthUserCreation = async (userData) => {
    try {
      console.log("Attempting to create profile for social auth user:", userData.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking for existing profile:', error);
        throw error;
      }

      if (data) {
        console.log('User already has a profile, no need to create one');
        return;
      }

      let fullName = userData.user_metadata?.full_name ||
        `${userData.user_metadata?.name || ''} ${userData.user_metadata?.preferred_username || ''}`.trim();

      if (!fullName && userData.email) {
        fullName = userData.email.split('@')[0];
      }

      console.log("Creating student profile for social auth user with name:", fullName);

      if (!data) {
        await createStudent({
          full_name: fullName || "User",
          university: "Please update",
          department: "Please update",
          user_id: userData.id,
        });

        toast({
          title: "Profile created",
          description: "Please complete your profile details",
        });

        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Error in social auth user creation:', error);
      toast({
        title: "Profile creation error",
        description: error instanceof Error ? error.message : "Failed to create user profile",
        variant: "destructive"
      });
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/student-dashboard`,
        },
      });

      if (error) {
        toast({
          title: `${provider} sign-in failed`,
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // Note: The user will be redirected to the OAuth provider's page
      // We will handle the callback in the onAuthStateChange listener
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast({
        title: "Sign-in error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signInWithGithub = async () => {
    return signInWithProvider('github');
  };

  const signInWithLinkedIn = async () => {
    return signInWithProvider('linkedin');
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive"
        });
        return { user: null, error };
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email for verification.",
      });

      return { user: data.user, error: null };
    } catch (error) {
      toast({
        title: "Error signing up",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { user: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive"
        });
        return { user: null, error };
      }

      toast({
        title: "Success!",
        description: "Signed in successfully",
      });

      return { user: data.user, error: null };
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { user: null, error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password",
      });
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const value = {
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    signInWithGithub,
    signInWithLinkedIn,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};