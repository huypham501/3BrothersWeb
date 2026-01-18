'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out failed', error);
      setIsSigningOut(false);
      return;
    }

    router.replace('/login');
    router.refresh();
  };

  return (
    <Button type="button" $variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
