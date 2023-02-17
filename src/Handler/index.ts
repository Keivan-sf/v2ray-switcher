class CommandHandler {
    static onMessage(data: Buffer) {
        console.log(CommandHandler.parseInput(data));
    }
    private static parseInput(message: Buffer) {
        return message.toString().trim().toLowerCase();
    }
}

export { CommandHandler };
