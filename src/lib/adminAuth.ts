// Admin authentication utilities

import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Cache for admin status to avoid repeated database calls
const adminCache = new Map<string, boolean>();

/**
 * Check if a user is an admin by querying the admins table
 * @param user - The user object from Supabase auth
 * @returns Promise<boolean> - true if the user is an admin, false otherwise
 */
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !user.id) {
    console.log('[isAdmin] No user or user.id');
    return false;
  }

  // Check cache first
  if (adminCache.has(user.id)) {
    console.log('[isAdmin] Cache hit:', adminCache.get(user.id));
    return adminCache.get(user.id)!;
  }

  try {
    console.log('[isAdmin] Checking database for user:', user.id, user.email);
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[isAdmin] Database error:', error);
      return false;
    }

    const isAdminUser = !!data;
    console.log('[isAdmin] Database result:', isAdminUser, data);
    adminCache.set(user.id, isAdminUser);
    return isAdminUser;
  } catch (error) {
    console.error('[isAdmin] Error checking admin status:', error);
    return false;
  }
};

/**
 * Check if a user has admin role (synchronous version for UI)
 * This checks user metadata for quick UI updates
 * @param user - The user object from Supabase auth
 * @returns boolean - true if the user has admin role in metadata, false otherwise
 */
export const hasAdminRole = (user: User | null): boolean => {
  if (!user) {
    return false;
  }

  // Check if user has admin role in metadata
  const userRole = user.user_metadata?.role || user.app_metadata?.role;
  return userRole === 'admin';
};

/**
 * Check if a user is an admin and update their metadata
 * This should be called after login to sync admin status
 * @param user - The user object from Supabase auth
 * @returns Promise<boolean> - true if the user is an admin, false otherwise
 */
export const syncAdminStatus = async (user: User | null): Promise<boolean> => {
  if (!user || !user.id) {
    return false;
  }

  try {
    const { data } = await supabase
      .from('admins')
      .select('id, role')
      .eq('user_id', user.id)
      .maybeSingle();

    // If no admin record found, user is not an admin
    if (!data) {
      adminCache.set(user.id, false);
      return false;
    }

    // Update cache
    adminCache.set(user.id, true);

    // Update user metadata with admin role if not already set
    const currentRole = user.user_metadata?.role;
    if (currentRole !== 'admin') {
      await supabase.auth.updateUser({
        data: { role: 'admin' }
      });
    }

    return true;
  } catch (error) {
    console.error('Error syncing admin status:', error);
    return false;
  }
};

/**
 * Clear the admin cache (useful when logging out)
 */
export const clearAdminCache = () => {
  adminCache.clear();
};

