export const ProjectRole = {
  Leader: "leader",
  Member: "member",
  Other: "other",
} as const;

export const projectRoleValues = [
  ProjectRole.Leader,
  ProjectRole.Member,
  ProjectRole.Other,
] as const;

export type ProjectRoleValue = (typeof projectRoleValues)[number];

export const projectRoleLabels: Record<ProjectRoleValue, string> = {
  [ProjectRole.Leader]: "リーダー",
  [ProjectRole.Member]: "メンバー",
  [ProjectRole.Other]: "その他",
};
