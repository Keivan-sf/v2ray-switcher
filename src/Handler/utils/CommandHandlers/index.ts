import { commandsWithArgs, singleCommands } from "./commands";

class SingleCommandHandler {
    static start() {
        console.log("start command triggered");
    }
}

class CommandWithArgsHandler {
    static add(args: string[]) {
        console.log("Add command triggered with args: ", args);
    }
}

export const singleCommandHandlers: Record<
    typeof singleCommands[number],
    () => void
> = {
    start: SingleCommandHandler.start,
};

export const commandWithArgsHandlers: Record<
    typeof commandsWithArgs[number],
    (args: string[]) => void
> = {
    add: CommandWithArgsHandler.add,
};
