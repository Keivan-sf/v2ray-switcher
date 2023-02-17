import { CommandHandler } from "./Handler";
process.stdin.on("data", CommandHandler.onMessage);
