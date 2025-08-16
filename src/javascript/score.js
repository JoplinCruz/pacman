

class Score {
    constructor() {
        this.record = {
            score: 0,
            highscore: 0,
            top: [],
        }
    }

    load() {
        let record = JSON.parse(localStorage.getItem("record"));
        if (record && typeof (record) === "object") {
            this.record.highscore = record.highscore;
            this.record.top = [...record.top];
        }
    }

    save() {
        this.#top(this.record.score);
        localStorage.setItem(
            "record",
            JSON.stringify({ highscore: this.record.highscore, top: this.record.top })
        );
    }

    reset() {
        this.record.score = 0;
    }

    /**
     * 
     * @param {number | undefined} increase 
     * @returns {number}
     */
    score(increase) {
        if (increase) {
            this.record.score += increase;
            this.record.highscore = this.record.score > this.record.highscore ? this.record.score : this.record.highscore;
        } else {
            return this.record.score;
        }
    }

    highscore() {
        return this.record.highscore;
    }

    top10() {
        return this.record.top;
    }

    #min() {
        let minimum = Infinity;
        for (let score of this.record.top) minimum = score < minimum ? score : minimum;
        return minimum;
    }

    /**
     * 
     * @param {number} score 
     */
    #top(score) {
        if (!this.record.top.includes(score)) {
            this.#insertScore(score);
        }
    }

    /**
     * 
     * @param {number} score 
     */
    #insertScore(score) {
        if (this.record.top.length < 10) {
            this.record.top.push(score);
            this.#descending(this.record.top);
        } else if (score > this.#min()) {
            this.record.top.pop();
            this.record.top.push(score);
            this.#descending(this.record.top);
        }
    }

    #descending(array) {
        for (let index = 0; index < array.length; index++) {
            this.#swap(index, array);
        }
    }

    #swap(index, array) {
        for (let successor = index + 1; successor < array.length; successor++){
            if (array[index] < array[successor]) array.splice(index, 0, array.splice(successor, 1)[0])
        }
    }
}