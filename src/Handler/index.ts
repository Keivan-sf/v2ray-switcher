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
        const execute: () => void = () => {
            console.log("test");
        };
        if (args.length < 1) return new SingleCommand(execute, command);
        return new CommandWithArgs(execute, command, args);
    }
}

export { CommandHandler };
