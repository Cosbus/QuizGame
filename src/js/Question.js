/**
 * Module for Question.
 *
 * @module src/js/Question.js
 * @author Claes Weyde
 * @version 1.0.0
 */

/**
 * A class which handles question in the QuizGame
 *
 * @class Question
 */
export default class Question {
  /**
   * Creates an instance of Question.
   *
   * @memberof @Question
   * @constructor
   */
  constructor () {
    this._question = ''
    this._result = ''
    this._userAnswer = ''
    this._alternatives = []
    this._startingUrl = 'http://vhost3.lnu.se:20080/question/1'
    this._questionUrl = this._startingUrl
    this._questionNumber = 0
    this._answeredCorrect = false
  }

  /**
   * An asynchronous function which fetches the next question
   * and populates the pertinent variables with the result
   *
   *  @memberof Question
   */
  async fetchQuestion () {
    this._result = await window.fetch(this._questionUrl)
    this._result = await this._result.json()
  }

  /**
   *  A function which manages the result and populates the player variables
   *  This is done in order to be able to wait for the result to resolve in the
   *  fetchQuestion-function
   *
   * @memberof Question
   */
  async handleResult () {
    this._question = this._result.question
    this._answerUrl = this._result.nextURL
    this._alternatives = this._result.alternatives
    this._questionNumber++
  }

  /**
   * An asynchronous function which sends the answer given by the user and responds
   * to the feedback received
   *
   * @return {number} time the time it took the user to answer, (0 if incorrect,
   * negative value if last question)
   *
   * @memberof Question
   */
  async sendAnswer () {
    try {
      let result = await window.fetch(this._answerUrl,
        {
          method: 'POST',
          body: JSON.stringify({ 'answer': this._userAnswer }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      result = await result.json()

      if (result.message === 'Wrong answer! :(') {
        this._answeredCorrect = false
      } else if (result.message === 'Correct answer!') {
        this._answeredCorrect = true
        if (result.nextURL === undefined) {
          this._questionUrl = undefined
        } else {
          this._questionUrl = result.nextURL
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * A setter for the current question in the quiz
   *
   * @param {string} question
   * @memberof Question
   */
  setQuestion (question) {
    this._question = question
  }

  /**
   * A getter for the current question of the quiz
   *
   * @return {string} - a string of the question
   */
  getQuestion () {
    return this._question
  }

  /**
   * A setter for the answer given by the user
   *
   * @param {string} userAnswer - the answer given by the user
   * @memberof Question
   */
  setUserAnswer (userAnswer) {
    this._userAnswer = userAnswer
  }

  /**
   * A getter for the answer given by the user
   *
   * @return {string} - the answer given by the user
   * @memberof Question
   */
  getUserAnswer () {
    return this._userAnswer
  }

  /**
   * A function which returns the current question number
   *
   * @return {number} - the current question number
   * @memberof Question
   */
  getQuestionNumber () {
    return this._questionNumber
  }

  /**
   * A function which returns a boolean describing whether the user answered right or wrong
   *
   * @return {boolean} - if the user answered correct or not
   * @memberof Question
   */
  didUserAnswerCorrect () {
    return this._answeredCorrect
  }

  /**
   * A function which returns the URL of the coming question
   *
   * @return {string} - the URL of the next question
   * @memberof Question
   */
  getNextUrl () {
    return this._questionUrl
  }

  /**
   * A function which returns true if the current question comes with alternatives
   *
   * @return {boolean} - true if alternatives, false otherwise
   * @memberof Question
   */
  hasAlternatives () {
    if (this._alternatives) {
      return true
    } else {
      return false
    }
  }

  /**
   * A function which returns the alternatives given for the current question
   *
   * @return {obj} - the alternatives for the current question
   * @memberof Question
   */
  getAlternatives () {
    return this._alternatives
  }

  /**
   * A function which clears the question object
   *
   * @memberof Question
   */
  clearQuestion () {
    this._question = ''
    this._userAnswer = ''
    this._alternatives = []
    this._questionUrl = this._startingUrl
    this._questionNumber = 0
    this._timeLimit = 20
  }
}
