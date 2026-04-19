import { seedDatabase } from './data';

async function runSeed() {
    console.log("Starting seed...");
    try {
        await seedDatabase();
        console.log("Seed completed successfully.");
    } catch (e) {
        console.error("Seed failed:", e);
    }
    process.exit(0);
}

runSeed();
