import { supabase } from '../lib/supabase';

export async function assignUserRole(userId, newRole) {
  try {
    const { data, error } = await supabase.rpc('assign_user_role', {
      user_id: userId,
      new_role: newRole
    });

    if (error) throw error;

    console.log('Role assigned successfully');
    return true;
  } catch (error) {
    console.error('Error assigning role:', error.message);
    return false;
  }
}