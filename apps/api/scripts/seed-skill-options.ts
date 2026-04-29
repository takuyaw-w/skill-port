import { db, pool } from "../src/db/client.js";
import { skillOptionAliases, skillOptions } from "../src/db/schema.js";
import { SkillCategory } from "@skill-port/shared";

type SkillOptionSeed = {
  category: string;
  name: string;
  normalizedName: string;
  aliases?: string[];
  description?: string;
  sortOrder?: number;
};

const skillOptionSeeds: SkillOptionSeed[] = [
  // ----------------------------------------
  // Languages
  // ----------------------------------------
  {
    category: SkillCategory.Language,
    name: "JavaScript",
    normalizedName: "javascript",
    aliases: ["JS", "Javascript"],
    sortOrder: 10,
  },
  {
    category: SkillCategory.Language,
    name: "TypeScript",
    normalizedName: "typescript",
    aliases: ["TS"],
    sortOrder: 20,
  },
  {
    category: SkillCategory.Language,
    name: "HTML",
    normalizedName: "html",
    sortOrder: 30,
  },
  {
    category: SkillCategory.Language,
    name: "CSS",
    normalizedName: "css",
    sortOrder: 40,
  },
  {
    category: SkillCategory.Language,
    name: "PHP",
    normalizedName: "php",
    sortOrder: 50,
  },
  {
    category: SkillCategory.Language,
    name: "Python",
    normalizedName: "python",
    sortOrder: 60,
  },
  {
    category: SkillCategory.Language,
    name: "Java",
    normalizedName: "java",
    sortOrder: 70,
  },

  // ----------------------------------------
  // Frameworks
  // ----------------------------------------
  {
    category: SkillCategory.Framework,
    name: "Vue.js",
    normalizedName: "vue",
    aliases: ["Vue", "VueJS", "Vue.js"],
    sortOrder: 10,
  },
  {
    category: SkillCategory.Framework,
    name: "Nuxt",
    normalizedName: "nuxt",
    aliases: ["Nuxt.js", "NuxtJS"],
    sortOrder: 20,
  },
  {
    category: SkillCategory.Framework,
    name: "React",
    normalizedName: "react",
    aliases: ["React.js", "ReactJS"],
    sortOrder: 30,
  },
  {
    category: SkillCategory.Framework,
    name: "Next.js",
    normalizedName: "next",
    aliases: ["Next", "NextJS"],
    sortOrder: 40,
  },
  {
    category: SkillCategory.Framework,
    name: "Laravel",
    normalizedName: "laravel",
    sortOrder: 50,
  },
  {
    category: SkillCategory.Framework,
    name: "Hono",
    normalizedName: "hono",
    sortOrder: 60,
  },
  {
    category: SkillCategory.Framework,
    name: "Express",
    normalizedName: "express",
    aliases: ["Express.js"],
    sortOrder: 70,
  },

  // ----------------------------------------
  // Databases
  // ----------------------------------------
  {
    category: SkillCategory.Database,
    name: "PostgreSQL",
    normalizedName: "postgresql",
    aliases: ["Postgres"],
    sortOrder: 10,
  },
  {
    category: SkillCategory.Database,
    name: "MySQL",
    normalizedName: "mysql",
    sortOrder: 20,
  },
  {
    category: SkillCategory.Database,
    name: "SQLite",
    normalizedName: "sqlite",
    sortOrder: 30,
  },
  {
    category: SkillCategory.Database,
    name: "Redis",
    normalizedName: "redis",
    sortOrder: 40,
  },

  // ----------------------------------------
  // Operating Systems
  // ----------------------------------------
  {
    category: SkillCategory.OperatingSystem,
    name: "Linux",
    normalizedName: "linux",
    sortOrder: 10,
  },
  {
    category: SkillCategory.OperatingSystem,
    name: "Windows",
    normalizedName: "windows",
    sortOrder: 20,
  },
  {
    category: SkillCategory.OperatingSystem,
    name: "macOS",
    normalizedName: "macos",
    aliases: ["Mac OS", "MacOS"],
    sortOrder: 30,
  },

  // ----------------------------------------
  // Server OS
  // ----------------------------------------
  {
    category: SkillCategory.ServerOs,
    name: "Amazon Linux",
    normalizedName: "amazon_linux",
    sortOrder: 10,
  },
  {
    category: SkillCategory.ServerOs,
    name: "Ubuntu",
    normalizedName: "ubuntu",
    sortOrder: 20,
  },
  {
    category: SkillCategory.ServerOs,
    name: "Debian",
    normalizedName: "debian",
    sortOrder: 30,
  },
  {
    category: SkillCategory.ServerOs,
    name: "CentOS",
    normalizedName: "centos",
    sortOrder: 40,
  },
  {
    category: SkillCategory.ServerOs,
    name: "Red Hat Enterprise Linux",
    normalizedName: "rhel",
    aliases: ["RHEL"],
    sortOrder: 50,
  },

  // ----------------------------------------
  // Cloud Services
  // ----------------------------------------
  {
    category: SkillCategory.CloudService,
    name: "AWS",
    normalizedName: "aws",
    aliases: ["Amazon Web Services"],
    sortOrder: 10,
  },
  {
    category: SkillCategory.CloudService,
    name: "Google Cloud",
    normalizedName: "google_cloud",
    aliases: ["GCP", "Google Cloud Platform"],
    sortOrder: 20,
  },
  {
    category: SkillCategory.CloudService,
    name: "Azure",
    normalizedName: "azure",
    aliases: ["Microsoft Azure"],
    sortOrder: 30,
  },
  {
    category: SkillCategory.CloudService,
    name: "Cloudflare",
    normalizedName: "cloudflare",
    sortOrder: 40,
  },

  // ----------------------------------------
  // Tools
  // ----------------------------------------
  {
    category: SkillCategory.Tool,
    name: "Git",
    normalizedName: "git",
    sortOrder: 10,
  },
  {
    category: SkillCategory.Tool,
    name: "GitHub",
    normalizedName: "github",
    sortOrder: 20,
  },
  {
    category: SkillCategory.Tool,
    name: "GitLab",
    normalizedName: "gitlab",
    sortOrder: 30,
  },
  {
    category: SkillCategory.Tool,
    name: "Docker",
    normalizedName: "docker",
    sortOrder: 40,
  },
  {
    category: SkillCategory.Tool,
    name: "Docker Compose",
    normalizedName: "docker_compose",
    sortOrder: 50,
  },
  {
    category: SkillCategory.Tool,
    name: "VS Code",
    normalizedName: "vscode",
    aliases: ["Visual Studio Code"],
    sortOrder: 60,
  },
  {
    category: SkillCategory.Tool,
    name: "Slack",
    normalizedName: "slack",
    sortOrder: 70,
  },
  {
    category: SkillCategory.Tool,
    name: "Backlog",
    normalizedName: "backlog",
    sortOrder: 80,
  },

  // ----------------------------------------
  // Web Servers
  // ----------------------------------------
  {
    category: SkillCategory.WebServer,
    name: "Nginx",
    normalizedName: "nginx",
    sortOrder: 10,
  },
  {
    category: SkillCategory.WebServer,
    name: "Apache",
    normalizedName: "apache",
    aliases: ["Apache HTTP Server"],
    sortOrder: 20,
  },

  // ----------------------------------------
  // Application Servers
  // ----------------------------------------
  {
    category: SkillCategory.ApplicationServer,
    name: "Node.js",
    normalizedName: "nodejs",
    aliases: ["Node", "NodeJS"],
    sortOrder: 10,
  },
  {
    category: SkillCategory.ApplicationServer,
    name: "Tomcat",
    normalizedName: "tomcat",
    aliases: ["Apache Tomcat"],
    sortOrder: 20,
  },

  // ----------------------------------------
  // Middleware
  // ----------------------------------------
  {
    category: SkillCategory.Middleware,
    name: "Elasticsearch",
    normalizedName: "elasticsearch",
    sortOrder: 10,
  },
  {
    category: SkillCategory.Middleware,
    name: "RabbitMQ",
    normalizedName: "rabbitmq",
    sortOrder: 20,
  },
];

