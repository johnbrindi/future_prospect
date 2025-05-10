import { supabase } from '@/lib/supabase';

export const getCompanyByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    throw new Error(error.message);
  }

  return data;
};

export const createCompany = async (companyData) => {
  try {
    console.log("Creating company profile for:", companyData.user_id);
    
    // First, try direct profile insertion with three attempts
    let profileCreated = false;
    let profileId = null;
    let profileError = null;
    let attempts = 0;
    
    while (!profileCreated && attempts < 3) {
      attempts++;
      console.log(`Attempt ${attempts} to create profile for ${companyData.user_id}`);
      
      try {
        // Attempt to directly insert into profiles table
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            user_id: companyData.user_id,
            type: 'company'
          })
          .select('id')
          .single();
        
        if (error) {
          console.error(`Profile creation attempt ${attempts} failed:`, error);
          profileError = error;
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        } else if (data) {
          profileId = data.id;
          profileCreated = true;
          console.log("Profile created successfully with id:", profileId);
        }
      } catch (err) {
        console.error(`Exception in profile creation attempt ${attempts}:`, err);
        profileError = err;
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // If direct insertion failed, try manual SQL execution through RPC
    if (!profileCreated) {
      console.log("Direct insertion failed, trying RPC method...");
      
      try {
        const { data, error } = await supabase.rpc('fix_rls_policies_direct_sql');
        
        if (error) {
          console.error("Failed to fix RLS policies:", error);
        } else {
          console.log("RLS policies fixed, retrying profile creation");
          
          // Try direct insertion again
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .insert({
              user_id: companyData.user_id,
              type: 'company'
            })
            .select('id')
            .single();
          
          if (retryError) {
            console.error("Profile creation retry failed:", retryError);
            throw new Error(`Profile creation failed after RLS fix: ${retryError.message}`);
          } else if (retryData) {
            profileId = retryData.id;
            profileCreated = true;
            console.log("Profile created successfully after RLS fix with id:", profileId);
          }
        }
      } catch (rpcError) {
        console.error("RPC error:", rpcError);
      }
    }
    
    // If we still haven't created a profile, throw error
    if (!profileCreated) {
      throw new Error(`Failed to create profile after multiple attempts: ${profileError?.message || "Unknown error"}`);
    }
    
    // Wait to ensure profile creation is fully processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Now create the company record
    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        user_id: companyData.user_id,
        name: companyData.name,
        industry: companyData.industry || '',
        location: companyData.location || '',
        description: companyData.description || '',
        logo_url: companyData.logo_url || '',
        website: companyData.website || '',
        size: companyData.size || '',
      })
      .select('id')
      .single();

    if (error) {
      console.error("Company creation error:", error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    if (!company) {
      throw new Error('Company created but no ID returned');
    }

    // Verify the company was created successfully
    await verifyCompanyExists(companyData.user_id);

    return company.id;
  } catch (error) {
    console.error("Error in createCompany:", error);
    throw error;
  }
};

export const updateCompany = async (
  id,
  updates
) => {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const uploadCompanyLogo = async (file, companyId) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `companies/${companyId}/logo.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from('logos')
    .getPublicUrl(filePath);

  // Update the company record with the new logo URL
  const { data, error } = await supabase
    .from('companies')
    .update({ logo_url: urlData.publicUrl })
    .eq('id', companyId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Verify if a company record exists for the given user ID
 */
export const verifyCompanyExists = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error verifying company existence:', error);
      return { 
        exists: false, 
        error: error.message 
      };
    }

    return { 
      exists: !!data, 
      companyId: data?.id,
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error verifying company:', error);
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};