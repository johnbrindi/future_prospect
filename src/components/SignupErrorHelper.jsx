import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SignupErrorHelper = ({ error }) => {
  if (!error) return null;

  const isRLSError = error.includes('security policies') || 
                     error.includes('violates row-level security') ||
                     error.includes('permission denied') ||
                     error.includes('RLS') ||
                     error.includes('profile creation failed');

  const isTableMissingError = error.includes('does not exist') || 
                             error.includes('table') ||
                             error.includes('missing');

  const isProfileCreationError = error.includes('profile creation failed') ||
                                error.includes('failed to create profile');

  if (!isRLSError && !isTableMissingError && !isProfileCreationError) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Database Configuration Issue</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          {isRLSError 
            ? "There's an issue with database security policies (RLS)." 
            : isTableMissingError
              ? "Required database tables are missing."
              : "There was a problem creating your profile."}
        </p>
        <p className="mb-4 text-sm">
          {isProfileCreationError 
            ? "This is likely due to a security configuration issue. Please try again or check the database setup."
            : "This can be fixed by running the database setup process."}
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/db-setup">
            Fix Database Setup
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SignupErrorHelper;