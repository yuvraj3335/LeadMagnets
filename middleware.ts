// import { authMiddleware } from "@clerk/nextjs";


// // See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/account",
  "/api/lead-magnet",
  "/api/webhooks/stripe",
  "/api/lead-magnet/publish",
  "/api/lead-magnet/unpublish",
]);

export default clerkMiddleware(async (authPromise, req) => {
  const auth = await authPromise; // Await the resolved auth object

  if (!isPublicRoute(req)) {
    auth.protect(); // Now you can call the protect method
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
