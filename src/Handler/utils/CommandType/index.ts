export interface Command {
    execute(): void;
    command: string;
}

export class SingleCommand implements Command {
    constructor(private handler: () => void, public command: string) {}
    execute(): void {
        this.handler();
    }
}

export class CommandWithArgs implements Command {
    constructor(
        private handler: (args: string[]) => void,
        public command: string,
        public args: string[]
    ) {}
    execute(): void {
        this.handler(this.args);
    }
}
