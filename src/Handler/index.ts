import {
    singleCommandHandlers,
    commandWithArgsHandlers,
} from "./utils/CommandHandlers";
import { CommandWithArgs, SingleCommand, Command } from "./utils/CommandType";

class CommandHandler {
    static onMessage(data: Buffer) {
        const command = CommandHandler.getExecutableCommand(data);
        command.execute();
    }
    private static getExecutableCommand(userInput: Buffer) {
        const parsedInput = CommandHandler.parseInput(userInput);
        return CommandHandler.convertToCommandType(parsedInput);
    }
    private static parseInput(userInput: Buffer) {
        return userInput.toString().trim().toLowerCase();
    }
    private static convertToCommandType(userInput: string): Command {
        const args = userInput.split(" ");
        const command = args.shift()!;
        if (args.length < 1) {
            const handler = CommandHandler.getSingleCommandHandler(command);
            return new SingleCommand(handler, command);
        } else {
            const handler = CommandHandler.getCommandWithArgsHandler(command);
            return new CommandWithArgs(handler, command, args);
        }
    }
    private static getSingleCommandHandler(command: string) {
        return singleCommandHandlers[command];
    }
    private static getCommandWithArgsHandler(command: string) {
        return commandWithArgsHandlers[command];
    }
}

export { CommandHandler };
