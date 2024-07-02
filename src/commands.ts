import "./mpv";

type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type HttpOptions = {
    method: HttpMethods;
    body?: Record<string, any>;
    headers?: Record<string, any>;
};

type CommandOutput = {
    error_string: string;
    killed_by_us: boolean;
    status: number;
    stdout: string;
};

export function curl(endpoint: string, options?: HttpOptions): string {
    let args = ["curl", "-X", options?.method ?? "GET", "--location", endpoint];
    if (options?.headers) {
        for (const key in options.headers) {
            if (options.headers.hasOwnProperty(key)) {
                const value = options.headers[key];
                args = args.concat(["--header", `${key}: ${value}`]);
            }
        }
    }
    if (options?.body) {
        args = args.concat(["--data", JSON.stringify(options.body)]);
    }
    const output = mp.command_native({
        name: "subprocess",
        playback_only: false,
        capture_stdout: true,
        args: args,
    }) as CommandOutput;

    return output.stdout;
}
