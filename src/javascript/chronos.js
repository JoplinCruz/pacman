

class Chronos {

    fps = fps;

    constructor() {
        this.timer = {
            on: false,
            current: 0,
            countdown: 0,
            alarm: { ON: false, SET: 0 },
            round: false,
            end: false,
            quit: false,
        };
    }

    reset() {
        this.timer.on = false;
        this.timer.current = 0;
        this.timer.countdown = 0;
        this.timer.alarm.ON = false;
        this.timer.alarm.SET = 0;
    }

    runtime() {
        if (this.timer.on) {
            this.timer.current++;
            this.timer.countdown = this.timer.countdown ? --this.timer.countdown : 0;
        }
    }

    is_playing() {
        return this.timer.on;
    }

    play() {
        this.timer.on = true;
    }

    pause() {
        this.timer.on = false;
    }

    current(set) {
        if (typeof (set) === "number") this.timer.current = set;
        else return this.timer.current;
    }

    countdown(set) {
        if (typeof (set) === "number") this.timer.countdown = set;
        else return this.timer.countdown;
    }

    /**
     * 
     * @param {number} set 
     * @returns {boolean | void}
     */
    alarm(set) {
        if (typeof (set) === "number") {
            this.timer.alarm.SET = set;
            this.timer.alarm.ON = set > 0 ? true : false;
        } else if (this.timer.alarm.ON) {
            return this.timer.alarm.SET <= this.timer.current;
        }
    }

    /**
     * 
     * @param {boolean} set 
     */
    round(set) {
        if (typeof(set) === "boolean") this.timer.round = set;
        else return this.timer.round;
    }

    /**
     * 
     * @param {boolean} set 
     */
    end(set) {
        if (typeof(set) === "boolean") this.timer.end = set;
        else return this.timer.end;
    }

    /**
     * 
     * @param {boolean} quit 
     */
    quit(set) {
        if (typeof(set) === "boolean") this.timer.quit = set;
        else return this.timer.quit;
    }


}