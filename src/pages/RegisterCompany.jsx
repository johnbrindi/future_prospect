import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Building, AlertCircle, Github, Linkedin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createCompany } from "@/services/companyService";
import { 
  verifyDatabaseSetup, 
  setupRequiredTables, 
  fixProfilesRLSPolicy, 
  executeDatabaseSchema,
  getRLSFixSQL
} from "@/services/supabaseSetup";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import SignupErrorHelper from "@/components/SignupErrorHelper";
import { Textarea } from "@/components/ui/textarea";

const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  about: z.string().min(10, "About must be at least 10 characters"),
  website: z.string().url("Please enter a valid website URL").optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const RegisterCompany = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showManualSqlInstructions, setShowManualSqlInstructions] = useState(false);
  const [manualSqlText, setManualSqlText] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signInWithGithub, signInWithLinkedIn, resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [dbSetupError, setDbSetupError] = useState(null);
  const [isCheckingDb, setIsCheckingDb] = useState(true);
  const [isSettingUpDb, setIsSettingUpDb] = useState(false);
  const [isFixingRLS, setIsFixingRLS] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      location: "",
      about: "",
      website: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const checkDatabaseSetup = async () => {
      setIsCheckingDb(true);
      try {
        const { success, missingTables } = await verifyDatabaseSetup();
        if (!success && missingTables.length > 0) {
          setDbSetupError(`Database tables missing: ${missingTables.join(', ')}. Please create the required tables.`);
        } else {
          setDbSetupError(null);
        }
      } catch (error) {
        console.error("Error checking database setup:", error);
        setDbSetupError("Failed to verify database setup. Please try again later.");
      } finally {
        setIsCheckingDb(false);
      }
    };
    
    checkDatabaseSetup();
  }, []);

  const setupDatabase = async () => {
    setIsSettingUpDb(true);
    try {
      const { success: schemaSuccess, error: schemaError } = await executeDatabaseSchema();
      
      if (schemaSuccess) {
        setDbSetupError(null);
        toast({
          title: "Success!",
          description: "Database schema created successfully.",
        });
        setIsSettingUpDb(false);
        return;
      }
      
      const { success, error } = await setupRequiredTables();
      if (success) {
        setDbSetupError(null);
        toast({
          title: "Success!",
          description: "Database tables created successfully.",
        });
      } else {
        setManualSqlText(getRLSFixSQL());
        setShowManualSqlInstructions(true);
        
        setDbSetupError(`Failed to create tables: ${error}`);
        toast({
          title: "Setup failed",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting up database:", error);
      
      setManualSqlText(getRLSFixSQL());
      setShowManualSqlInstructions(true);
      
      setDbSetupError("Failed to set up database. Please try again later.");
      toast({
        title: "Setup failed",
        description: "An unexpected error occurred while setting up the database.",
        variant: "destructive",
      });
    } finally {
      setIsSettingUpDb(false);
    }
  };

  const fixRLSPolicy = async () => {
    setIsFixingRLS(true);
    try {
      const { success, error } = await fixProfilesRLSPolicy();
      if (success) {
        toast({
          title: "Success!",
          description: "RLS policies fixed successfully.",
        });
        setShowManualSqlInstructions(false);
      } else {
        setManualSqlText(getRLSFixSQL());
        setShowManualSqlInstructions(true);
        
        toast({
          title: "RLS fix failed",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fixing RLS policies:", error);
      
      setManualSqlText(getRLSFixSQL());
      setShowManualSqlInstructions(true);
      
      toast({
        title: "RLS fix failed",
        description: "An unexpected error occurred while fixing RLS policies.",
        variant: "destructive",
      });
    } finally {
      setIsFixingRLS(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (dbSetupError) {
        throw new Error(dbSetupError);
      }
      
      if (provider === 'github') {
        await signInWithGithub();
      } else if (provider === 'linkedin') {
        await signInWithLinkedIn();
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (dbSetupError) {
        throw new Error(dbSetupError);
      }
      
      const { user, error } = await signUp(data.email, data.password);

      if (error) {
        throw new Error(error.message);
      }

      if (user) {
        try {
          await createCompany({
            user_id: user.id,
            name: data.companyName,
            industry: data.industry,
            location: data.location,
            description: data.about,
            website: data.website,
          });

          toast({
            title: "Success!",
            description: "Your company account has been created successfully!",
          });

          const emailConfirmationRequired = import.meta.env.VITE_EMAIL_CONFIRMATION_REQUIRED === 'true';
          
          if (emailConfirmationRequired) {
            toast({
              title: "Please verify your email",
              description: "Check your email to verify your account before logging in.",
            });
            navigate("/login");
          } else {
            navigate("/company-dashboard");
          }
        } catch (profileError) {
          console.error("Profile creation error:", profileError);
          
          const errorMessage = profileError instanceof Error ? profileError.message : "Unknown error";
          if (errorMessage.includes('violates row-level security policy')) {
            setDbSetupError("Profile creation failed due to security policies. Please fix RLS policies.");
            
            const fixButton = (
              <Button size="sm" onClick={fixRLSPolicy} disabled={isFixingRLS}>
                {isFixingRLS ? "Fixing..." : "Fix RLS Policies"}
              </Button>
            );
            
            toast({
              title: "Registration incomplete",
              description: "Account created but profile setup failed due to database security policies.",
              variant: "destructive",
              action: fixButton,
            });
          } else if (errorMessage.includes('table does not exist')) {
            setDbSetupError(errorMessage);
            
            const setupButton = (
              <Button size="sm" onClick={setupDatabase} disabled={isSettingUpDb}>
                {isSettingUpDb ? "Setting up..." : "Setup Database"}
              </Button>
            );
            
            toast({
              title: "Registration incomplete",
              description: "Account created but profile setup failed. Database tables are missing.",
              variant: "destructive",
              action: setupButton,
            });
          } else {
            toast({
              title: "Registration incomplete",
              description: errorMessage,
              variant: "destructive",
            });
            navigate("/login");
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (data) => {
    setIsResettingPassword(true);
    try {
      await resetPassword(data.email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      setIsResetDialogOpen(false);
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Link to="/" className="flex justify-center mb-8">
          <span className="text-2xl font-bold text-primary">FutureProspect</span>
        </Link>
        
        <SignupErrorHelper error={dbSetupError} />
        
        {showManualSqlInstructions && (
          <Alert className="mb-4">
            <AlertTitle>Manual Database Setup Required</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Automated setup failed. Please run the following SQL in your Supabase SQL Editor:</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
                <pre>{manualSqlText}</pre>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(manualSqlText);
                  toast({
                    title: "SQL Copied",
                    description: "SQL copied to clipboard. Paste it in your Supabase SQL Editor.",
                  });
                }}
              >
                Copy SQL
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {dbSetupError && (
          <div className="mb-4 flex gap-2 justify-center">
            <Button onClick={setupDatabase} disabled={isSettingUpDb}>
              {isSettingUpDb ? "Setting up database..." : "Setup Database"}
            </Button>
            <Button onClick={fixRLSPolicy} disabled={isFixingRLS}>
              {isFixingRLS ? "Fixing RLS..." : "Fix RLS Policies"}
            </Button>
          </div>
        )}
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Company Registration</CardTitle>
            <CardDescription className="text-center">
              Create an account to post internship opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSocialLogin('github')}
                disabled={isCheckingDb || !!dbSetupError}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSocialLogin('linkedin')}
                disabled={isCheckingDb || !!dbSetupError}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input {...field} placeholder="Acme Corp" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input {...field} placeholder="Technology" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input {...field} placeholder="Bamenda" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="About the company" className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://www.example.com" type="url" />
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="company@example.com"
                            type="email"
                            className="pl-10"
                          />
                        </div>
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
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="pl-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder="••••••••"
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting || isCheckingDb || !!dbSetupError}>
                  {isSubmitting ? "Registering..." : "Register as Company"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Sign In
              </Link>
            </p>
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm text-gray-500">
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="company@example.com"
                                type="email"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isResettingPassword}>
                        {isResettingPassword ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterCompany;