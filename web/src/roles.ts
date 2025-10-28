import { getSession } from "../lib/auth";

const namespace = "https://shrimperstrust.co.uk";

export const roles = {
  financeAdmin: "finance",
};

type RoleValue = (typeof roles)[keyof typeof roles];

export const hasRole = async (role: RoleValue) => {
  const session = await getSession();
  if (session && userHasRole(session.user, role)) {
    return true;
  }
  return false;
};

type User = NonNullable<Awaited<ReturnType<typeof getSession>>>["user"];

export const userHasRole = (user: User, role: RoleValue) => {
  const roles = user[`${namespace}/roles`];
  if (roles && Array.isArray(roles) && roles.includes(role)) {
    return true;
  }
  return false;
};
