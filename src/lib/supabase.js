import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Environment has email confirmation required:', import.meta.env.VITE_EMAIL_CONFIRMATION_REQUIRED);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});


// Create storage buckets if they don't exist
const createRequiredBuckets = async () => {
  try {
    // Check and create avatars bucket
    const { data: avatarsBucket, error: avatarsCheckError } = await supabase.storage.getBucket('avatars');
    
    if (!avatarsBucket) {
      console.log('Creating avatars bucket...');
      
      // Use RPC function to bypass RLS for bucket creation
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'create_storage_bucket',
        { bucket_id: 'avatars', bucket_public: true }
      );
      
      if (rpcError) {
        console.error('Error creating avatars bucket via RPC:', rpcError);
        
        // Fallback to direct creation
        const { error } = await supabase.storage.createBucket('avatars', { public: true });
        
        if (error) {
          console.error('Error creating avatars bucket directly:', error);
        } else {
          console.log('Avatars bucket created successfully');
        }
      } else {
        console.log('Avatars bucket created successfully via RPC');
      }
    } else {
      console.log('Avatars bucket already exists');
    }
  } catch (error) {
    console.error('Error checking or creating buckets:', error);
  }
};

// Run bucket creation on initialization
createRequiredBuckets();

// Add detailed logging for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session:', session ? 'Session exists' : 'No session');
  console.log('User ID:', session?.user?.id || 'No user ID');
  console.log('User email:', session?.user?.email || 'No email');
  console.log('Email confirmed:', session?.user?.email_confirmed_at || 'Not confirmed');

  if (event === 'SIGNED_IN') {
    console.log('User signed in successfully with ID:', session?.user?.id);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'USER_UPDATED') {
    console.log('User data updated');
  } else if (event === 'PASSWORD_RECOVERY') {
    console.log('Password recovery initiated');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Session token refreshed');
  }
  
  if (typeof event === 'string' && event.includes('USER_DELETED')) {
    console.log('User account deleted');
  }
});

// Debug helpers for authentication
export const debugAuthState = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('=== DEBUG AUTH STATE ===');
  console.log('Error:', error ? error.message : 'No error');
  console.log('Session exists:', !!session);
  console.log('User ID:', session?.user?.id || 'No user ID');
  console.log('Email:', session?.user?.email || 'No email');
  console.log('========================');
  
  return { session, error };
};

export const createUserProfile = async (userId, type) => {
  try {
    // Try direct profiles creation first
    const { data, error } = await supabase
      .from('profiles')
      .insert({ user_id: userId, type })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile directly:', error);
      
      // Try using the RPC function if direct insertion fails
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'bypass_rls_for_profile_creation',
          { uid: userId, profile_type: type }
        );

        if (rpcError) {
          console.error('Error creating profile via RPC:', rpcError);
          throw rpcError;
        }
        
        console.log('Profile created via RPC:', rpcData);
        return rpcData;
      } catch (rpcCatchError) {
        console.error('Exception in RPC profile creation:', rpcCatchError);
        throw rpcCatchError;
      }
    }
    
    console.log('Profile created directly:', data);
    return data;
  } catch (error) {
    console.error('Exception in createUserProfile:', error);
    throw error;
  }
};

// Setup realtime for messages
export const setupRealtimeSubscription = () => {
  const channel = supabase.channel('public:messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      console.log('New message received:', payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};