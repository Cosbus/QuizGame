/**
 * Module for HighScores.
 *
 * @module src/js/HighScores.js
 * @author Claes Weyde
 * @version 1.0.0
 */

/**
 * A class which handles high scores for the quiz game
 *
 * @class HighScores
 */
export default class HighScores {
  /**
   * Creates an instance of HighScores.
   *
   * @memberof HighScores
   * @constructor
   */
  constructor () {
    this._storageName = 'quizHighScores'
    this._highScores = {}
    this._currentObj = {}
  }

  /**
   * Sets up the high scores
   *
   * @memberof HighScores
   */
  setHighScores (playerName, playerTotalTime) {
    // construct the current object
    this._currentObj = { name: playerName, time: playerTotalTime }

    // load the current high scores saved in browser
    this._loadHighScores()

    // Add the current game object to the high scores
    // Using "totalTime" as key for the current object
    let key = playerTotalTime
    this._highScores[key] = this._currentObj

    // Retrieve the keys from the high scores
    let hsObjKeys = Object.keys(this._highScores)

    // Only keep five high scores, use "iteration" to avoid infinite loop
    let iteration = 0
    while (hsObjKeys.length > 5 && iteration < 10) {
      // Find the maximum time and remove that high score
      let maxKey = Math.max(...hsObjKeys)
      delete this._highScores[maxKey]

      // Update the variables
      iteration++
      hsObjKeys = Object.keys(this._highScores)
    }

    // Order the high scores from fastest to slowest
    // keep a temporary placeholder for scores
    let tempHS = {}
    while (hsObjKeys.length > 0) {
      // Find the minimum value, place in placeholder and remove from highscores
      let minKey = Math.min(...hsObjKeys)
      tempHS[minKey] = this._highScores[minKey]

      // Delete and update values
      delete this._highScores[minKey]
      hsObjKeys = Object.keys(this._highScores)
    }

    this._highScores = tempHS
  }

  /**
   * A function which returns the high-scores as an object in the form
   * {time:{name:name, time:time},...}
   *
   * @return {{obj}} highScores
   * @memberof HighScores
   */
  getHighScores () {
    return this._highScores
  }

  /**
   * A function which saves the current list of highscores on the local storage of
   * the browser
   *
   * @memberof HighScores
   */
  saveHighScores () {
    window.localStorage.setItem(this._storageName, JSON.stringify(this._highScores))
  }

  /**
   * A function which loads a list of high scores from the local storage of the browser
   *
   * @memberof HighScores
   */
  _loadHighScores () {
    if (window.localStorage.getItem(this._storageName)) {
      let result = window.localStorage.getItem(this._storageName)
      result = JSON.parse(result)
      this._highScores = result
    }
  }
}
