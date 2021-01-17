export class Timeout {
    public state: 0 | 1 | 2 | 3;
    public currentTime: number;
    public get timeLeft(): number {
        if (this.state == 0 || this.state == 3) return 0;
        return Date.now() - this._startedAt;
    }

    private _startedAt: number;
    private _callback: () => void;
    private _timeLeft: number;
    private _timerId: number;

    public constructor(callback: () => void, timeMS: number, autoStart?: boolean) {
        var self = this;
        this._callback = function () { self.state = 3; callback(); }
        this.currentTime = timeMS;
        this._startedAt = 0;
        this._timeLeft = timeMS;
        this._timerId = -1;
        this.state = 0;
        if (autoStart) this.start();
    }

    public start(): this;
    public start(timeMS: number): this;
    public start(timeMS?: number): this {
        if (this.state == 3) this.stop();
        if (arguments.length > 0 && this.state == 0) this.currentTime = timeMS;
        if (this._timerId == -1) {
            if (this.state == 2) {
                this._startedAt = Date.now();
                this._timerId = <any>setTimeout(this._callback, this._timeLeft);
                this.state = 1;
            }
            else if (this.state == 0) {
                this._startedAt = Date.now();
                this._timerId = <any>setTimeout(this._callback, this.currentTime);
                this.state = 1;
            }
        }
        return this;
    }

    public pause(): this {
        if (this.state != 1) return this;
        clearTimeout(<any>this._timerId);
        this._timerId = -1;
        this._timeLeft -= Date.now() - this._startedAt;
        this.state = 2;
        return this;
    }

    public stop(): this {
        clearTimeout(<any>this._timerId);
        this._timerId = -1;
        this._timeLeft = 0;
        this.state = 0;
        return this;
    }
}

export class Interval {
    public state: 0 | 1 | 2;
    public currentTime: number;
    public get timeLeft(): number {
        if (this.state == 0) return 0;
        return Date.now() - this._lastTrigger;
    }

    private _lastTrigger: number;
    private _callback: () => void;
    private _timeLeft: number;
    private _timerId: number;
    private _isInTimeout: boolean;

    public constructor(callback: (() => void), timeMS?: number, autoStart?: boolean) {
        var self = this;
        this._callback = () => { this._lastTrigger = Date.now(); callback(); };
        this.currentTime = timeMS;
        this._lastTrigger = 0;
        this._timeLeft = timeMS;
        this._timerId = -1;
        this.state = 0;
        this._isInTimeout = false;
        if (autoStart) this.start();
    }

    public start(): this;
    public start(timeMS: number): this;
    public start(timeMS?: number): this {
        if (arguments.length > 0 && this.state == 0) this.currentTime = timeMS;
        if (this._timerId == -1) {
            if (this.state == 2) {
                this._lastTrigger = Date.now();
                var self = this;
                this._timerId = <any>setTimeout(function () {
                    this._isInTimeout = false;
                    this._timerId = setInterval(self._callback, self.currentTime);
                }, this._timeLeft);
                this.state = 1;
                this._isInTimeout = true;
            }
            else if (this.state == 0) {
                this._lastTrigger = Date.now();
                this._timerId = <any>setInterval(this._callback, this.currentTime);
                this.state = 1;
            }
        }
        return this;
    }

    public pause(): this {
        if (this.state != 1) return this;
        this._isInTimeout ? clearTimeout(<any>this._timerId) : clearInterval(<any>this._timerId);
        this._timerId = -1;
        this._timeLeft -= Date.now() - this._lastTrigger;
        this.state = 2;
        return this;
    }

    public stop(): this {
        this._isInTimeout ? clearTimeout(<any>this._timerId) : clearInterval(<any>this._timerId);
        this._timerId = -1;
        this._timeLeft = 0;
        this.state = 0;
        this._isInTimeout = false;
        return this;
    }
}


export enum TimerState {
    Reset = 0,
    Running = 1,
    Paused = 2,
    Done = 3
}
