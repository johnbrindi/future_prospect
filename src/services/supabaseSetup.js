import { supabase } from '@/lib/supabase';
import { getRLSFixSQL, getCreateTablesSQL } from '@/utils/dbSetupSql';

// Export the helper to be used in the UI
export { getRLSFixSQL } from '@/utils/dbSetupSql';

export const verifyDatabaseSetup = async () => {
  try {
    const requiredTables = ['profiles', 'students', 'companies'];
    const missingTables = [];

    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error && error.code === '42P01') {
        missingTables.push(table);
      }
    }

    return {
      success: missingTables.length === 0,
      missingTables,
    };
  } catch (error) {
    console.error('Error verifying database setup:', error);
    return {
      success: false,
      missingTables: ['Error checking tables'],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const setupRequiredTables = async () => {
  try {
    try {
      const { error: rpcError } = await supabase.rpc('execute_schema_sql');
      if (!rpcError) {
        console.log('Successfully executed schema via RPC');
        return { success: true };
      }
    } catch (rpcError) {
      console.error('RPC execute_schema_sql failed:', rpcError);
    }

    for (const table of ['profiles', 'students', 'companies']) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error && error.code === '42P01') {
        console.error(`Table ${table} doesn't exist:`, error);
      } else {
        console.log(`Table ${table} exists`);
      }
    }

    try {
      await supabase.rpc('fix_rls_policies_direct_sql');
      console.log('Successfully fixed RLS policies');
      return { success: true };
    } catch (fixError) {
      console.error('Failed to fix RLS policies:', fixError);
    }

    const { success } = await verifyDatabaseSetup();
    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to create all required tables' };
    }
  } catch (error) {
    console.error('Error setting up required tables:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const fixProfilesRLSPolicy = async () => {
  try {
    try {
      const { error: rpcError } = await supabase.rpc('fix_rls_policies_direct_sql');
      if (!rpcError) {
        console.log('RLS policies fixed successfully');
        return { success: true };
      }
    } catch (rpcError) {
      console.error('RPC fix_rls_policies_direct_sql failed:', rpcError);
    }

    console.log('RLS policies fixed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error fixing RLS policies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const executeDatabaseSchema = async () => {
  try {
    try {
      const { error: rpcError } = await supabase.rpc('execute_schema_sql');
      if (!rpcError) {
        console.log('Database schema executed successfully');
        return { success: true };
      }
      console.error('RPC execute_schema_sql failed:', rpcError);
    } catch (rpcError) {
      console.error('RPC execute_schema_sql failed:', rpcError);
    }

    const createTablesResult = await setupRequiredTables();
    if (!createTablesResult.success) {
      console.error('Failed to create tables:', createTablesResult.error);
    } else {
      console.log('Tables created successfully');
    }

    const fixRLSResult = await fixProfilesRLSPolicy();
    if (!fixRLSResult.success) {
      console.error('Failed to fix RLS policies:', fixRLSResult.error);
    } else {
      console.log('RLS policies fixed successfully');
    }

    const bypassResult = await setupBypassRLSFunction();
    if (!bypassResult.success) {
      console.error('Failed to create bypass function:', bypassResult.error);
    } else {
      console.log('Bypass function created successfully');
    }

    const verifyResult = await verifyDatabaseSetup();
    if (!verifyResult.success) {
      console.error('Tables still missing after setup attempts:', verifyResult.missingTables);
      return {
        success: false,
        error: `Failed to create all required tables: ${verifyResult.missingTables.join(', ')}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error executing database schema:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const setupBypassRLSFunction = async () => {
  try {
    try {
      const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID for testing
      const { data, error } = await supabase.rpc('bypass_rls_for_profile_creation', {
        uid: testUserId,
        profile_type: 'student',
      });

      if (!error || error.code !== 'PGRST202') {
        console.log('Bypass function already exists');
        return { success: true };
      }
    } catch (testError) {
      console.log('Testing bypass function failed:', testError);
    }

    console.log("Bypass function doesn't exist yet, need to execute schema");

    try {
      const { error } = await supabase.rpc('fix_rls_policies_direct_sql');
      if (!error) {
        console.log('RLS policies fixed and bypass function should now exist');
        return { success: true };
      }
    } catch (rpcError) {
      console.error('RPC fix_rls_policies_direct_sql failed:', rpcError);
    }

    return {
      success: false,
      error: 'Could not create bypass function - please run the SQL directly',
    };
  } catch (error) {
    console.error('Error creating bypass function:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};