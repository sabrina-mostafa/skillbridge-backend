import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { createServer, initializeSocket } from "./socket/socket";


const port = Number(env.PORT);

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        const httpServer = createServer(app);

        initializeSocket(httpServer);

        httpServer.listen(port, () => {
            console.log(
                `Server is running on http://localhost:${port}`
            );
        });

        // app.listen(port, () => {
        //     console.log(`Server is running on http://localhost:${port}`);
        // });

    } catch (error) {
        console.error("Startup error:", error);
        process.exit(1);
    }
}

main();

process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Shutting down...");
    await prisma.$disconnect();
    process.exit(0);
});