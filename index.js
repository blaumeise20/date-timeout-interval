function Timeout(callback, time, autoStart = false) {
    var self = this;
    this._callback = function () { self.state = 3; callback(); }
    this.currentTime = time;
    this._startedAt = 0;
    this._timeLeft = time;
    this._timerId = -1;
    this.state = 0;
    if (autoStart) this.start();
};
Timeout.prototype.start = function start(time) {
    if (arguments.length > 0) { // warning: undocumented feature, not really working
        this.currentTime = time;
    }
    if (this._timerId == -1) {
        if (this.state == 2) {
            this._startedAt = Date.now();
            this._timerId = setTimeout(this._callback, this._timeLeft);
            this.state = 1;
        }
        else if (this.state == 0) {
            this._startedAt = Date.now();
            this._timerId = setTimeout(this._callback, this.currentTime);
            this.state = 1;
        }
    }
};
Timeout.prototype.pause = function pause() {
    if (this.state != 1) return;
    clearTimeout(this._timerId);
    this._timerId = -1;
    this._timeLeft -= Date.now() - this._startedAt;
    this.state = 2;
};
Timeout.prototype.stop = function stop() {
    clearTimeout(this._timerId);
    this._timerId = -1;
    this._timeLeft = 0;
    this.state = 0;
};
Object.defineProperty(Timeout.prototype, "timeLeft", {
    get: function () {
        if (this.state == 0) return 0;
        return Date.now() - this._startedAt;
    }
});

function Interval(callback, time, autoStart = false) {
    var self = this;
    this._callback = function () { self._lastTrigger = Date.now(); callback(); };
    this.currentTime = time;
    this._lastTrigger = 0;
    this._timeLeft = time;
    this._timerId = -1;
    this.state = 0;
    this._isInTimeout = false;
    if (autoStart) this.start();
};
Interval.prototype.start = function start() {
    if (this._timerId == -1) {
        if (this.state == 2) {
            this._lastTrigger = Date.now();
            var self = this;
            this._timerId = setTimeout(function () {
                this._isInTimeout = false;
                this._timerId = setInterval(self._callback, self.currentTime);
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
};
Interval.prototype.pause = function pause() {
    if (this.state != 1) return;
    this._isInTimeout ? clearTimeout(this._timerId) : clearInterval(this._timerId);
    this._timerId = -1;
    this._timeLeft -= Date.now() - this._lastTrigger;
    this.state = 2;
};
Interval.prototype.stop = function stop() {
    this._isInTimeout ? clearTimeout(this._timerId) : clearInterval(this._timerId);
    this._timerId = -1;
    this._timeLeft = 0;
    this.state = 0;
};
Object.defineProperty(Interval.prototype, "timeLeft", {
    get: function () {
        if (this.state == 0) return 0;
        return Date.now() - this._lastTrigger;
    }
});

var TimerState = {};
TimerState[TimerState["Reset"] = 0] = "Reset";
TimerState[TimerState["Running"] = 1] = "Running";
TimerState[TimerState["Paused"] = 2] = "Paused";
TimerState[TimerState["Done"] = 3] = "Done";

module.exports = { Timeout: Timeout, Interval: Interval, TimerState: TimerState };
