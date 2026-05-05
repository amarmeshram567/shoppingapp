export const ADMIN_ROLES = {
  SUPER_ADMIN: "super_admin",
  MANAGER: "manager",
  STAFF: "staff",
  CUSTOMER: "customer"
};

export const PRIVILEGED_ADMIN_ROLES = [
  ADMIN_ROLES.SUPER_ADMIN,
  ADMIN_ROLES.MANAGER,
  ADMIN_ROLES.STAFF
];
