import { supabase } from '@/lib/supabase';

export const getStudentByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    // First check if the profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', studentData.user_id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // If error is not "no rows returned", throw it
      throw profileError;
    }

    // If profile doesn't exist, create it
    if (!profileData) {
      const { error: insertProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: studentData.user_id,
          type: 'student'
        });

      if (insertProfileError) {
        throw insertProfileError;
      }
    }

    // Now create student record
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return data?.id;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const updateStudent = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const uploadStudentAvatar = async (file, userId) => {
  try {
    // Create the avatars folder for this user if it doesn't exist
    const folderPath = `${userId}`;
    const filePath = `${folderPath}/${Date.now()}_${file.name}`;

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update the student record with the avatar URL
    const { data: studentData, error: updateError } = await supabase
      .from('students')
      .update({ avatar_url: urlData.publicUrl })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return {
      avatarUrl: urlData.publicUrl,
      student: studentData
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

export const getStudentSkills = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('skills')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.skills || [];
  } catch (error) {
    console.error('Error fetching student skills:', error);
    return [];
  }
};

export const searchStudents = async (query, filters) => {
  try {
    let supabaseQuery = supabase
      .from('students')
      .select('*');

    // Search by name, university, or department
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `full_name.ilike.%${query}%,university.ilike.%${query}%,department.ilike.%${query}%`
      );
    }

    // Filter by skills if provided
    if (filters?.skills && filters.skills.length > 0) {
      const skillConditions = filters.skills.map(skill => 
        `skills.cs.{${skill}}`
      );
      supabaseQuery = supabaseQuery.or(skillConditions.join(','));
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching students:', error);
    return [];
  }
};

export const addStudentProject = async (userId, project) => {
  try {
    // First get current projects
    const { data: currentData, error: fetchError } = await supabase
      .from('students')
      .select('projects')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Prepare projects array (either existing or new empty array)
    const projects = currentData?.projects || [];
    
    // Add new project
    projects.push(project);
    
    // Update student record with new projects array
    const { data, error } = await supabase
      .from('students')
      .update({ projects })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding student project:', error);
    throw error;
  }
};

export const updateStudentProject = async (userId, projectIndex, updates) => {
  try {
    // First get current projects
    const { data: currentData, error: fetchError } = await supabase
      .from('students')
      .select('projects')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Make sure projects array exists and the index is valid
    if (!currentData?.projects || !Array.isArray(currentData.projects) || projectIndex >= currentData.projects.length) {
      throw new Error('Project not found');
    }
    
    // Update the specific project
    const projects = [...currentData.projects];
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates
    };
    
    // Update student record with modified projects array
    const { data, error } = await supabase
      .from('students')
      .update({ projects })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating student project:', error);
    throw error;
  }
};

export const deleteStudentProject = async (userId, projectIndex) => {
  try {
    // First get current projects
    const { data: currentData, error: fetchError } = await supabase
      .from('students')
      .select('projects')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Make sure projects array exists and the index is valid
    if (!currentData?.projects || !Array.isArray(currentData.projects) || projectIndex >= currentData.projects.length) {
      throw new Error('Project not found');
    }
    
    // Remove the specific project
    const projects = currentData.projects.filter((_, index) => index !== projectIndex);
    
    // Update student record with modified projects array
    const { data, error } = await supabase
      .from('students')
      .update({ projects })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting student project:', error);
    throw error;
  }
};

export const verifyStudentExists = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error verifying student existence:', error);
      return { 
        exists: false, 
        error: error.message 
      };
    }

    return { 
      exists: !!data, 
      studentId: data?.id,
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error verifying student:', error);
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};