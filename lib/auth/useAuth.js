'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const getSession = async () => {
      try {
        const { data: { session: s }, error: e } = await supabase.auth.getSession();
        if (e) {
          setError(e);
          setSession(null);
        } else {
          setSession(s);
        }
      } catch (err) {
        setError(err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription?.unsubscribe();
  }, []);
  return { session, loading, error };
}
export function useUser() {
  const { session, loading, error } = useSession();
  const user = session?.user ?? null;
  return { user, session, loading, error };
}
export function useOrganization() {
  const { user, loading: userLoading, error: userError } = useUser();
  const [organizationId, setOrganizationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchOrganization = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setOrganizationId(null);
      setLoading(false);
      return;
    }
    try {
      const { data, error: e } = await supabase
        .from('organization_admins')
        .select('organization_id')
        .eq('auth_user_id', userId)
        .maybeSingle();
      if (e) {
        setError(e);
        setOrganizationId(null);
      } else {
        setOrganizationId(data?.organization_id ?? null);
      }
    } catch (err) {
      setError(err);
      setOrganizationId(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!user) {
      setOrganizationId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchOrganization(user.id);
  }, [user?.id, fetchOrganization]);
  const isLoading = userLoading || (!!user && loading);
  return {
    organizationId,
    loading: isLoading,
    error: error || userError,
    user,
  };
}
export function useAuthActions() {
  const router = useRouter();
  const signIn = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Sign-in is unavailable.');
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    return data;
  }, []);
  const signUp = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Sign-up is unavailable.');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }, []);
  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    router.push('/auth/login');
  }, [router]);
  return { signIn, signUp, signOut };
}