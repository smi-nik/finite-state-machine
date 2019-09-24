class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) throw new Error();

    this.config = config;
    this.states = this.config.states;

    this.undoStack = [];
    this.redoStack = [];

    this.state = this.config.initial;
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.state;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (!this.states[state]) throw new Error();

    this.undoStack.push(this.state);
    this.redoStack = [];
    this.state = state;
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    this.changeState(this.states[this.state].transitions[event]);
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.changeState(this.config.initial);
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (!event) return Object.keys(this.states);

    return Object.keys(this.states).filter(key => this.states[key].transitions[event]);
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.undoStack.length === 0) return false;

    this.redoStack.push(this.state);
    this.state = this.undoStack.pop();

    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (this.redoStack.length === 0) return false;

    this.undoStack.push(this.state);
    this.state = this.redoStack.pop();

    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

module.exports = FSM;
