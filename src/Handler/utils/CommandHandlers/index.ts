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

export const singleCommandHandlers: Record<string, () => void> = {
    start: SingleCommandHandler.start,
};

export const commandWithArgsHandlers: Record<string, (args: string[]) => void> =
    {
        add: CommandWithArgsHandler.add,
    };
