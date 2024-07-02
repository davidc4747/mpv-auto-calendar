import { curl } from "../commands";

// https://google-calendar-simple-api.readthedocs.io/en/latest/colors.html#id3
export enum CalendarInfoColorID {
    COCOA = 1,
    FLAMINGO = 2,
    TOMATO = 3,
    TANGERINE = 4,
    PUMPKIN = 5,
    MANGO = 6,
    EUCALYPTUS = 7,
    BASIL = 8,
    PISTACHIO = 9,
    AVOCADO = 10,
    CITRON = 11,
    BANANA = 12,
    SAGE = 13,
    PEACOCK = 14,
    COBALT = 15,
    BLUEBERRY = 16,
    LAVENDER = 17,
    WISTERIA = 18,
    GRAPHITE = 19,
    BIRCH = 20,
    RADICCHIO = 21,
    CHERRY_BLOSSOM = 22,
    GRAPE = 23,
    AMETHYST = 24,
}

type CalendarListResponse = {
    etag: string; // "\"p33cfvt42pe48e0o\"",
    items: CalendarInfo[];
    kind: string; // "calendar#calendarList",
    nextSyncToken: string; // "CNj_9ILLiIcDEhZkYXZpZGNodW5nNDdAZ21haWwuY9t"
};

export function getALLCalendars(token: string): CalendarListResponse {
    const stdout = curl(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = JSON.parse(stdout) as CalendarListResponse;
    return data;
}

// https://developers.google.com/calendar/api/v3/reference/calendarList#resource
type CalendarInfo = {
    accessRole: string; // "writer";
    backgroundColor: string; // "#fa573c";
    colorId: CalendarInfoColorID; // 4;
    conferenceProperties: {
        allowedConferenceSolutionTypes: string[]; //["hangoutsMeet"];
    };
    defaultReminders: [];
    etag: string; // '"1670382567732000"';
    foregroundColor: string; // "#000000";
    id: string;
    kind: string; // "calendar#calendarListEntry";
    summary: string; // "Family";
    summaryOverride: string; // "Family";
    timeZone: string; // "UTC";
};

export function getCalendarInfoById(
    token: string,
    calendarId: string
): CalendarInfo | null {
    const stdout = curl(
        `https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = JSON.parse(stdout) as CalendarInfo;
    return data;
}

export function getCalendarInfoByName(
    accessToken: string,
    name: string
): CalendarInfo | null {
    const calendarList = getALLCalendars(accessToken);
    const calendarInfo = calendarList.items
        .filter((cal) => cal.summary === name)
        .pop();
    return calendarInfo ?? null;
}

export function editCalendarInfo(
    token: string,
    calendarId: string,
    body: Partial<CalendarInfo>
): CalendarInfo {
    const stdout = curl(
        `https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body,
        }
    );
    const data = JSON.parse(stdout) as CalendarInfo;
    return data;
}

/* ------------------------ *\
    #Calendar
\* ------------------------ */

// https://developers.google.com/calendar/api/v3/reference/calendars#resource
type Calendar = {
    conferenceProperties: {
        allowedConferenceSolutionTypes: string[]; // ["hangoutsMeet"];
    };
    etag: string; //'"PUk0nBjFNlVVqh9pczGTGIpAc3A"';
    id: string;
    kind: string; //"calendar#calendar";
    summary: string; //"TimeWise";
    timeZone: string; //"UTC";
};

export function getCalendar(token: string, calendarId: string): Calendar {
    const stdout = curl(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    const data = JSON.parse(stdout) as Calendar;
    return data;
}

export function createCalendar(token: string, name: string): Calendar {
    const stdout = curl(`https://www.googleapis.com/calendar/v3/calendars`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: {
            summary: name,
        },
    });
    const data = JSON.parse(stdout) as Calendar;
    return data;
}
