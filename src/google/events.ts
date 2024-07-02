import { curl } from "../commands";

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

export function createCalendarEvent(
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
