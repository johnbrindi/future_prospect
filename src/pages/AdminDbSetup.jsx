import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, Database, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  verifyDatabaseSetup, 
  setupRequiredTables, 
  fixProfilesRLSPolicy, 
  executeDatabaseSchema,
  getRLSFixSQL
} from "@/services/supabaseSetup";

const AdminDbSetup = () => {
  const [dbStatus, setDbStatus] = useState({
    checking: true,
    success: false,
    error: null,
    missingTables: [],
  });
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isFixingRLS, setIsFixingRLS] = useState(false);
  const [showManualSql, setShowManualSql] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setDbStatus((prev) => ({ ...prev, checking: true }));
    try {
      const { success, missingTables, error } = await verifyDatabaseSetup();
      
      setDbStatus({
        checking: false,
        success,
        error: error || null,
        missingTables: missingTables || [],
      });
      
      if (success) {
        toast({
          title: "Database check",
          description: "Database is properly configured",
        });
      }
    } catch (error) {
      console.error("Error checking database:", error);
      setDbStatus({
        checking: false,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error checking database",
        missingTables: [],
      });
    }
  };

  const handleSetupDatabase = async () => {
    setIsSettingUp(true);
    try {
      const { success: fullSuccess, error: fullError } = await executeDatabaseSchema();
      
      if (fullSuccess) {
        toast({
          title: "Success",
          description: "Database schema was set up successfully",
        });
        await checkDatabaseStatus();
        setIsSettingUp(false);
        return;
      }
      
      const { success, error } = await setupRequiredTables();
      
      if (success) {
        toast({
          title: "Success",
          description: "Database tables were created successfully",
        });
        await checkDatabaseStatus();
      } else {
        toast({
          title: "Setup Failed",
          description: error || "Failed to set up database tables",
          variant: "destructive",
        });
        setShowManualSql(true);
      }
    } catch (error) {
      console.error("Error setting up database:", error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Unknown error during setup",
        variant: "destructive",
      });
      setShowManualSql(true);
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleFixRLS = async () => {
    setIsFixingRLS(true);
    try {
      const { success, error } = await fixProfilesRLSPolicy();
      
      if (success) {
        toast({
          title: "Success",
          description: "RLS policies were updated successfully",
        });
        await checkDatabaseStatus();
      } else {
        toast({
          title: "RLS Fix Failed",
          description: error || "Failed to update RLS policies",
          variant: "destructive",
        });
        setShowManualSql(true);
      }
    } catch (error) {
      console.error("Error fixing RLS policies:", error);
      toast({
        title: "RLS Fix Failed",
        description: error instanceof Error ? error.message : "Unknown error fixing RLS",
        variant: "destructive",
      });
      setShowManualSql(true);
    } finally {
      setIsFixingRLS(false);
    }
  };

  const copyManualSql = () => {
    const sql = getRLSFixSQL();
    navigator.clipboard.writeText(sql);
    toast({
      title: "SQL Copied",
      description: "The SQL has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Link to="/" className="flex justify-center mb-8">
          <span className="text-2xl font-bold text-primary">FutureProspect Admin</span>
        </Link>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Database Setup</CardTitle>
            <CardDescription>
              Configure your Supabase database tables and security policies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Database Status</h3>
                  <p className="text-sm text-gray-500">
                    {dbStatus.checking ? "Checking database..." : 
                     dbStatus.success ? "Database is properly configured" : 
                     "Database needs setup"}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkDatabaseStatus}
                disabled={dbStatus.checking}
              >
                Refresh
              </Button>
            </div>
            
            {!dbStatus.success && !dbStatus.checking && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Configuration Issues</AlertTitle>
                <AlertDescription>
                  {dbStatus.missingTables.length > 0 ? (
                    <div>
                      <p>Missing tables: {dbStatus.missingTables.join(", ")}</p>
                      <p>These tables need to be created for the application to work properly.</p>
                    </div>
                  ) : (
                    <p>{dbStatus.error || "Unknown database configuration issue"}</p>
                  )}
                  
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSetupDatabase}
                      disabled={isSettingUp}
                    >
                      {isSettingUp ? "Setting up..." : "Setup Database"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleFixRLS}
                      disabled={isFixingRLS}
                    >
                      {isFixingRLS ? "Fixing..." : "Fix RLS Policies"}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {showManualSql && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Manual Setup Required</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Automated setup failed. Please run the SQL script manually in your Supabase SQL Editor:</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyManualSql}
                    className="mb-2"
                  >
                    Copy SQL Script
                  </Button>
                  <ol className="list-decimal pl-5 text-sm space-y-2">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to the SQL Editor</li>
                    <li>Paste the copied SQL</li>
                    <li>Run the script</li>
                    <li>Return here and click "Refresh" to verify</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            {dbStatus.success && (
              <Alert className="bg-green-50 border-green-200">
                <Shield className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">All Systems Ready</AlertTitle>
                <AlertDescription className="text-green-600">
                  Your database is properly configured with all required tables and security policies.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            
            {dbStatus.success && (
              <Button asChild>
                <Link to="/student-register">
                  Continue to Registration
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDbSetup;