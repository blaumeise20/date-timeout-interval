export declare class Timeout {
    public constructor(callback: () => void, timeMS: number, autoStart: boolean);
    public start(): this;
    public start(timeMS: number): this;
    public stop(): this;
    public pause(): this;
    public readonly state: 0 | 1 | 2 | 3;
    public readonly currentTime: number;
    public readonly timeLeft: number;
}
export declare class Interval {
    public constructor(callback: () => void, timeMS: number, autoStart: boolean);
    public start(): this;
    public start(timeMS: number): this;
    public stop(): this;
    public pause(): this;
    public readonly state: 0 | 1 | 2;
    public readonly currentTime: number;
    public readonly timeLeft: number;
}
export enum TimerState {
    Reset = 0,
    Running = 1,
    Paused = 2,
    Done = 3
}
