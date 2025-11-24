// Admin authentication utilities

import { User } from '@supabase/supabase-js';

// Admin email addresses - in production, this should be stored in environment variables or database
const ADMIN_EMAILS = [
  'hadaa914@gmail.com',
  'admin@internsify.com'
];

/**
 * Check if a user is an admin
 * @param user - The user object from Supabase auth
 * @returns true if the user is an admin, false otherwise
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.email) {
    return false;
  }
  
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

/**
 * Check if a user has admin role from metadata
 * This is a more robust approach that checks user metadata
 * @param user - The user object from Supabase auth
 * @returns true if the user has admin role, false otherwise
 */
export const hasAdminRole = (user: User | null): boolean => {
  if (!user) {
    return false;
  }
  
  // Check if user has admin role in metadata
  const userRole = user.user_metadata?.role || user.app_metadata?.role;
  if (userRole === 'admin') {
    return true;
  }
  
  // Fallback to email check
  return isAdmin(user);
};

/**
 * Get admin credentials for login
 * This is for development/demo purposes only
 */
export const getAdminCredentials = () => {
  return {
    email: 'hadaa914@gmail.com',
    // In production, never expose credentials like this
    // This is just for demo purposes
  };
};

