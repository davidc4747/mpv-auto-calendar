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
