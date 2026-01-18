import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPage } from "@/components/auth/LoginPage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SITE_URL = "https://3brothers.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Log In | 3BROTHERS NETWORK",
  description: "Sign in with your email or continue with Google to access 3brothers.",
  alternates: {
    canonical: `${SITE_URL}/login`,
    languages: {
      en: `${SITE_URL}/en/login`,
      vi: `${SITE_URL}/vi/login`,
    },
  },
  openGraph: {
    title: "Log In | 3BROTHERS NETWORK",
    description: "Choose email or Google to sign in to your 3brothers account.",
    url: `${SITE_URL}/login`,
    type: "website",
    images: [
      {
        url: "/3brothers.png",
        alt: "3BROTHERS NETWORK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Log In | 3BROTHERS NETWORK",
    description: "Choose email or Google to sign in to your 3brothers account.",
    images: ["/3brothers.png"],
  },
};

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

function getSafeRedirectPath(nextParam?: string) {
  if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
    return nextParam;
  }

  return "/admin";
}

export default async function Login({ searchParams }: LoginPageProps) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const next = getSafeRedirectPath(resolvedSearchParams?.next);

  if (data.user) {
    redirect(next);
  }

  return <LoginPage />;
}
