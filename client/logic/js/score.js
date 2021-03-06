var logic = logic || {};

/**
 * score logic
 *
 * @module Logic
 * @submodule Score
 */
logic.score = function score (events) {

    /**
     * Default score to set if none defined
     *
     * @constant
     */
    var DEFAULT_SCORE = 0;

    /**
     * Sets up an instance of the score
     *
     * @constructor
     * @function score
     * @param {Object} options options to be passed
     */
    function Score (options) {
        // Allow object to fire custom events
        events.watch(this);

        this.elem = options.elem;
        this.score = options.score || DEFAULT_SCORE;
        this.lvlCap = options.lvlCap;
        this.elem.innerHTML = this.score;

        this.handleEvents();
    }

    /**
     * Increase the score by default or specific value
     *
     * @for Score
     * @method increase
     * @param {Integer} val number to increase score by
     */
    Score.prototype.increase = function increase (val) {
        val ? this.score + val : ++this.score;
        this.elem.innerHTML = this.score;
        this.fire("score");
    };

    /**
     * Decrease the score by default or specific value
     *
     * @for Score
     * @method decrease
     * @param {Integer} val number to decrease score by
     */
    Score.prototype.decrease = function decrease (val) {
        val ? this.score - val : --this.score;
        this.elem.innerHTML = this.score;
        this.fire("score");
    };

    Score.prototype.checkScore = function checkScore () {
        return this.score % this.lvlCap === 0 ?
            this.fire("scoreChange", { score: this.score, lvlCap: true })
                : this.fire("scoreChange", { score: this.score });
    };

    /**
     * Get the current score
     *
     * @for Score
     * @method getScore
     * @returns {Integer}
     */
    Score.prototype.getScore = function getScore () {
        return this.score;
    };

    Score.prototype.handleEvents = function handleEvents () {
        var self = this;

        this.on("score", function () {
            self.checkScore();
        });
    };

    /**
     * Create a new score instance
     *
     * @function create
     * @param {Object} options
     * @return {Object} instance of score Object
     */
    function create (options) {
        return new Score(options);
    }

    return {
        create: create
    };
};
