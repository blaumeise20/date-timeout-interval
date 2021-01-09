export declare class Timeout {
	public start(): this;
	public stop(): this;
	public pause(): this;
	public readonly state: 0 | 1 | 2 | 3;
	public readonly currentTime: number;
	public readonly timeLeft: number;
}
export declare class Interval {
	public start(): this;
	public stop(): this;
	public pause(): this;
	public readonly state: 0 | 1 | 2;
	public readonly currentTime: number;
	public readonly timeLeft: number;
}