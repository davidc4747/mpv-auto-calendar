import { curl } from "../commands";

// https://google-calendar-simple-api.readthedocs.io/en/latest/colors.html
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

type CreateEventRequest = {
    accessToken: string;
    calendarID: string;
    summary: string;
    start: Date;
    end: Date;
    colorId?: number;
};

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
    params: CreateEventRequest
): CreateEventResponse {
    const { accessToken, calendarID, summary, start, end } = params;
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
                colorId: params.colorId,
            },
        }
    );
    return JSON.parse(stdout) as CreateEventResponse;
}
