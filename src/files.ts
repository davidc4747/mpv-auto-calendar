import { writeFile } from "./helpers";

/* ======================== *\
    #token.json
\* ======================== */

export type TokenFile = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;

    // There are other types here, i just don't any of them.
    //      this is coming from google [DC]
    token_type: "Bearer";
};

export function readTokenFile(): TokenFile {
    const dirname = mp.get_script_directory();
    const filename = mp.utils.join_path(dirname, "data/token.json");
    const text = mp.utils.read_file(filename);
    return JSON.parse(text) as TokenFile;
}

export function saveToken(tokenInfo: TokenFile): void {
    const dirname = mp.get_script_directory();
    const filename = mp.utils.join_path(dirname, "data/token.json");
    writeFile(filename, JSON.stringify(tokenInfo));
}

/* ======================== *\
    #credentials.json
\* ======================== */

type CredentialsFile = {
    client_id: string;
    client_secret: string;
};

export function readCredentialsFile(): CredentialsFile {
    const dirname = mp.get_script_directory();
    const filename = mp.utils.join_path(dirname, "credentials.json");
    const text = mp.utils.read_file(filename);
    return JSON.parse(text) as CredentialsFile;
}
