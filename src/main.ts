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
    mp.osd_message("Saving calendar event", 1);

    // send Google Calendar Request
    // createCalendarEvent(
    //     TOKEN,
    //     CALENDAR_ID,
    //     "Spanish Anime",
    //     startTime,
    //     endTime
    // );

    // Reset timers
    startTime = null;
    endTime = null;
}

/* ======================== *\
    #Calendar API Calls
\* ======================== */

function createCalendarEvent(
    accessToken: string,
    calendarID: string,
    summary: string,
    start: Date,
    end: Date
) {
    var body = JSON.stringify({
        summary: summary,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
    });
    var endpoint =
        "https://www.googleapis.com/calendar/v3/calendars/" +
        calendarID +
        "/events";
    var args = [
        "curl",
        "-X",
        "POST",
        "--location",
        endpoint,
        "--header",
        "Content-Type: text/plain",
        "--header",
        "Authorization: Bearer " + accessToken,
        "--data",
        body,
    ];
    mp.command_native({
        name: "subprocess",
        playback_only: false,
        capture_stdout: true,
        args: args,
    });
}
