import React from 'react';
import { supabase } from '@/lib/supabase';

export const getInternships = async (filters) => {
  let query = supabase.from('internships').select(`
    *,
    companies (
      id,
      name,
      industry,
      location,
      logo_url
    )
  `);

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters?.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  if (filters?.companyId) {
    query = query.eq('company_id', filters.companyId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getInternshipById = async (id) => {
  const { data, error } = await supabase
    .from('internships')
    .select(`
      *,
      companies (
        id,
        name,
        industry,
        location,
        logo_url,
        website
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createInternship = async (internshipData) => {
  const { data, error } = await supabase
    .from('internships')
    .insert({
      ...internshipData,
      requirements: internshipData.requirements || [],
      responsibilities: internshipData.responsibilities || [],
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateInternship = async (id, updates) => {
  const { data, error } = await supabase
    .from('internships')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteInternship = async (id) => {
  const { error } = await supabase.from('internships').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};