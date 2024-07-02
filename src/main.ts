import { curl } from "./commands";
import "./mpv";

/* ======================== *\
    #Pause/Play Event
\* ======================== */

// const FIVE_MINUTES = 300000;
const FIVE_MINUTES = 1;

let timer: number;
let startTime: Date | null = new Date();
let endTime: Date | null = new Date();
mp.observe_property(
    "pause",
    "bool",
    function (_name: string, isPaused: boolean) {
        clearTimeout(timer);
        if (!isPaused) {
            // Play
            if (startTime === null) startTime = new Date();
        } else {
            // Pause
            endTime = new Date();

            // if create a new Calendar event if Paused for some time
            timer = setTimeout(endTimer, FIVE_MINUTES);
        }
    }
);
mp.register_event("shutdown", endTimer);

function endTimer() {
    // send Google Calendar Request
    if (startTime && endTime) {
        const { calendar_id } = readCredentialsFile();
        const { access_token, refresh_token } = readTokenFile();

        createCalendarEvent(
            access_token,
            calendar_id,
            "Spanish Anime",
            startTime,
            endTime
        );
        mp.osd_message("Saving calendar event", 1);
    }

    // Reset timers
    startTime = null;
    endTime = null;
}

/* ======================== *\
    #Refresh Token
\* ======================== */

type TokenFile = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;

    // There are other types here, i just don't any of them.
    //      this is coming from google [DC]
    token_type: "Bearer";
};

function readTokenFile(): TokenFile {
    const dirname = mp.get_script_directory();
    const filename = mp.utils.join_path(dirname, "data/token.json");
    const text = mp.utils.read_file(filename);
    return JSON.parse(text) as TokenFile;
}

type CredentialsFile = {
    client_id: string;
    client_secret: string;
    calendar_id: string;
};

function readCredentialsFile(): CredentialsFile {
    const dirname = mp.get_script_directory();
    const filename = mp.utils.join_path(dirname, "data/credentials.json");
    const text = mp.utils.read_file(filename);
    return JSON.parse(text) as CredentialsFile;
}

// async function refreshToken(refresh_token) {
//     const params = {
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         grant_type: "refresh_token",
//         refresh_token,
//     };

//     const endpoint =
//         "https://oauth2.googleapis.com/token?" +
//         Object.entries(params)
//             .map(([key, value]) => `${key}=${value}`)
//             .join("&");

//     const res = await fetch(endpoint, { method: "POST" });
//     const credentials = await res.json();
//     return credentials;
// }

/* ======================== *\
    #Calendar API Calls
\* ======================== */

type CreateEventResponse = {
    created: string; // "2024-07-02T00:35:44.000Z";
    creator: { email: string };
    end: {
        dateTime: string; // "2024-07-02T00:35:45Z";
        timeZone: string; // "America/Los_Angeles";
    };
    etag: string; // '"3439761088710000"';
    eventType: string; // "default";
    htmlLink: string;
    iCalUID: string;
    id: string;
    kind: string; // "calendar#event";
    organizer: {
        displayName: string; // "TimeWise";
        email: string;
        self: boolean;
    };
    reminders: { useDefault: boolean };
    sequence: number;
    start: {
        dateTime: string; // "2024-07-02T00:35:43Z";
        timeZone: string; // "America/Los_Angeles";
    };
    status: "confirmed";
    summary: string; // "Spanish Anime";
    updated: string; // "2024-07-02T00:35:44.355Z";
};

function createCalendarEvent(
    accessToken: string,
    calendarID: string,
    summary: string,
    start: Date,
    end: Date
): CreateEventResponse {
    const stdout = curl(
        "https://www.googleapis.com/calendar/v3/calendars/" +
            calendarID +
            "/events",
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                summary: summary,
                start: { dateTime: start.toISOString() },
                end: { dateTime: end.toISOString() },
            },
        }
    );
    return JSON.parse(stdout) as CreateEventResponse;
}
