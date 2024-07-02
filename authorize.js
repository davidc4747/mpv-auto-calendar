const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

/* ======================== *\
    # Init
\* ======================== */

(async function () {
    const file = await fs.readFile(
        path.join(__dirname, "data/credentials.json"),
        {
            encoding: "utf-8",
        }
    );

    const { client_id, client_secret, calendar_id } = JSON.parse(file);
    const token_info = await authorize(client_id, client_secret);
    console.log("\n");
    console.log(token_info);
    fs.writeFile(
        path.join(__dirname, "data/token.json"),
        JSON.stringify(token_info)
    );
})();

/* ======================== *\
    #Get Authorization Token
\* ======================== */

async function authorize(client_id, client_secret) {
    const PORT = 5173;
    const REDIRECT = `http://localhost:${PORT}`;

    // Open the default browser to google Authorizatoin screen
    // NOTE: 'start' comand only works for windows [DC]
    const endpoint = getAuthorizationEndpoint(client_id, REDIRECT);
    console.log(endpoint);
    openBrowerOnWindows(endpoint);

    // Wait for user to finish consent form
    const code = await waitForAuthorizationCode(PORT);

    // use the code that you get off the redirect to request the access_token
    const credentials = await exchangeCode(
        client_id,
        client_secret,
        REDIRECT,
        code
    );

    // return the token
    return credentials;
}

function getAuthorizationEndpoint(client_id, redirect_uri) {
    const scopes = [
        "https://www.googleapis.com/auth/calendar",
        // "https://www.googleapis.com/auth/calendar.app.created",
        // "https://www.googleapis.com/auth/calendar.events.owned",
    ];

    const params = {
        scope: scopes.join(" "),
        response_type: "code",
        access_type: "offline",
        redirect_uri,
        client_id,
    };

    const endpoint =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

    return endpoint;
}

function openBrowerOnWindows(url) {
    const powershell = `${
        process.env.SYSTEMROOT || process.env.windir || "C:\\Windows"
    }\\System32\\WindowsPowerShell\\v1.0\\powershell`;
    spawn(powershell, ["Start", `"${url}"`]);
}

async function waitForAuthorizationCode(port) {
    return new Promise(function (resolve, reject) {
        // Create a local server to receive 'code' from google
        const server = http.createServer((req, res) => {
            // Send back a nice message
            res.statusCode = 200;
            res.end("Google Authorization completed :)");

            // Terminate the server
            server.close().closeAllConnections();

            // Parse & return the 'code'
            const url = new URL(req.url, `http://localhost:${port}`);
            resolve(url.searchParams.get("code"));
        });
        server.listen(port);
    });
}

async function exchangeCode(client_id, client_secret, redirect_uri, code) {
    const params = {
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code",
        redirect_uri,
    };

    const endpoint =
        "https://oauth2.googleapis.com/token?" +
        Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

    const res = await fetch(endpoint, { method: "POST" });
    const credentials = await res.json();
    return credentials;
}
