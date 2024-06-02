import { sendEmail } from "@/actions/email";
import { sendNotification } from "@/actions/notifications";
import { NOTIFICATION_TYPE } from "@/hooks/use-notification";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next && next.length > 1) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      // send welcome to request network email
      if (data.user?.email && !data.user.user_metadata?.onboarded) {
        await sendNotification({
          type: NOTIFICATION_TYPE.SUCCESS,
          subject: "Welcome to Request Network!",
          content: `Your account has been created.`,
          fromUserId: data.user?.id,
          userNotifications: [data.user],
        });
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // return the user to an error page with instructions.
  // TODO: create this page under src/auth/oauth-error.tsx
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_DOMAIN}/auth/oauth-error`
  );
}
