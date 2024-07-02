import { EventColorID } from "./google/events";

/* ======================== *\
    #Config
\* ======================== */

export type UserConfig = {
    event_name: string;
    event_color_id: EventColorID;
    calendar_name: string;

    wait_time: number; // in seconds
};
let config: UserConfig = {
    event_name: "mpv",
    event_color_id: EventColorID.TOMATO,
    calendar_name: "auto-calendar",

    wait_time: 300, // 5mins
};

export function getUserConfig(): UserConfig {
    // Mutates the global variable to have the user's data
    mp.options.read_options(config, "auto_calendar");
    return config;
}
