import { NextRequest, NextResponse } from 'next/server';
import { accessTokenKey } from './lib/constants';
import { ROUTES } from './navigation/sidebar/routes';

export function proxy(req: NextRequest) {
  const token = req.cookies.get(accessTokenKey)?.value;
  const { pathname, search, searchParams } = req.nextUrl;
  const isAuthPath = pathname.startsWith('/auth');

  const makeURL = (path: string) => new URL(path, req.url);

  if (!token) {
    if (isAuthPath) return NextResponse.next();
    const url = makeURL(ROUTES.auth.login);

    if (pathname !== '/') url.searchParams.set('callbackUrl', pathname + search);

    return NextResponse.redirect(url);
  }

  if (isAuthPath) return NextResponse.redirect(makeURL(ROUTES.dashboard));

  const cb = searchParams.get('callbackUrl');
  if (cb) return NextResponse.redirect(makeURL(decodeURIComponent(cb)));

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
};
