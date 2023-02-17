import {
    singleCommandHandlers,
    commandWithArgsHandlers,
} from "./utils/CommandHandlers";
import {
    commandsWithArgs,
    singleCommands,
} from "./utils/CommandHandlers/commands";
import { CommandWithArgs, SingleCommand, Command } from "./utils/CommandType";

class CommandHandler {
    static onMessage(data: Buffer) {
        try {
            const command = CommandHandler.getExecutableCommand(data);
            command.execute();
        } catch (err: any) {
            console.log(err.message);
        }
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
        const validCommand = CommandHandler.validateSingleCommand(command);
        return singleCommandHandlers[validCommand];
    }
    private static getCommandWithArgsHandler(command: string) {
        const validCommand = CommandHandler.validateCommandWithArgs(command);
        return commandWithArgsHandlers[validCommand];
    }
    private static validateSingleCommand(
        command: string
    ): typeof singleCommands[number] {
        const validCommand: typeof singleCommands[number] = command as any;
        if (!singleCommands.includes(validCommand))
            throw new Error("Invalid command");
        return validCommand;
    }
    private static validateCommandWithArgs(command: string) {
        const validCommand: typeof commandsWithArgs[number] = command as any;
        if (!commandsWithArgs.includes(validCommand))
            throw new Error("Invalid command");
        return validCommand;
    }
}

export { CommandHandler };
