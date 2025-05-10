import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, createUserProfile, debugAuthState } from '@/lib/supabase';
import { createStudent } from '@/services/studentService';
import SignupErrorHelper from '@/components/SignupErrorHelper';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const studentSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  university: z.string().min(2, 'University name is required'),
  department: z.string().min(2, 'Department is required'),
});

const RegisterStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/student-dashboard');
    }
  }, [user, navigate]);

  const form = useForm({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      university: '',
      department: '',
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting student registration process...");

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
          emailRedirectTo: `${window.location.origin}/student-dashboard`,
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message);
        toast({
          title: 'Registration Error',
          description: authError.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        console.error("No user returned from signUp");
        setError("Registration failed: No user data returned");
        setIsLoading(false);
        return;
      }

      console.log("Auth user created successfully:", authData.user.id);

      try {
        console.log("Creating student record...");
        const studentId = await createStudent({
          user_id: authData.user.id,
          full_name: values.fullName,
          university: values.university,
          department: values.department,
        });

        console.log("Student created successfully with ID:", studentId);

        toast({
          title: 'Registration Successful',
          description: 'Your student account has been created!',
        });

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (signInError) {
          console.error("Error signing in after registration:", signInError);

          if (import.meta.env.VITE_EMAIL_CONFIRMATION_REQUIRED === 'true') {
            toast({
              title: 'Email Verification Required',
              description: 'Please check your email to verify your account before signing in.',
            });
            navigate('/login');
          } else {
            navigate('/login?registered=true');
          }
        } else {
          navigate('/student-dashboard');
        }
      } catch (profileError) {
        console.error("Profile/Student creation error:", profileError);
        setError(profileError.message || "Failed to create student profile");

        toast({
          title: 'Profile Creation Error',
          description: 'Your account was created, but we encountered an error setting up your profile. Please try signing in.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    } catch (err) {
      console.error("Unhandled error during registration:", err);
      setError(err.message || "An unexpected error occurred");

      toast({
        title: 'Registration Error',
        description: err.message || "Something went wrong",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/student-dashboard`,
        },
      });

      if (error) {
        toast({
          title: 'Sign In Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Sign In Error',
        description: err.message || "Something went wrong",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex justify-center mb-8">
          <span className="text-2xl font-bold text-primary">FutureProspect</span>
        </Link>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Student Registration</CardTitle>
            <CardDescription>Create your student account</CardDescription>
          </CardHeader>

          <CardContent>
            {error && <SignupErrorHelper error={error} />}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormDescription>
                        At least 8 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input placeholder="University of Example" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" onClick={() => signInWithProvider('github')}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" type="button" onClick={() => signInWithProvider('linkedin')}>
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center w-full">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-sm text-center w-full">
              Are you a company?{" "}
              <Link to="/company-register" className="text-primary hover:underline">
                Register as company
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterStudent;