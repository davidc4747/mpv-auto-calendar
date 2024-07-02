/* ======================== *\
    #Helpers
\* ======================== */

export function normalizePath(path: string): string {
    // NOTE: realistically you're suppose to do Some OS checks in here [DC]
    return path.replace("\\", "/");
}

export function writeFile(filename: string, content: string): void {
    mp.utils.write_file("file://" + normalizePath(filename), content);
}

export function writeTestFile(data: any): void {
    const dirname = mp.get_script_directory();
    const filename = mp.utils.join_path(dirname, "data/test.json");
    writeFile(normalizePath(filename), data);
}
