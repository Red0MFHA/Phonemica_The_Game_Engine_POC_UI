import type { Role } from "@/types/engine";

export type PermissionAction =
  | "users.manage"
  | "settings.write"
  | "settings.read"
  | "games.register"
  | "games.configure"
  | "exercises.write"
  | "content.write"
  | "children.list"
  | "children.create"
  | "children.edit_personal"
  | "children.edit_therapy"
  | "children.assess"
  | "children.assign_games"
  | "analytics.org"
  | "analytics.child"
  | "skin.launch";

const MATRIX: Record<PermissionAction, Role[]> = {
  "users.manage": ["admin"],
  "settings.write": ["admin"],
  "settings.read": ["admin", "therapist"],
  "games.register": ["admin"],
  "games.configure": ["admin"],
  "exercises.write": ["admin", "therapist"],
  "content.write": ["admin", "therapist"],
  "children.list": ["admin", "therapist", "parent"],
  "children.create": ["admin", "therapist", "parent"],
  "children.edit_personal": ["admin"],
  "children.edit_therapy": ["admin", "therapist"],
  "children.assess": ["admin", "therapist"],
  "children.assign_games": ["admin", "therapist"],
  "analytics.org": ["admin", "therapist"],
  "analytics.child": ["admin", "therapist", "parent"],
  "skin.launch": ["admin", "therapist", "parent"],
};

export function can(role: Role | string | undefined, action: PermissionAction): boolean {
  if (!role) return false;
  return MATRIX[action]?.includes(role as Role) ?? false;
}

/** Route allow-list. Longest prefix wins conceptually via startsWith checks below. */
const ROUTE_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/users", roles: ["admin"] },
  { prefix: "/settings", roles: ["admin", "therapist"] },
  { prefix: "/games", roles: ["admin", "therapist", "parent"] }, // parent read-only in UI
  { prefix: "/exercises", roles: ["admin", "therapist"] },
  { prefix: "/content", roles: ["admin", "therapist"] },
  { prefix: "/analytics", roles: ["admin", "therapist"] },
  { prefix: "/children", roles: ["admin", "therapist", "parent"] },
  { prefix: "/dashboard", roles: ["admin", "therapist", "parent"] },
];

export function canAccessRoute(role: Role | string | undefined, path: string): boolean {
  if (!role) return false;
  const r = role as Role;
  const rule = ROUTE_RULES.find((x) => path === x.prefix || path.startsWith(`${x.prefix}/`));
  if (!rule) return true;
  return rule.roles.includes(r);
}

export function homeForRole(role: Role): string {
  return "/dashboard";
}
