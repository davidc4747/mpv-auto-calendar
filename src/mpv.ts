// declare const print: (val: any) => void;
declare const dump: (val: any) => void;
declare const exit: () => void;

declare const mp: {
    get_script_name(): string; // auto_calendar
    get_script_directory(): string; // C:/Users/{USERNAME}/AppData/Roaming/mpv/scripts/auto-calendar
    get_script_file(): string; // C:/Users/{USERNAME}/AppData/Roaming/mpv/scripts/auto-calendar/main.js

    osd_message(text: string, duration?: number): void;
    enable_messages(level: string): void;
    last_error(): any;

    /**
     * List of all Properties can be found here
     * https://mpv.io/manual/master/#properties
     */
    get_property(name: string, def?: any): string;
    set_property(name: string, value: string): true | null;
    observe_property(
        name: string,
        type: mpvType | null,
        fn: (name: string, value: any | null) => void
    ): void;
    unobserve_property(fn: Function): void;

    /**
     * List of all Events can be found here
     * https://mpv.io/manual/master/#list-of-events
     */
    register_event(name: string, fn: Function): void;
    unregister_event(fn: Function): void;

    command(str: string): true | null;
    commandv(...args: string[]): void;
    command_native(table: Record<string, any>, def?: any): Record<string, any>;
    command_native_async(
        table: Record<string, any>,
        fn?: (
            success: boolean,
            result: any | null,
            error: string | null
        ) => void
    ): Promise<void>;

    utils: mpvUtils;
    msg: any;
    input: any;
    options: {
        read_options(
            defaultConfig: Record<string, any>,
            identifier?: string,
            on_update?: (list: string[]) => void
        ): Record<string, any>;
    };
};

type mpvType = "none" | "native" | "bool" | "string" | "number";

type mpvUtils = {
    /**
     * Returns the directory that mpv was launched from.
     * On error, nil, error is returned
     */
    getcwd(): string;
    getpid(): any;
    get_user_path(path: string): string;
    join_path(path1: string, path2: string): string;

    /**
     * Returns the content of file fname as string
     * @param fname - fname must be prefixed with file:// as simple protection against accidental arguments switch
     * @param max - limit the read to max bytes
     */
    read_file(fname: string, max?: number): string;

    write_file(fname: string, content: string): void;
    append_file(fname: string, content: string): void;
};
