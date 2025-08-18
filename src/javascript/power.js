

class Power {
    
    cherry_power = {
        LIFE: 1,
        INVISIBLE: 2,
        SPEED: 3,
        FREEZE: 4,
    };

    #fps = fps;
    #super;

    constructor() {
        this.#super = {
            hero: {
                on: false,
                countdown: 8 * this.#fps,
                bigfood: {
                    on: false,
                    timer: new Chronos()
                },
                cherry: {
                    on: false,
                    timer: new Chronos(),
                    power: null,
                },
            },
            bigfood: {
                on: false,
                icon: null,
            },
            cherry: {
                on: false,
                coordinate: new Grid(17, 13),
                icon: cherryIconIMG,
                timer: new Chronos(),
                countdown: 8 * this.#fps,
                powerlist: null,
                power: null,
                quantite: 3,
            },
        };
        if (arguments.length) {
            let items = arguments[0];

            this.#super.bigfood.icon = items.bigfood.icon;
            this.#super.cherry.coordinate = items.cherry.coordinate;
            this.#super.cherry.icon = items.cherry.icon;
            this.#super.cherry.timer = items.cherry.timer;
            this.#super.hero.bigfood.timer = items.hero.bigfood.timer;
            this.#super.hero.cherry.timer = items.hero.cherry.timer;
        }
        this.#super.cherry.powerlist = Object.keys(this.cherry_power);
        this.defaults();
        this.cleanCherrySettings();
        this.#super.hero.bigfood.timer.play();
        this.#super.hero.cherry.timer.play();
        this.#super.cherry.timer.play();
    }

    defaults() {
        this.default = {
            hero: {
                on: false,
                countdown: 8 * this.#fps,
                bigfood: { ...this.#super.hero.bigfood },
                cherry: { ...this.#super.hero.cherry },
            },
            bigfood: { ...this.#super.bigfood },
            cherry: { ...this.#super.cherry },
        }
        this.default.cherry.powerlist = [...this.#super.cherry.powerlist];
    }

    reset() {
        this.#cleanAllChronos();
        this.cleanCherrySettings();
        this.#super.cherry.powerlist = [...this.default.cherry.powerlist];
        this.#super.bigfood.on = this.default.bigfood.on;
        this.#super.hero.bigfood.on = this.default.hero.bigfood.on;
        this.#super.hero.cherry.on = this.default.hero.cherry.on;
        this.#super.hero.cherry.power = this.default.hero.cherry.power;
    }

    runtime() {

        this.#super.hero.bigfood.timer.runtime();
        this.#super.hero.cherry.timer.runtime();
        this.#super.cherry.timer.runtime();

        
        if (this.is_bigfood_power() && !this.#super.hero.bigfood.timer.countdown()) this.deactive_bigfood();
        
        if (this.#super.cherry.timer.alarm() && this.#super.cherry.quantite > 0) {
            this.#super.cherry.timer.alarm(0);
            this.#enable_cherry();
        }

        if (this.is_cherry_enable()) {
            if (!this.#super.cherry.timer.countdown() || this.is_cherry_power()) this.#disable_cherry();
        }

        if (this.is_cherry_power() && !this.#super.hero.cherry.timer.countdown()) this.deactive_cherry();
        
        this.#super.hero.on = this.is_bigfood_power() || this.is_cherry_power() ? true : false;
    }

    active_bigfood() {
        this.#super.bigfood.on = true;
        this.#super.hero.bigfood.on = true;
        this.#super.hero.bigfood.timer.countdown(this.#super.hero.countdown);
    }

    deactive_bigfood() {
        this.#super.bigfood.on = false;
        this.#super.hero.bigfood.on = false;
    }

    active_cherry() {
        this.#super.hero.cherry.on = true;
        this.#super.hero.cherry.power = this.cherry_power[this.#super.cherry.power];
        this.#super.hero.cherry.timer.countdown(this.#super.hero.countdown);
    }

    deactive_cherry() {
        this.#super.hero.cherry.on = false;
        this.#super.hero.cherry.power = null;
        this.#super.cherry.power = null;
    }

    #enable_cherry() {
        this.#super.cherry.on = true;
        this.#super.cherry.timer.countdown(this.#super.cherry.countdown);
        let choicePower = (Math.random() * (this.#super.cherry.powerlist.length - 1)) >> 0;
        this.#super.cherry.power = this.#super.cherry.powerlist.splice(choicePower, 1)[0];
        this.#super.cherry.quantite--;
    }

    #disable_cherry() {
        this.#super.cherry.on = false;
    }

    #cleanAllChronos() {
        this.#super.cherry.timer.reset();
        this.#super.cherry.timer.play();
        this.#super.hero.cherry.timer.reset();
        this.#super.hero.cherry.timer.play();
        this.#super.hero.bigfood.timer.reset();
        this.#super.hero.bigfood.timer.play();
    }

    is_power() {
        return this.#super.hero.on;
    }

    is_cherry_power() {
        return this.#super.hero.cherry.on;
    }

    is_bigfood_power() {
        return this.#super.bigfood.on;
    }

    is_cherry_enable() {
        return this.#super.cherry.on;
    }

    getHeroPower() {
        if (this.is_cherry_power())
            return this.#super.hero.cherry.power
        else
            return null
    }

    getCherryPower() {
        return this.cherry_power[this.#super.cherry.power];
    }

    getCherryQuantite() {
        return this.#super.cherry.quantite;
    }

    getCherryPosition() {
        return this.#super.cherry.coordinate;
    }

    getCherryIcon() {
        return this.#super.cherry.icon;
    }

    cleanCherrySettings() {
        this.#cleanAllChronos();
        this.#super.cherry.on = false;
        this.#super.cherry.timer.alarm((15 * this.#fps) + (Math.random() * 20 * this.#fps) >> 0);
        this.#super.cherry.power = null;
    }

    resetCherryQuantite() {
        this.#super.cherry.quantite = this.default.cherry.quantite;
    }
}