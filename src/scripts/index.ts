import { seedAdmin } from "./seedAdmin";
import { seedGoogleAccount } from "./seedGoogleAccount";


async function main() {
    await seedAdmin();
    await seedGoogleAccount();
}

main()
    .then(() => {
        console.log("Seeding completed");
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });