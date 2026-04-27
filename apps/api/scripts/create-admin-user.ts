import { auth } from "../src/auth/auth.js";
import { pool } from "../src/db/client.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Admin";

if (!email) {
  console.error("ADMIN_EMAIL is required");
  process.exit(1);
}

if (!password) {
  console.error("ADMIN_PASSWORD is required");
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters");
  process.exit(1);
}

try {
  const result = await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role: "admin",
    },
  });

  console.log("Admin user created:");
  console.log({
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
  });
} catch (error) {
  console.error("Failed to create admin user");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
