import fs from "fs";
import path from "path";
const configs_dir = path.join(__dirname, "..", "src/utils/Files/.configs");
const subscription_file = path.join(__dirname, "..", "subscriptions.txt");
if (!fs.existsSync(configs_dir)) fs.mkdirSync(configs_dir);
if (!fs.existsSync(subscription_file)) fs.writeFileSync(subscription_file, "");
console.log("Build finished successfully");
