/**
 * Module for Player.
 *
 * @module src/js/Question.js
 * @author Claes Weyde
 * @version 1.0.0
 */

/**
 * A class which handles players in the QuizGame
 *
 * @class Player
 */
export default class Player {
  /**
   * Creates an instance of Player.
   *
   * @memberof @Player
   * @constructor
   */
  constructor (name = 'Kim Doe') {
    this._name = name
    this._totalTime = 0
  }

  /**
   * A function to set the name of the player
   *
   * @param {string} name - the name of the player
   * @memberof @Player
   */
  setName (name) {
    this._name = name
  }

  /**
   * A function which returns the name of the player
   *
   * @return {string} - the name of the player
   * @memberof @Player
   */
  getName () {
    return this._name
  }

  /**
   * A function which sets the time the player has played
   *
   * @param {number} time - the time the player has played
   * @memberof @Player
   */
  setTime (time) {
    this._totalTime = time
  }

  /**
   * A function which returns the time the player has played
   *
   * @return {number} - the time the player has played
   * @memberof @Player
   */
  getTime () {
    return this._totalTime
  }

  /**
   * A function which clears the variables of the instance
   *
   * @memberof @Player
   */
  clearPlayer () {
    this._name = ''
    this._totalTime = 0
  }
}
