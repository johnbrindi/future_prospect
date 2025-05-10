import { supabase } from '@/lib/supabase';
import { executeDatabaseSchema } from '@/services/supabaseSetup';

// Export the helper to be used in the UI
export { getRLSFixSQL } from '@/utils/dbSetupSql';

/**
 * Utility function to ensure database schema is properly set up
 * before performing auth operations
 */
export const ensureDatabaseSetup = async () => {
  try {
    // Check if required tables exist
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (profilesError && profilesError.code === '42P01') {
      // Table doesn't exist, execute full schema
      console.log("Profiles table doesn't exist, executing full schema");
      const { success, error } = await executeDatabaseSchema();
      
      if (!success) {
        console.error("Failed to execute schema:", error);
        return { success: false, error };
      }
      
      return { success: true };
    }
    
    // Check for students table
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('count')
      .limit(1);
      
    if (studentsError && studentsError.code === '42P01') {
      // Table doesn't exist, execute full schema
      console.log("Students table doesn't exist, executing full schema");
      const { success, error } = await executeDatabaseSchema();
      
      if (!success) {
        console.error("Failed to execute schema:", error);
        return { success: false, error };
      }
      
      return { success: true };
    }
    
    // Check for companies table
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('count')
      .limit(1);
      
    if (companiesError && companiesError.code === '42P01') {
      // Table doesn't exist, execute full schema
      console.log("Companies table doesn't exist, executing full schema");
      const { success, error } = await executeDatabaseSchema();
      
      if (!success) {
        console.error("Failed to execute schema:", error);
        return { success: false, error };
      }
      
      return { success: true };
    }
    
    // All tables exist
    return { success: true };
  } catch (error) {
    console.error("Error ensuring database setup:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

/**
 * Utility function to validate if a user has a complete profile
 */
export const validateUserProfile = async (userId) => {
  try {
    // Check if user has a profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (profileError) {
      console.error("Error validating profile:", profileError);
      return { 
        valid: false, 
        type: null, 
        error: profileError.message 
      };
    }
    
    if (!profileData) {
      return { 
        valid: false, 
        type: null, 
        error: "No profile found" 
      };
    }
    
    // Check if user has profile-specific data
    if (profileData.type === 'student') {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (studentError) {
        console.error("Error validating student data:", studentError);
        return { 
          valid: false, 
          type: 'student', 
          error: studentError.message 
        };
      }
      
      if (!studentData) {
        return { 
          valid: false, 
          type: 'student', 
          error: "No student data found" 
        };
      }
      
      return { 
        valid: true, 
        type: 'student', 
        data: studentData 
      };
    } else if (profileData.type === 'company') {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (companyError) {
        console.error("Error validating company data:", companyError);
        return { 
          valid: false, 
          type: 'company', 
          error: companyError.message 
        };
      }
      
      if (!companyData) {
        return { 
          valid: false, 
          type: 'company', 
          error: "No company data found" 
        };
      }
      
      return { 
        valid: true, 
        type: 'company', 
        data: companyData 
      };
    }
    
    return { 
      valid: false, 
      type: profileData.type, 
      error: "Unknown profile type" 
    };
  } catch (error) {
    console.error("Error validating user profile:", error);
    return { 
      valid: false, 
      type: null, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};