import { addMissingStarterMenu, upsertAdmin } from "../src/bootstrap/firstRun.js";
import { prisma } from "../src/config/database.js";

// Manual re-run of the first-time setup: resets the admin password from .env
// and re-adds any starter menu items that are missing (existing items are left untouched).
async function main() {
  await upsertAdmin();
  await addMissingStarterMenu();
  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
