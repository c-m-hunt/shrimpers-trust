import { auth0 } from "../lib/auth0";

const namespace = "https://shrimperstrust.co.uk";

export const roles = {
  financeAdmin: "Shrimpers Trust Finance",
};

type RoleValue = (typeof roles)[keyof typeof roles];

export const hasRole = async (role: RoleValue) => {
  const session = await auth0.getSession();
  if (session && userHasRole(session.user, role)) {
    return true;
  }
  return false;
};

type User = NonNullable<Awaited<ReturnType<typeof auth0.getSession>>>['user'];

export const userHasRole = (user: User, role: RoleValue) => {
  const roles = user[`${namespace}/roles`];
  if (roles && Array.isArray(roles) && roles.includes(role)) {
    return true;
  }
  return false;
};
