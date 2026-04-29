export const SkillCategory = {
  Language: "language",
  Framework: "framework",
  Database: "database",
  OperatingSystem: "operating_system",
  ServerOs: "server_os",
  CloudService: "cloud_service",
  Tool: "tool",
  WebServer: "web_server",
  ApplicationServer: "application_server",
  Middleware: "middleware",
  Other: "other",
} as const;

export const skillCategoryValues = [
  SkillCategory.Language,
  SkillCategory.Framework,
  SkillCategory.Database,
  SkillCategory.OperatingSystem,
  SkillCategory.ServerOs,
  SkillCategory.CloudService,
  SkillCategory.Tool,
  SkillCategory.WebServer,
  SkillCategory.ApplicationServer,
  SkillCategory.Middleware,
  SkillCategory.Other,
] as const;

export type SkillCategory = (typeof skillCategoryValues)[number];

export const skillCategoryLabels: Record<SkillCategory, string> = {
  [SkillCategory.Language]: "言語",
  [SkillCategory.Framework]: "フレームワーク",
  [SkillCategory.Database]: "データベース",
  [SkillCategory.OperatingSystem]: "OS",
  [SkillCategory.ServerOs]: "サーバーOS",
  [SkillCategory.CloudService]: "クラウドサービス",
  [SkillCategory.Tool]: "ツール",
  [SkillCategory.WebServer]: "Webサーバー",
  [SkillCategory.ApplicationServer]: "APサーバー",
  [SkillCategory.Middleware]: "ミドルウェア",
  [SkillCategory.Other]: "その他",
};
