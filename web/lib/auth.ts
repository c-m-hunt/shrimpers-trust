import { NextAuthOptions, Session } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: { params: { scope: "openid profile email offline_access" } },
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: (profile as any).sub || (profile as any).oid,
          name: (profile as any).name,
          email: (profile as any).email || (profile as any).preferred_username,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      const roles = (profile as any)?.roles || (profile as any)?.wids || (profile as any)?.groups;
      if (roles) {
        (token as JWT & { roles?: string[] }).roles = roles as any;
      }
      return token;
    },
    async session({ session, token }) {
      const namespace = "https://shrimperstrust.co.uk";
      const roles = (token as any).roles;
      if (roles) {
        (session.user as any)[`${namespace}/roles`] = roles;
      }
      return session as Session & { user: any };
    },
  },
};

export async function getSession() {
  const { getServerSession } = await import("next-auth");
  return getServerSession(authOptions);
}
