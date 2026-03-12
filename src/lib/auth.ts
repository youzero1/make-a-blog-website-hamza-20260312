import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = 'authenticated';

export function checkAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SESSION_VALUE;
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export { SESSION_COOKIE, SESSION_VALUE };
