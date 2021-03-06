var memory = memory || {};

/**
 * Score ALL the things
 *
 * @module memory
 * @submodule Logic
 */
memory.logic = function logic (grid, score, page, inform, decor, utils, dom, events) {

    /**
     * Starting number for build elements
     *
     * @constant
     */
    var START_NUM   = 3;

    /**
     * Interval for timeouts in ms
     *
     * @constant
     */
    var INTERVAL    = 750;

    /**
     * CSS prroperty used throughout
     * Used a lot. Store it.
     *
     * @constant
     */
    var PROPERTY    = "backgroundColor";

    /**
     * Memory game constructor/initialiser
     *
     * @constructor
     * @function Memory
     * @fires "Ready"
     */
    function Memory () {
        // Custom events
        events.watch(this);

        // Setup the playingfield
        this.page = page.create({
            score:  "memoryScore",
            holder: "memoryHolder",
            messages: "memoryMessages"
        });

        this.decor = decor.create();

        this.grid = grid.create({
            rows: START_NUM,
            cols: START_NUM,
            elem: this.page.holder
        });

        this.score = score.create({
            elem: this.page.score,
            lvlCap: START_NUM
        });

        inform.create({
            elem: this.page.messages,
            context: this
        });

        // Data input store
        this.AI     = [];
        this.player = [];

        // Number of cells to remember
        this.rememberCount = START_NUM;

        //Manage events
        this.handleEvents();

        this.fire("Ready");
    }

    /**
     * The selection of elements that the player has to remember and match
     * The AI will choose X amount of random cells on the grid and store them
     * X being `rememberCount`
     * Avoid selecting same cell that's been stored earlier
     *
     * TODO: throw error if more cells than remember count
     * TODO: make non-blocking
     *
     * @for Memory
     * @method AISelection
     */
    Memory.prototype.AIselection = function AIselection () {
        var self = this;

        function onlyUniques () {
            var random = self.grid.getRandomCell();

            if (self.AI.indexOf(random) === -1) {
                self.AI.push(random);
            } else {
                onlyUniques();
            }
        }

        for (var i = 0; i < this.rememberCount; ++i) {
            onlyUniques();
        }

        this.highlightCells();
    };

    /**
     * Highlights cells on the grid based on `AIselection`
     * Gets random colours from library for each tile
     * We store these colours for later use
     * Triggers the reverse operation on completion
     *
     * @for Memory
     * @method highlightCells
     */
    Memory.prototype.highlightCells = function highlightCells () {
        var self = this;

        this.colours = this.decor.getRandomColours(this.AI.length);

        this.AI.forEach(function (element, index, array) {
            function showSequence () {
                dom.setStyle(element, PROPERTY, self.colours[index]);
                utils.onLastIndex(array, index, function () {
                    self.hideCells();
                });
            }

            utils.timeout(showSequence, INTERVAL * index);
        });
    };

    /**
     * Hides all the cells that were selected by AI
     * Makes backgroundColor transparent
     * Delays hiding so player can memorise the order
     * Fires "AIDone" on completion
     *
     * @for Memory
     * @method hideCells
     * @fires "AIDone"
     */
    Memory.prototype.hideCells = function hideCells () {
        var self = this;

        this.AI.forEach(function (element, index, array) {
            function hide () {
                dom.setStyle(element, PROPERTY, "transparent");
                utils.onLastIndex(array, index, function () {
                    self.fire("AIDone");
                });
            }

            utils.timeout(hide, INTERVAL);
        });
    };

    /**
     * Store the players selection
     * Colour selection to AI selections
     *
     * @for Memory
     * @method playerSelection
     * @param {Node} cell
     */
    Memory.prototype.playerSelection = function playerSelection (cell) {
        this.player.push(cell);
        dom.setStyle(cell, PROPERTY, this.colours[this.player.length - 1]);
    };

    /**
     * Compare AI vs Player results
     *
     * @for Memory
     * @method compare
     * @returns {Boolean}
     */
    Memory.prototype.compare = function compare () {
        var self = this;

        return this.AI.every(function (element, index) {
            return element.isEqualNode(self.player[index]);
        });
    };

    /**
     * Whilst in game, we need to reset these values for the next turn
     * Clears all AI and player choices
     * Clears the grid of current choices
     *
     * @for Memory
     * @method refresh
     */
    Memory.prototype.refresh = function refresh () {
        this.AI     = [];
        this.player = [];
        this.grid.refresh();
        this.AIselection();
    };

    Memory.prototype.handleClick = function handleClick (event) {
        this.playerSelection(event.data.target);

        // Return if not enough player inputs
        if (this.player.length !== this.rememberCount) {
            return;
        }

        // Compare the results
        this.compare() ? this.score.increase() : this.score.decrease();
    };

    /**
     * Increase difficulty on level cap
     * Grow the grid by 2 rows/cols
     * Increase rememberCount
     */
    Memory.prototype.handleScore = function handleScore (event) {
        if (event.data.lvlCap) {
            ++this.rememberCount;
            this.grid.grow(2, 2);
        }

        this.refresh();
    };

    /**
     * Central area to manage custom events fired by objects
     *
     * @for Memory
     * @method handleEvents
     */
    Memory.prototype.handleEvents = function handleEvents () {
        var self = this;

        this.grid.on("gridClick", function (event) {
            self.handleClick(event);
        });

        this.score.on("scoreChange", function (event) {
            self.handleScore(event);
        });

        this.on("Ready", function () {
            self.launch();
        });

        this.on("AIDone", function () {
            // Placeholder
        });
    };

    Memory.prototype.endGame = function endGame () {
        // Placeholder
        // Show splash screen
    };

    /**
     * Launch the Game
     *
     * @for memory
     * @method launch
     */
    Memory.prototype.launch = function launch () {
        this.grid.build();
        this.AIselection();
    };

    /**
     * Run the logic/game
     *
     * @function run
     * @returns {Function} Memory
     */
    function run () {
        //run the game

        //TEMPORARY//
        return new Memory();
    }

    return {
        run: run
    };
};