function normalizeAliasName(value: string) {
  return value.trim().toLowerCase().replaceAll(".", "").replaceAll(" ", "_").replaceAll("-", "_");
}

async function upsertSkillOption(seed: SkillOptionSeed) {
  const [option] = await db
    .insert(skillOptions)
    .values({
      category: seed.category,
      name: seed.name,
      normalizedName: seed.normalizedName,
      description: seed.description,
      sortOrder: seed.sortOrder ?? 0,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: [skillOptions.category, skillOptions.normalizedName],
      set: {
        name: seed.name,
        description: seed.description,
        sortOrder: seed.sortOrder ?? 0,
        isActive: true,
        updatedAt: new Date(),
      },
    })
    .returning({
      id: skillOptions.id,
    });

  if (!option) {
    throw new Error(`Failed to upsert skill option: ${seed.category}:${seed.normalizedName}`);
  }

  return option;
}

async function seedAliases(skillOptionId: string, aliases: string[] = []) {
  for (const aliasName of aliases) {
    await db
      .insert(skillOptionAliases)
      .values({
        skillOptionId,
        aliasName,
        aliasNormalizedName: normalizeAliasName(aliasName),
      })
      .onConflictDoNothing({
        target: [skillOptionAliases.skillOptionId, skillOptionAliases.aliasNormalizedName],
      });
  }
}

async function main() {
  console.log("Seeding skill options...");

  for (const seed of skillOptionSeeds) {
    const option = await upsertSkillOption(seed);
    await seedAliases(option.id, seed.aliases);
  }

  console.log(`Seeded ${skillOptionSeeds.length} skill options.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed skill options.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
