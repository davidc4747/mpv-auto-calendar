import { curl } from "../commands";

/* ------------------------ *\
    #CalendarList
\* ------------------------ */

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

type CalendarInfo = {
    accessRole: string; // "writer";
    backgroundColor: string; // "#fa573c";
    colorId: number; // 4;
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

/* ------------------------ *\
    #Calendar
\* ------------------------ */

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
