// mp.enable_messages("error");
// mp.osd_message("Script Starting....", 10);

var CLIENT_ID = "";
var CLIENT_SECRET = "";
var CALENDAR_ID = "";
var TOKEN = "";

/* ======================== *\
    #Pause/Play Event
\* ======================== */

// var FIVE_MINUTES = 300000;
var FIVE_MINUTES = 1;

var timer = null;
var startTime = new Date();
var endTime = new Date();
mp.observe_property("pause", "bool", function (name, isPaused) {
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
});
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

function createCalendarEvent(accessToken, calendarID, summary, start, end) {
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
