import { createServerClient } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { HeroContent, HeroContentUpdate } from '../../types/hero';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
      },
    }
  );

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to fetch hero content: ${error.message}`);
      }

      if (!data) {
        return res.status(404).json({ error: 'Hero content not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching hero content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hero content';
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        return res.status(401).json({ error: 'Unauthorized: No valid session' });
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }

      if (!profileData || profileData.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const updateData: HeroContentUpdate = req.body;

      if (!updateData || typeof updateData !== 'object') {
        return res.status(400).json({ error: 'Invalid update data' });
      }

      const { data, error } = await supabase
        .from('hero_content')
        .update(updateData)
        .eq('id', 'default')
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update hero content: ${error.message}`);
      }

      if (!data) {
        return res.status(404).json({ error: 'Hero content not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error updating hero content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update hero content';
      return res.status(500).json({ error: errorMessage });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 