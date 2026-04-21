import Link from 'next/link';
import { SignOutButton } from '@/components/auth/SignOutButton';

export default function ForbiddenPage() {
  return (
    <main style={{ margin: '0 auto', maxWidth: 640, padding: '64px 24px' }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access CMS Admin.</p>
      <p>If you believe this is a mistake, contact an administrator to grant access.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
        <Link href="/">Back to Home</Link>
        <SignOutButton />
      </div>
    </main>
  );
}
