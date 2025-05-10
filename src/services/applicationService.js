import React from 'react';
import { supabase } from '@/lib/supabase';

export const getApplicationsByInternship = async (internshipId) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      students (
        id,
        full_name,
        university,
        department,
        avatar_url
      )
    `)
    .eq('internship_id', internshipId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getApplicationsByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      internships (
        id,
        title,
        type,
        location,
        companies (
          id,
          name,
          logo_url
        )
      )
    `)
    .eq('student_id', studentId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      ...applicationData,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateApplicationStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteApplication = async (id) => {
  const { error } = await supabase.from('applications').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};