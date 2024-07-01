// declare const print: (val: any) => void;
declare const dump: (val: any) => void;
declare const exit: () => void;

declare const mp: {
    get_script_file(): string;
    get_script_directory(): string;

    osd_message(text: string, duration?: number): void;
    enable_messages(level: string): void;

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

    command_native(table: Record<string, any>, def?: any): void;
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
    options: any;
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

    /**
     * Returns the content of file fname as string
     * @param fname - filename
     * @param max - limit the read to max bytes
     */
    read_file(fname: string, max?: number): string;

    write_file(fname: string, str: string): void;
    append_file(fname: string, str: string): void;
};
