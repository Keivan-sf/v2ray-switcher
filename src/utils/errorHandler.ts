export const exitWithError = (error: any) => {
    console.log("Error:", error);
    process.exit(0);
};

export const warn = (warning: any) => {
    console.log("Warning:", warning);
};
