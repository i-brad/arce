import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, the Next.js internals
     * and the data/account APIs (which do their own session checks and
     * return 401 instead of a redirect).
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|api/data|api/account|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|ttf)$).*)",
  ],
};
