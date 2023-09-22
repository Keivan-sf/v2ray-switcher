const root_dir = { path: "" };

export function getRootDir() {
    return root_dir.path;
}

export function setRootDir(path: string) {
    root_dir.path = path;
}
