import { createServerSupabase } from '@/lib/supabaseServer';
import LinksPage from './LinksPageClient'; // Import the client component

type Link = {
  id: number;
  title: string;
  url: string;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
};

type PasswordInfo = {
  id: number;
  title: string;
  description: string;
};

export default async function LinksPageServer() {
  const supabase = createServerSupabase();
  
  // Fetch links
  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('id,title,url,category,created_at,description')
    .eq('category', 'college')
    .order('id', { ascending: true });

  // Fetch password info
  const { data: passwordInfo, error: passwordError } = await supabase
    .from('info')
    .select('id,title,description')
    .order('id', { ascending: true });

  if (linksError) {
    return <div className="text-red-500">Error loading links: {linksError.message}</div>;
  }

  if (passwordError) {
    return <div className="text-red-500">Error loading password info: {passwordError.message}</div>;
  }

  return (
    <LinksPage 
      links={links || []} 
      passwordInfo={passwordInfo || []} 
    />
  );
}