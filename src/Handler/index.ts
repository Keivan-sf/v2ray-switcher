class CommandHandler {
    static onMessage(data: Buffer) {
        console.log(data.toString());
    }
}

export { CommandHandler };
