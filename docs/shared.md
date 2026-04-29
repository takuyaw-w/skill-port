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

```ts
import { SkillCategory, ProjectPhase } from "@skill-port/shared";
import type { SkillCategoryValue, ProjectPhaseValue } from "@skill-port/shared";
```
