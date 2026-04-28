import { db, pool } from "../src/db/client.js";
import { skillOptionAliases, skillOptions } from "../src/db/schema.js";

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
    category: "language",
    name: "JavaScript",
    normalizedName: "javascript",
    aliases: ["JS", "Javascript"],
    sortOrder: 10,
  },
  {
    category: "language",
    name: "TypeScript",
    normalizedName: "typescript",
    aliases: ["TS"],
    sortOrder: 20,
  },
  {
    category: "language",
    name: "HTML",
    normalizedName: "html",
    sortOrder: 30,
  },
  {
    category: "language",
    name: "CSS",
    normalizedName: "css",
    sortOrder: 40,
  },
  {
    category: "language",
    name: "PHP",
    normalizedName: "php",
    sortOrder: 50,
  },
  {
    category: "language",
    name: "Python",
    normalizedName: "python",
    sortOrder: 60,
  },
  {
    category: "language",
    name: "Java",
    normalizedName: "java",
    sortOrder: 70,
  },

  // ----------------------------------------
  // Frameworks
  // ----------------------------------------
  {
    category: "framework",
    name: "Vue.js",
    normalizedName: "vue",
    aliases: ["Vue", "VueJS", "Vue.js"],
    sortOrder: 10,
  },
  {
    category: "framework",
    name: "Nuxt",
    normalizedName: "nuxt",
    aliases: ["Nuxt.js", "NuxtJS"],
    sortOrder: 20,
  },
  {
    category: "framework",
    name: "React",
    normalizedName: "react",
    aliases: ["React.js", "ReactJS"],
    sortOrder: 30,
  },
  {
    category: "framework",
    name: "Next.js",
    normalizedName: "next",
    aliases: ["Next", "NextJS"],
    sortOrder: 40,
  },
  {
    category: "framework",
    name: "Laravel",
    normalizedName: "laravel",
    sortOrder: 50,
  },
  {
    category: "framework",
    name: "Hono",
    normalizedName: "hono",
    sortOrder: 60,
  },
  {
    category: "framework",
    name: "Express",
    normalizedName: "express",
    aliases: ["Express.js"],
    sortOrder: 70,
  },

  // ----------------------------------------
  // Databases
  // ----------------------------------------
  {
    category: "database",
    name: "PostgreSQL",
    normalizedName: "postgresql",
    aliases: ["Postgres"],
    sortOrder: 10,
  },
  {
    category: "database",
    name: "MySQL",
    normalizedName: "mysql",
    sortOrder: 20,
  },
  {
    category: "database",
    name: "SQLite",
    normalizedName: "sqlite",
    sortOrder: 30,
  },
  {
    category: "database",
    name: "Redis",
    normalizedName: "redis",
    sortOrder: 40,
  },

  // ----------------------------------------
  // Operating Systems
  // ----------------------------------------
  {
    category: "operating_system",
    name: "Linux",
    normalizedName: "linux",
    sortOrder: 10,
  },
  {
    category: "operating_system",
    name: "Windows",
    normalizedName: "windows",
    sortOrder: 20,
  },
  {
    category: "operating_system",
    name: "macOS",
    normalizedName: "macos",
    aliases: ["Mac OS", "MacOS"],
    sortOrder: 30,
  },

  // ----------------------------------------
  // Server OS
  // ----------------------------------------
  {
    category: "server_os",
    name: "Amazon Linux",
    normalizedName: "amazon_linux",
    sortOrder: 10,
  },
  {
    category: "server_os",
    name: "Ubuntu",
    normalizedName: "ubuntu",
    sortOrder: 20,
  },
  {
    category: "server_os",
    name: "Debian",
    normalizedName: "debian",
    sortOrder: 30,
  },
  {
    category: "server_os",
    name: "CentOS",
    normalizedName: "centos",
    sortOrder: 40,
  },
  {
    category: "server_os",
    name: "Red Hat Enterprise Linux",
    normalizedName: "rhel",
    aliases: ["RHEL"],
    sortOrder: 50,
  },

  // ----------------------------------------
  // Cloud Services
  // ----------------------------------------
  {
    category: "cloud_service",
    name: "AWS",
    normalizedName: "aws",
    aliases: ["Amazon Web Services"],
    sortOrder: 10,
  },
  {
    category: "cloud_service",
    name: "Google Cloud",
    normalizedName: "google_cloud",
    aliases: ["GCP", "Google Cloud Platform"],
    sortOrder: 20,
  },
  {
    category: "cloud_service",
    name: "Azure",
    normalizedName: "azure",
    aliases: ["Microsoft Azure"],
    sortOrder: 30,
  },
  {
    category: "cloud_service",
    name: "Cloudflare",
    normalizedName: "cloudflare",
    sortOrder: 40,
  },

  // ----------------------------------------
  // Tools
  // ----------------------------------------
  {
    category: "tool",
    name: "Git",
    normalizedName: "git",
    sortOrder: 10,
  },
  {
    category: "tool",
    name: "GitHub",
    normalizedName: "github",
    sortOrder: 20,
  },
  {
    category: "tool",
    name: "GitLab",
    normalizedName: "gitlab",
    sortOrder: 30,
  },
  {
    category: "tool",
    name: "Docker",
    normalizedName: "docker",
    sortOrder: 40,
  },
  {
    category: "tool",
    name: "Docker Compose",
    normalizedName: "docker_compose",
    sortOrder: 50,
  },
  {
    category: "tool",
    name: "VS Code",
    normalizedName: "vscode",
    aliases: ["Visual Studio Code"],
    sortOrder: 60,
  },
  {
    category: "tool",
    name: "Slack",
    normalizedName: "slack",
    sortOrder: 70,
  },
  {
    category: "tool",
    name: "Backlog",
    normalizedName: "backlog",
    sortOrder: 80,
  },

  // ----------------------------------------
  // Web Servers
  // ----------------------------------------
  {
    category: "web_server",
    name: "Nginx",
    normalizedName: "nginx",
    sortOrder: 10,
  },
  {
    category: "web_server",
    name: "Apache",
    normalizedName: "apache",
    aliases: ["Apache HTTP Server"],
    sortOrder: 20,
  },

  // ----------------------------------------
  // Application Servers
  // ----------------------------------------
  {
    category: "application_server",
    name: "Node.js",
    normalizedName: "nodejs",
    aliases: ["Node", "NodeJS"],
    sortOrder: 10,
  },
  {
    category: "application_server",
    name: "Tomcat",
    normalizedName: "tomcat",
    aliases: ["Apache Tomcat"],
    sortOrder: 20,
  },

  // ----------------------------------------
  // Middleware
  // ----------------------------------------
  {
    category: "middleware",
    name: "Elasticsearch",
    normalizedName: "elasticsearch",
    sortOrder: 10,
  },
  {
    category: "middleware",
    name: "RabbitMQ",
    normalizedName: "rabbitmq",
    sortOrder: 20,
  },
];

function normalizeAliasName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(".", "")
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
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
