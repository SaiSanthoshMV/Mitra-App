// components/LinksListClient.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Link = { id: number; title: string; url: string; category?: string | null; created_at?: string | null; description?: string | null; };

export default function LinksListClient() {
  const [links, setLinks] = useState<Link[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase.from('links').select('*').order('id', { ascending: true });
      if (!mounted) return;
      setLoading(false);
      if (error) setError(error.message);
      else setLinks(data);
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <ul className="space-y-2">
      {links?.map((l) => (
        <li key={l.id}>
          <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            {l.title}
          </a>
          {/* {l.description && <div className="text-sm text-gray-600">{l.description}</div>} */}
        </li>
      ))}
    </ul>
  );
}
