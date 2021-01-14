# Timeout and Interval

![Node.js CI](https://github.com/blaumeise20/date-timeout-interval/workflows/Node.js%20CI/badge.svg?branch=main)
![version](https://img.shields.io/badge/version-1.1.0-success?style=plastic)

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


## Documentation

### `new Timeout(callback: () => void, timeMS: number, autoStart: boolean = false)`
`callback: () => void` - Function to execute when time is over. `Timeout` instance will be applied as `this`.<br />
`timeMS: number` - Time in milliseconds, after which the callback should fire.
`autoStart: boolean` - If the timer should automatically start. This will call `start` internally.

* `start(): this`

  Starts the timer. If the timer is currently paused, it will resume the timer.

* `stop(): this`

  Stops the timer and resets it to 0. Acts like `clearTimeout`.

* `pause(): this`

  Pauses the timer without reseting it. This is the main functionality of this class.

* `state: 0 | 1 | 2 | 3`

  Defines the current state of the timer.
  | State | Description |
  |:-----:| ----------- |
  | 0     | The timer is currently reset. This state occurs when creating the class without auto-start or after `stop` is called. |
  | 1     | The timer is running. It can only be triggered by start, or by using auto-start while creating the class. |
  | 2     | The timer has been paused by calling pause. |
  | 3     | The timer has ended and fired the callback. |

* `currentTime: number`

  The milliseconds the timer is currently set to. **Not the time left!**

* `timeLeft: number`

  This will return the time left for the timer to end. **Warning: This will call a getter which will calculate the time, don't use this too often.**

### `new Interval(callback: () => void, timeMS: number, autoStart)`
`callback` - Function to execute in specific intervals. `Interval` instance will be applied as `this`.<br />
`timeMS` - Interval time in milliseconds.
`autoStart: boolean` - If the timer should automatically start. This will call `start` internally.

* `start(): this`

  Starts the interval. If the interval is currently paused, it will resume the interval.

* `stop(): this`

  Stops the interval and resets it to 0. Acts like `clearInterval`.

* `pause(): this`

  Pauses the interval without reseting it. This will also remember the time left to the next call, so if you resume it again, it will continue at the position it stopped.

* `state: 0 | 1 | 2`

  Defines the current state of the interval. These are the same as with the timeout, but there is no "end" state, because the interval will never end.
  | State | Description |
  |:-----:| ----------- |
  | 0     | The interval is currently reset. This state occurs when creating the class without auto-start or after `stop` is called. |
  | 1     | The interval is running. It can only be triggered by start, or by using auto-start while creating the class. |
  | 2     | The interval has been paused by calling pause. |

* `currentTime: number`

  The milliseconds the interval is currently set to. **Not the time left until next execution!**

* `timeLeft: number`

  This will return the time left for the next execution to happen. **Warning: This will call a getter which will calculate the time, don't use this too often.**

# Licence
This project is licenced under the MIT licence. Read it [here](LICENCE).
