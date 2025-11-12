// SupportFlowCRM - Route Protection Middleware
export { default } from 'next-auth/middleware';

// Protect these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tickets/:path*',
    '/contacts/:path*',
    '/companies/:path*',
    '/communications/:path*',
    '/reports/:path*',
    '/settings/:path*',
  ],
};
