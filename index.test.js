const { Timeout, Interval } = require( "date-timeout-interval");
require('jest');

beforeEach(() => {
    jest.useFakeTimers();
});

describe('state tests', () => {
    test('state is set to 0 after creation of timer', () => {
        const to = new Timeout(() => {}, 0);
        expect(to.state).toBe(0);
    });

    test('state is set to 1 when timer has been started', () => {
        const waitTime = 1000;
        const callback = jest.fn();
        const to = new Timeout(callback, waitTime);
        to.start();
        expect(to.state).toBe(1);
    });

    test('state is set to 3 and callback is called after timer is completed', () => {
        const waitTime = 1000;
        const callback = jest.fn();
        const to = new Timeout(callback, waitTime);
        to.start();

        jest.runAllTimers();
        expect(to.state).toBe(3);
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    });
});

describe('time start tests', () => {
    test('timeout is not started when autostart is false', () => {
        const to = new Timeout(() => {}, 0, false);
        expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    test('timeout is not started when autostart is not specified', () => {
        const to = new Timeout(() => {}, 0);
        expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    test('timeout is started when autostart is true', () => {
        const waitTime = 1000;
        const to = new Timeout(() => {}, waitTime, true);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), waitTime);
    });
});
