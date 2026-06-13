import type { TeacherRole } from "./types";

export const ROLE_ORDER: TeacherRole[] = ["GPM", "GPICT", "DELIMA"];

export const ROLE_PORTAL_CARDS: {
  role: TeacherRole;
  href: string;
  className: string;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    role: "GPM",
    href: "/gpm",
    className: "portal-card portal-gpm",
    title: "GPM",
    subtitle: "Guru Perpustakaan dan Media",
    description: "Paparan berfokus untuk guru perpustakaan, media dan pusat sumber sekolah.",
  },
  {
    role: "GPICT",
    href: "/gpict",
    className: "portal-card portal-gpict",
    title: "GPICT",
    subtitle: "Guru Penyelaras ICT",
    description: "Paparan kemas untuk rujukan penyelaras ICT setiap sekolah.",
  },
  {
    role: "DELIMA",
    href: "/gpdelima",
    className: "portal-card portal-gpdelima",
    title: "GP DELIMa",
    subtitle: "Guru Penyelaras DELIMa",
    description: "Paparan khusus untuk penyelaras DELIMa dan pembelajaran digital.",
  },
];

export const ROLE_FORM_OPTIONS = ROLE_PORTAL_CARDS.map((card) => ({
  key: card.role,
  label: card.subtitle,
  short: card.title,
}));

export const EXPORT_ROLE_PRESETS: { label: string; value: string }[] = [
  { label: "GPM", value: "GPM" },
  { label: "GPICT", value: "GPICT" },
  { label: "GP DELIMa", value: "DELIMA" },
  { label: "GPM + GPICT", value: "GPM,GPICT" },
  { label: "GPM + GP DELIMa", value: "GPM,DELIMA" },
  { label: "GPICT + GP DELIMa", value: "GPICT,DELIMA" },
  { label: "Semua 3 Peranan", value: "GPM,GPICT,DELIMA" },
];

export function parseRoleParam(value: string | null | undefined): TeacherRole[] {
  const requested = String(value ?? "")
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  const roles = ROLE_ORDER.filter((role) => requested.includes(role));
  return roles.length > 0 ? roles : ROLE_ORDER;
}
