import "./mpv";
import {
    readCredentialsFile,
    readTokenFile,
    saveToken,
    TokenFile,
} from "./files";
import { getUserConfig, UserConfig } from "./config";
import { getFreshAccessToken } from "./google/token";
import { createCalendar, getCalendarInfoByName } from "./google/calendars";
import { createCalendarEvent } from "./google/events";

/* ======================== *\
    #Handle refreshing token
\* ======================== */

let accessToken: string;
let refreshTimer;
(function tick() {
    const { client_id, client_secret } = readCredentialsFile();
    const { refresh_token } = readTokenFile();

    // ping google for a new token
    const credentials = getFreshAccessToken(
        client_id,
        client_secret,
        refresh_token
    );

    // Update Global Variables
    accessToken = credentials.access_token;

    // Save the new access_token to File
    saveToken(credentials as TokenFile);
    refreshTimer = setTimeout(tick, credentials.expires_in * 1000);
})();

/* ======================== *\
    #Handle Pause/Play 
\* ======================== */

const config = getUserConfig();
// create calendar if not exists
if (!getCalendarInfoByName(accessToken, config.calendar_name)) {
    createCalendar(accessToken, config.calendar_name);
}

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
                () => endTimer(accessToken, config),
                config.wait_time * 1000
            );
        }
    }
);
mp.register_event("shutdown", function () {
    endTimer(accessToken, config);
});

function endTimer(token: string, config: UserConfig): void {
    // send Google Calendar Request
    if (startTime && endTime) {
        const { calendar_name, event_color_id, event_name } = config;

        // log calendar event
        const calendarId = getCalendarInfoByName(token, calendar_name)?.id;
        if (calendarId) {
            createCalendarEvent(token, calendarId, {
                summary: event_name,
                start: { dateTime: startTime.toISOString() },
                end: { dateTime: endTime.toISOString() },
                colorId: event_color_id,
            });
            mp.osd_message("Saving calendar event", 1);
        }
    }

    // Reset timers
    startTime = null;
    endTime = null;
}
