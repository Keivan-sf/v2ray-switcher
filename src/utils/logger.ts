import { getConfig } from "./configParser";

export const log = {
    normal: (...msg: any[]) => {
        console.log(...msg);
    },

    verbose: (...msg: any[]) => {
        if (getConfig().logLevel < 2) return;
        console.log(...msg);
    },
};

export const exitWithError = (error: any) => {
    console.log("Error:", error);
    process.exit(0);
};

export const warn = (warning: any) => {
    console.log("Warning:", warning);
};
