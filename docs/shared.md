# Shared Package Usage

`@skill-port/shared` は、API とフロントエンドで共通利用する定数・型を配置するパッケージです。

## 目的

API と UI の間で、選択肢や固定値の不一致を防ぐために使用します。

対象例:

- 性別
- 従業員ステータス
- スキルカテゴリ
- プロジェクト上の役割
- 担当工程

## 基本方針

固定値は `apps/*` 配下に個別定義せず、原則として `@skill-port/shared` に集約します。

## 命名ルール

値オブジェクトは PascalCase で定義します。

例:

- `SkillCategory.Language`
- `ProjectPhase.Implementation`
- `EmployeeGender.Male`

値の union 型は `*Value` という名前にします。

例:

- `SkillCategoryValue`
- `ProjectPhaseValue`
- `EmployeeGenderValue`
- `EmployeeStatusValue`
- `ProjectRoleValue`

## 使い分け

値として使う場合:

    import { SkillCategory } from "@skill-port/shared";

    const category = SkillCategory.Language;

型として使う場合:

    import type { SkillCategoryValue } from "@skill-port/shared";

    type SkillOption = {
      category: SkillCategoryValue;
    };

値と型を同時に使う場合:

    import { SkillCategory } from "@skill-port/shared";
    import type { SkillCategoryValue } from "@skill-port/shared";

    type SkillOption = {
      category: SkillCategoryValue;
    };

    const defaultCategory = SkillCategory.Language;

## API 側の利用ルール

API 側では `apps/api/src/const/*` に再定義しません。

避ける import:

    import { SkillCategory } from "../const/skill-category.js";

推奨する import:

    import { SkillCategory } from "@skill-port/shared";
    import type { SkillCategoryValue } from "@skill-port/shared";

## Zod schema での利用

Zod の enum には shared の values 配列を使います。

    import { skillCategoryValues } from "@skill-port/shared";
    import { z } from "zod";

    const skillCategorySchema = z.enum(skillCategoryValues);

## 追加ルール

新しい固定値を追加する場合は、以下を同時に更新します。

1. `packages/shared/src/constants/*.ts`
2. `packages/shared/src/index.ts`
3. API の validation / seed / tests
4. 必要に応じて UI の選択肢表示

## 注意点

`@skill-port/shared` には、API の内部実装に依存する処理を置きません。

置いてよいもの:

- 定数
- label map
- union 型
- 軽量な純粋関数

置かないもの:

- DB schema
- repository
- service
- Hono / Nuxt に依存する処理
- 環境変数に依存する処理
