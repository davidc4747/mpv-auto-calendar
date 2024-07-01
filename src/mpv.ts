declare const mp: mpvWindow;

type mpvWindow = {
    osd_message(text: string, duration?: number): void;
    observe_property(name: string, type: string, fn: Function): void;
    register_event(name: string, fn: Function): void;
    enable_messages(level: string): void;
    command_native(table: Record<string, any>, def?: any): void;
};
