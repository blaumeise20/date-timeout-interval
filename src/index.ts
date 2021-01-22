export class Timeout {
    public state: 0 | 1 | 2 | 3;
    public currentTime: number;
    public get timeLeft(): number {
        if (this.state == 0 || this.state == 3) return 0;
        return Date.now() - this._startedAt;
    }

    private _startedAt: number;
    private _callbacks: (() => void)[];
    private _rejecters: (() => void)[];
    private _timeLeft: number;
    private _timerId: any; // not possible in any other way

    public constructor(callback: () => void, timeMS: number, autoStart?: boolean) {
        (this._callbacks = []).push(() => { this.state = 3; callback.call(this); })
        this.currentTime = timeMS;
        this._startedAt = 0;
        this._timeLeft = timeMS;
        this._timerId = null;
        this.state = 0;
        if (autoStart) this.start();
    }

    public start(): this;
    public start(timeMS: number): this;
    public start(timeMS?: number): this {
        if (this.state == 3) this.stop();
        if (arguments.length > 0 && this.state == 0) this.currentTime = timeMS;
        if (this._timerId == null) {
            if (this.state == 2) {
                this._startedAt = Date.now();
                this._timerId = setTimeout(this._executeCallbacks, this._timeLeft);
                this.state = 1;
            }
            else if (this.state == 0) {
                this._startedAt = Date.now();
                this._timerId = setTimeout(this._executeCallbacks, this.currentTime);
                this.state = 1;
            }
        }
        return this;
    }

    public pause(): this {
        if (this.state != 1) return this;
        clearTimeout(this._timerId);
        this._timerId = null;
        this._timeLeft -= Date.now() - this._startedAt;
        this.state = 2;
        return this;
    }

    public stop(): this {
        clearTimeout(this._timerId);
        this._timerId = null;
        this._timeLeft = 0;
        this.state = 0;
        this._rejecters.splice(0).forEach(r => r());
        return this;
    }

    public then(onResolve: () => void, onReject: () => void): void {
        this._callbacks.push(onResolve);
        this._rejecters.push(onReject);
    }

    private _executeCallbacks() {
        this._callbacks.forEach(c => c.call(this));
        this._callbacks = [this._callbacks[0]];
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
    private _timerId: any; // not possible in any other way
    private _isInTimeout: boolean;

    public constructor(callback: (() => void), timeMS?: number, autoStart?: boolean) {
        this._callback = () => { this._lastTrigger = Date.now(); callback.call(this); };
        this.currentTime = timeMS;
        this._lastTrigger = 0;
        this._timeLeft = timeMS;
        this._timerId = null;
        this.state = 0;
        this._isInTimeout = false;
        if (autoStart) this.start();
    }

    public start(): this;
    public start(timeMS: number): this;
    public start(timeMS?: number): this {
        if (arguments.length > 0 && this.state == 0) this.currentTime = timeMS;
        if (this._timerId == null) {
            if (this.state == 2) {
                this._lastTrigger = Date.now();
                this._timerId = setTimeout(() => {
                    this._isInTimeout = false;
                    this._timerId = setInterval(this._callback, this.currentTime);
                }, this._timeLeft);
                this.state = 1;
                this._isInTimeout = true;
            }
            else if (this.state == 0) {
                this._lastTrigger = Date.now();
                this._timerId = setInterval(this._callback, this.currentTime);
                this.state = 1;
            }
        }
        return this;
    }

    public pause(): this {
        if (this.state != 1) return this;
        this._isInTimeout ? clearTimeout(this._timerId) : clearInterval(this._timerId);
        this._timerId = null;
        this._timeLeft -= Date.now() - this._lastTrigger;
        this.state = 2;
        return this;
    }

    public stop(): this {
        this._isInTimeout ? clearTimeout(this._timerId) : clearInterval(this._timerId);
        this._timerId = null;
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
