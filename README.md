# Timeout and Interval

![Node.js CI](https://github.com/blaumeise20/date-timeout-interval/workflows/Node.js%20CI/badge.svg?branch=main)
![version](https://img.shields.io/badge/version-1.2.0-success?style=plastic)

Implementation of setTimeout and setInterval with pause.

**The test coverage of this package is currently NOT GOOD, I would love to hear your feedback!! Feel free to [open an issue](https://github.com/blaumeise20/date-timeout-interval/issues/new)!**

## Instalation

Run `npm install --save date-timeout-interval`


## Usage
Import the library to your script like this:
```ts
const { Timeout, Interval } = require("date-timeout-interval"); // JavaScript
import { Timeout, Interval } from "date-timeout-interval"; // TypeScript
```
If you want global classes, you can do the following:
```ts
require("date-timeout-interval/global"); // JavaScript
import "date-timeout-interval/global"; // TypeScript
```
This will add `Timeout` and `Interval` to `Date`.

## Timeout Documentation

The Timeout class is basically a wrapper for the vanilla JavaScript `setTimeout` function. It has a great [API](#api-reference).

The first step is always creating the instance of `Timeout`:
```ts
import { Timeout } from "date-timeout-interval";

const timeout = new Timeout(() => { /* executed function */ }, 1000);
```
In the following scripts the import statement will be omitted, but don't forget to import it in your project!
If you want the timeout to start after creating it, you pass a third parameter to the constructor, set it to `true`. Something like this:
```ts
const timeout = new Timeout(() => { /* executed function */ }, 1000, true);
```
You can use timeout.restart as a helper function for auto complete lists. It will reset the timer to zero and start it again. The callback will fire if the user doesn't enter some text for 200 ms.
```ts
import { Timeout } from "date-timeout-interval";

const text = document.getElementById("myText");
const timeout = new Timeout(() => {
    // do something...
}, 200);

text.oninput = () => {
    timeout.restart();
};
```
The pause method is self-explaining. In the following script the callback will fire after 5 seconds. The timeout is set to 3 seconds, but after one second has passed, the timeout will be paused for 2 seconds, then the remaining 2 seconds will still be waited, which makes a total of 5 seconds. Note the restart using `start`, not `restart` mentioned before. You can use this for message banners that will disappear after a short time, but when the user hovers over them, the countdown will be paused.
```ts
const timeout = new Timeout(() => { console.log("Fired") }, 3000, true);
setTimeout(timeout.pause, 1000);
setTimeout(timeout.start, 3000);
```
Of course there is also a `stop` method, which does nothing else than `clearTimeout` with JavaScript timeouts does. The callback will never be executed, but when using the [async](#asyncTimeout) version it will reject the timeout.
```ts
const timeout = new Timeout(() => { console.log("Will never print :-)") }, 3000, true);
setTimeout(timeout.stop, 1000);
```
When having event listeners which should only work for a little time (only an example), the `state` property is really useful. It has an enum value, representing the current state of the timeout. This example will check if the timeout is not over. Note omitting the callback, it is not necessary.
```ts
const timeout = new Timeout(10000, true); // will have state TimerState.Running for 10 seconds
eventEmitter.on("someEvent", () => {
    if (timeout.state != TimerState.Running) return; // you have to import TimerState to use it here!!
    // 10 seconds have not passed yet, do something
});
```
This also shows the usefulness of the `start` method called after the timeout is over. You could simply call the method in another event handler and make a button on a website, which when clicked, allows some other interaction on the site for 10 seconds. <br />
<a name="asyncTimeout"></a>Another thing is async timeout. You can omit the callback in the timeout constructor and await the timeout somewhere else, making a very useful `sleep` function:
```ts
async function yourFunction() {
    //do something
    console.log("hello");
    await new Timeout(3000, true);
    console.log("goodbye");
}
```
When the timeout is stopped (canceled) before it finished, await will throw an error. If you define a global timeout, await it somewhere, and maybe stop it somewhere else, always make sure to try/catch it:
```ts
try {
    await new Timeout(3000, true);
}
catch (e) { console.log(e); }
```

## Interval Documentation

There is currently no descriptional documentation for `Interval`, please take a look at the [API Reference for `Interval`](#intervalApi).


## API Reference

### `new Timeout(callback: () => void, timeMS: number, autoStart: boolean = false)`
`callback: () => void` - Function to execute when time is over. `Timeout` instance will be applied as `this`.<br />
`timeMS: number` - Time in milliseconds, after which the callback should fire.
`autoStart: boolean` - If the timer should automatically start. This will call `start` internally.

* `start(): this`

  Starts the timer. If the timer is currently paused, it will resume the timer. If the timer is already done, it will reset it and start as normal.

* `start(timeMS: number): this`

  Starts the timer with the given time. **Only works, if the timer is not running or paused!**

* `stop(): this`

  Stops the timer and resets it to 0. Acts like `clearTimeout`.

* `pause(): this`

  Pauses the timer without reseting it. This is the main functionality of this class.

* `restart(): this`

  Restarts the timer from zero, without firing any callback. Useful for autocomplete lists.

* `await timeout`

  The Timeout class implements the awaitable pattern, so you can await the timeout. It will throw an error if the timeout is stopped before finishing.

* `state: 0 | 1 | 2 | 3`

  Defines the current state of the timer.
  | State | Enum name | Description |
  |:-----:| --------- | ----------- |
  | 0     | Reset     | The timer is currently reset. This state occurs when creating the class without auto-start or after `stop` is called. |
  | 1     | Running   | The timer is running. It can only be triggered by start, or by using auto-start while creating the class. |
  | 2     | Paused    | The timer has been paused by calling pause. |
  | 3     | Done      | The timer has ended and fired the callback. |

* `currentTime: number`

  The milliseconds the timer is currently set to. **Not the time left!**

* `timeLeft: number`

  This will return the time left for the timer to end. **Warning: This will call a getter which will calculate the time, don't use this too often.**

### <a name="intervalApi"></a> `new Interval(callback: () => void, timeMS: number, autoStart)`
`callback` - Function to execute in specific intervals. `Interval` instance will be applied as `this`.<br />
`timeMS` - Interval time in milliseconds.
`autoStart: boolean` - If the timer should automatically start. This will call `start` internally.

* `start(): this`

  Starts the interval. If the interval is currently paused, it will resume the interval.

* `start(timeMS: number): this`

  Starts the interval with the given time. **Only works, when the interval is reset!**

* `stop(): this`

  Stops the interval and resets it to 0. Acts like `clearInterval`.

* `pause(): this`

  Pauses the interval without reseting it. This will also remember the time left to the next call, so if you resume it again, it will continue at the position it stopped.

* `state: 0 | 1 | 2`

  Defines the current state of the interval. These are the same as with the timeout, but there is no "end" state, because the interval will never end.
  | State | Enum name | Description |
  |:-----:| --------- | ----------- |
  | 0     | Reset     | The interval is currently reset. This state occurs when creating the class without auto-start or after `stop` is called. |
  | 1     | Running   | The interval is running. It can only be triggered by start, or by using auto-start while creating the class. |
  | 2     | Paused    | The interval has been paused by calling pause. |
  Interval doesn't have a `Done` state, because it will run until stopped (or paused).

* `currentTime: number`

  The milliseconds the interval is currently set to. **Not the time left until next execution!**

* `timeLeft: number`

  This will return the time left for the next execution to happen. **Warning: This will call a getter which will calculate the time, don't use this too often.**

## enum `TimerState`
* `TimerState.Reset`
* `TimerState.Running`
* `TimerState.Paused`
* `TimerState.Done`

# Licence
This project is licenced under the MIT licence. Read it [here](LICENCE).
