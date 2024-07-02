import { TokenFile } from "../files";
import { curl } from "../commands";

export function getFreshAccessToken(
    client_id: string,
    client_secret: string,
    refresh_token: string
): TokenFile {
    // const params = {
    //     client_id,
    //     client_secret,
    //     grant_type: "refresh_token",
    //     refresh_token,
    // };

    const endpoint = `https://oauth2.googleapis.com/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`;
    const stdout = curl(endpoint, { method: "POST" });

    const credentials = JSON.parse(stdout);
    credentials["refresh_token"] = refresh_token;
    return credentials as TokenFile;
}
