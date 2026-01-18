type SupabaseConfig = {
  url: string;
  key: string;
};

const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
} as const;

type EnvKey = keyof typeof ENV;

function getEnvValue(name: EnvKey): string {
  const value = ENV[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: getEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    key: getEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"),
  };
}
