import "./mpv";
import {
    readCredentialsFile,
    readTokenFile,
    saveToken,
    TokenFile,
} from "./files";
import { getFreshAccessToken } from "./google/token";
import { createCalendarEvent } from "./google/events";

/* ======================== *\
    #Handle refreshing token
\* ======================== */

let accessToken: string, calendarID: string;

let refreshTimer;
(function tick() {
    const { client_id, client_secret, calendar_id } = readCredentialsFile();
    const { refresh_token } = readTokenFile();

    // ping google for a new token
    const credentials = getFreshAccessToken(
        client_id,
        client_secret,
        refresh_token
    );

    // Update Global Variables
    accessToken = credentials.access_token;
    calendarID = calendar_id;

    // Save the new access_token to File
    saveToken(credentials as TokenFile);
    refreshTimer = setTimeout(tick, credentials.expires_in * 1000);
})();

/* ======================== *\
    #Handle Pause/Play 
\* ======================== */

const FIVE_MINUTES = 300000;
// const FIVE_MINUTES = 1;

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
            timer = setTimeout(
                () => endTimer(accessToken, calendarID),
                FIVE_MINUTES
            );
        }
    }
);
mp.register_event("shutdown", function () {
    endTimer(accessToken, calendarID);
});

function endTimer(accessToken: string, calendarID: string) {
    // send Google Calendar Request
    if (startTime && endTime) {
        createCalendarEvent(
            accessToken,
            calendarID,
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
