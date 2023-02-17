export interface Command {
    execute(): void;
    command: string;
}

export class SingleCommand implements Command {
    constructor(public execute: () => void, public command: string) {}
}

export class CommandWithArgs implements Command {
    constructor(
        public execute: () => void,
        public command: string,
        public args: string[]
    ) {}
}
