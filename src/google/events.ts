import { curl } from "../commands";

// https://google-calendar-simple-api.readthedocs.io/en/latest/colors.html#event-colors
export enum EventColorID {
    LAVENDER = 1,
    SAGE = 2,
    GRAPE = 3,
    FLAMINGO = 4,
    BANANA = 5,
    TANGERINE = 6,
    PEACOCK = 7,
    GRAPHITE = 8,
    BLUEBERRY = 9,
    BASIL = 10,
    TOMATO = 11,
}

// https://developers.google.com/calendar/api/v3/reference/events#resource
type Event = {
    created: string; // "2024-07-02T00:35:44.000Z";
    creator: { email: string };
    end: {
        dateTime: string; // "2024-07-02T00:35:45Z";
        timeZone?: string; // "America/Los_Angeles";
    };
    etag: string; // '"3439761088710000"';
    eventType:
        | "default"
        | "outOfOffice"
        | "focusTime"
        | "workingLocation"
        | "fromGmail";
    htmlLink: string;
    iCalUID: string;
    id: string;
    colorId: EventColorID;
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
        timeZone?: string; // "America/Los_Angeles";
    };
    status: "confirmed";
    summary: string; // "Spanish Anime";
    updated: string; // "2024-07-02T00:35:44.355Z";
};

export function createCalendarEvent(
    token: string,
    calendarId: string,
    body: Partial<Event>
): Event {
    const stdout = curl(
        "https://www.googleapis.com/calendar/v3/calendars/" +
            calendarId +
            "/events",
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                Authorization: `Bearer ${token}`,
            },
            body,
        }
    );
    return JSON.parse(stdout) as Event;
}
