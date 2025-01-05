import { Claims, getSession } from "@auth0/nextjs-auth0";

const namespace = "https://shrimperstrust.co.uk";

export const roles = {
  financeAdmin: "Shrimpers Trust Finance",
};

type RoleValue = (typeof roles)[keyof typeof roles];

export const hasRole = async (role: RoleValue) => {
  const session = await getSession();
  if (session && userHasRole(session.user, role)) {
    return Response.json({ user: session.user });
  }
};

export const userHasRole = (user: Claims, role: RoleValue) => {
  if (user[`${namespace}/roles`].includes(role)) {
    return true;
  }
};
