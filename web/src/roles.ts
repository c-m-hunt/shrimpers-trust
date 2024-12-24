import { getSession } from "@auth0/nextjs-auth0";

const namespace = "https://shrimperstrust.co.uk";

export const roles = {
  financeAdmin: "Shrimpers Trust Finance",
};

type RoleValue = (typeof roles)[keyof typeof roles];

export const hasRole = async (role: RoleValue) => {
  const session = await getSession();
  if (session && session?.user[`${namespace}/roles`].includes(role)) {
    console.log(`Authed as ${role}`);
    return Response.json({ user: session.user });
  }
};
