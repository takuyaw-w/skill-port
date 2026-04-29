export const ProjectPhase = {
  RequirementsDefinition: "requirements_definition",
  BasicDesign: "basic_design",
  DetailedDesign: "detailed_design",
  Implementation: "implementation",
  UnitTest: "unit_test",
  IntegrationTest: "integration_test",
  SystemTest: "system_test",
  AcceptanceTest: "acceptance_test",
  Release: "release",
  OperationMaintenance: "operation_maintenance",
} as const;

export const projectPhaseValues = [
  ProjectPhase.RequirementsDefinition,
  ProjectPhase.BasicDesign,
  ProjectPhase.DetailedDesign,
  ProjectPhase.Implementation,
  ProjectPhase.UnitTest,
  ProjectPhase.IntegrationTest,
  ProjectPhase.SystemTest,
  ProjectPhase.AcceptanceTest,
  ProjectPhase.Release,
  ProjectPhase.OperationMaintenance,
] as const;

export type ProjectPhaseValue = (typeof projectPhaseValues)[number];

export const projectPhaseLabels: Record<ProjectPhaseValue, string> = {
  [ProjectPhase.RequirementsDefinition]: "要件定義",
  [ProjectPhase.BasicDesign]: "基本設計",
  [ProjectPhase.DetailedDesign]: "詳細設計",
  [ProjectPhase.Implementation]: "実装・構築",
  [ProjectPhase.UnitTest]: "単体テスト",
  [ProjectPhase.IntegrationTest]: "結合テスト",
  [ProjectPhase.SystemTest]: "総合テスト",
  [ProjectPhase.AcceptanceTest]: "受入テスト",
  [ProjectPhase.Release]: "リリース",
  [ProjectPhase.OperationMaintenance]: "運用・保守",
};
