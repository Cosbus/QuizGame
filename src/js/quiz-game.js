/**
 * Module for QuizGame.
 *
 * @module src/js/Question.js
 * @author Claes Weyde
 * @version 1.0.0
 */

import cssTemplate from './css.js'
import {
  htmlGameTemplate,
  htmlFirstPageTemplate,
  htmlStartingGameTemplate,
  htmlQuizView,
  htmlAnswerSpaceText,
  htmlAnswerSpaceButtons,
  htmlLostGameView,
  htmlEndGameTemplate } from './html.js'
import HighScores from './HighScores.js'
import Player from './Player.js'
import Question from './Question.js'

/**
 * A QuizGame element that handles a quiz game
 *
 * @class QuizGame
 * @extends {window.HTMLElement}
 */
export default class QuizGame extends window.HTMLElement {
  /**
   * Creates an instance of QuizGame.
   *
   * @memberof @QuizGame
   * @constructor
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })

    this.shadowRoot.appendChild(htmlGameTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))

    this._gameBody = this.shadowRoot.querySelector('#gameBody')
    this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))

    this._player = new Player()
    this._question = new Question()
    this._highScores = new HighScores()

    // variables related to the timer
    this._intervalID = null
    this._timeLimit = 20
    this._countdownTime = this._timeLimit
    this._timerRefreshRate = 10
    this._timerDecrement = this._timerRefreshRate / 1000
    this._timeDecimalNr = 2
  }

  /**
   * A function which is invoked each time an element is appended into the document.
   *
   * @memberof @QuizGame
   */
  connectedCallback () {
    this._gameBody.querySelector('#nickInputButton').addEventListener('click',
      this._preQuiz.bind(this))
  }

  /**
   * A function which sets up the player name and shows a view prior to
   * the quiz-view, giving the player an opportunity to gather her/his wits before
   * starting the game
   *
   * @param {object} event the event that triggered the function
   * @memberof @QuizGame
   */
  _preQuiz (event) {
    this._player.setName(this._gameBody.querySelector('#nickInput').value)
    this._gameBody.removeChild(this._gameBody.querySelector('#nick'))
    this._gameBody.appendChild(htmlStartingGameTemplate.content.cloneNode(true))
    this._gameBody.querySelector('#thanks').textContent += this._player.getName()
    this._gameBody.querySelector('#startButton').addEventListener('click',
      this._startGame.bind(this))
  }

  /**
   * A function which handles the view before the quiz starts
   *
   * @param {obj} event - the event which triggered the function
   */
  _startGame (event) {
    this._gameBody.removeChild(this.shadowRoot.querySelector('#start'))
    this._gameBody.appendChild(htmlQuizView.content.cloneNode(true))
    this._fetchQuestion()
  }

  /**
   * A function which fetches a new question and then calls the render function
   *
   * @memberof @QuizGame
   */
  _fetchQuestion () {
    this._question.fetchQuestion()
      .then(() => this._question.handleResult()).then(() => this._renderQuestion())
  }

  /**
   * A semi-private function which renders a question in the browser
   *
   * @memberof @QuizGame
   */
  _renderQuestion () {
    // First we clear the question area
    let qArea = this._gameBody.querySelector('#clearableDiv')
    qArea.innerHTML = ''

    // Then we set up the informational areas
    this._gameBody.querySelector('#questionNr').textContent =
     `Question #${this._question.getQuestionNumber()}`
    this._gameBody.querySelector('#questionText').textContent = this._question.getQuestion()
    this._gameBody.querySelector('#player').textContent = this._player.getName()
    this._startTimer()

    // find out whether the question offers alternatives and act accordingly
    if (!this._question.hasAlternatives()) {
      this._setupTextInput(qArea)
    } else {
      this._setupAlternatives(qArea)
    }
  }

  /**
   * A function which sets up an input-form in the view of the questions
   *
   * @param {htmlElement} qArea - a html-elemnt which is to be populated
   * @memberof @QuizGame
   */
  _setupTextInput (qArea) {
    qArea.appendChild(htmlAnswerSpaceText.content.cloneNode(true))
    this._gameBody.querySelector('#answerInputButton').addEventListener('click',
      e => {
        this._question.setUserAnswer(this._gameBody.querySelector('#userAnswerInput').value)
        this._question.sendAnswer().then(() => this._parseResult())
      })
  }

  /**
   * A function which sets up alternatives in the view of the question
   *
   * @param {htmlElement} qArea - a htmlElement which is to be populated
   * @memberof @QuizGame
   */
  _setupAlternatives (qArea) {
    qArea.appendChild(htmlAnswerSpaceButtons.content.cloneNode(true))
    let alternatives = this._question.getAlternatives()
    let keys = Object.keys(alternatives)
    let alts = Object.values(alternatives)

    // get the template for the button
    let firstBtn = this._gameBody.querySelector('.radioButtons')
    firstBtn.setAttribute('id', keys[0])
    firstBtn.querySelector('#radioText').textContent = alts[0]

    let btnSpace = this._gameBody.querySelector('#buttonArea')

    // set up a button for each alternative
    for (let i = 1; i < alts.length; i++) {
      let btn = firstBtn.cloneNode(true)
      btnSpace.appendChild(btn)
      btn.setAttribute('id', keys[i])
      btn.querySelector('#radioText').textContent = alts[i]
    }

    // Set up an eventListener
    this._gameBody.querySelector('#answerRadioButton').addEventListener('click',
      e => {
        let radioButtons = this._gameBody.querySelectorAll('.radioButtons')
        for (let button of radioButtons) {
          if (button.querySelector('#radioButton').checked) {
            this._question.setUserAnswer(button.getAttribute('id'))
            this._question.sendAnswer().then(() => this._parseResult())
          }
        }
      })
  }

  /**
   * A function which starts a timer
   *
   * @memberof @QuizGame
   */
  _startTimer () {
    // Clear previous intervalID and set time-limit for current interval
    clearInterval(this._intervalID)
    this._countdownTime = this._timeLimit

    let text = this.shadowRoot.querySelector('#time')
    this._intervalID = setInterval(() => {
      text.textContent = this._countdownTime
      this._countdownTime -= this._timerDecrement
      if (this._countdownTime <= 0) {
        this._lostGame()
      }
      this._countdownTime = this._cropTime(this._countdownTime, this._timeDecimalNr)
    }, this._timerRefreshRate)
  }

  /**
   * A function which crops a time-value by rounding to the number of decimals given as
   * input
   *
   * @param {number} time
   * @param {number} decimals
   * @return {string} - the cropped time
   */
  _cropTime (time, decimals) {
    return parseFloat(Math.round(time * 10000) / 10000).toFixed(decimals)
  }

  /**
   * A function which parses the result from the answer given by the user
   *
   * @memberof @QuizGame
   */
  _parseResult () {
    if (!this._question.didUserAnswerCorrect()) { // Wrong answer
      this._lostGame()
    } else { // Answered correctly
      this._player.setTime(this._player.getTime() + (this._timeLimit - this._countdownTime))
      if (this._question.getNextUrl() === undefined) { // But no more questions
        this._gameEnd()
      } else { // There are more questions
        this._clearTimer()
        this._fetchQuestion()
      }
    }
  }

  /**
   * A function which handles the view when the game has ended
   *
   * @memberof @QuizGame
   */
  _gameEnd () {
    this._gameBody.removeChild(this._gameBody.querySelector('#quizView'))
    this._gameBody.appendChild(htmlEndGameTemplate.content.cloneNode(true))

    // Set time information in view
    let titleText = `Well done ${this._player.getName()}!`
    let timeText = `It took you a total of ${this._cropTime(this._player.getTime(), 2)} seconds to answer
    all ${this._question.getQuestionNumber()} questions!`
    this._gameBody.querySelector('#totalTime').textContent = timeText
    this._gameBody.querySelector('#endTitle').textContent = titleText

    // Set up the high scores
    this._highScores.setHighScores(this._player.getName(), this._player.getTime())

    // First get the template for the list-item and clone it
    let firstItem = this._gameBody.querySelector('#item1')
    let collection = this._gameBody.querySelector('#collection')

    // Then loop through the objects
    let objKeys = Object.keys(this._highScores.getHighScores())
    let objValues = Object.values(this._highScores.getHighScores())

    for (let i = 0; i < objKeys.length; i++) {
      let item = firstItem.cloneNode(true)
      item.querySelector('#firstItem').innerHTML = objValues[i].name
      item.querySelector('#secondItem').innerHTML = objValues[i].time
      collection.appendChild(item)
    }

    // Save the high-score list
    this._highScores.saveHighScores()

    // Set up listener
    this._gameBody.querySelector('#startOverButton').addEventListener('click',
      e => {
        this._gameBody.removeChild(this._gameBody.querySelector('#endGame'))
        this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
        this._gameBody.querySelector('#nickInputButton').addEventListener('click',
          this._preQuiz.bind(this))
      })

    this._clearAll()
  }

  /**
   * A function which handles the view when the game is lost
   *
   * @memberof @QuizGame
   */
  _lostGame () {
    // Clear space and set up template for further flow
    this._gameBody.removeChild(this.shadowRoot.querySelector('#quizView'))
    this._gameBody.appendChild(htmlLostGameView.content.cloneNode(true))

    this._gameBody.querySelector('#restartButton').addEventListener('click', e => {
      this._gameBody.removeChild(this.shadowRoot.querySelector('#lostGameView'))
      this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
      this._gameBody.querySelector('#nickInputButton').addEventListener('click', this._preQuiz.bind(this))
    })
    let text = this._gameBody.querySelector('#lostGameText')
    clearInterval(this._intervalID)
    if (this._countdownTime <= 0) {
      text.textContent = 'Time ran out.'
    } else {
      text.textContent = 'Your answer was incorrect.'
    }
    this._clearAll()
  }

  /**
   * A function which clears all the variables of the game
   *
   * @memberof @QuizGame
   */
  _clearAll () {
    this._question.clearQuestion()
    this._player.clearPlayer()
    this._clearTimer()
  }

  /**
   * A function which clears the variables connected to the timer
   *
   * @memberof @QuizGame
   */
  _clearTimer () {
    clearInterval(this._intervalID)
    this._intervalID = null
    this._timeLimit = 20
    this._countdownTime = this._timeLimit
    this._timerRefreshRate = 10
    this._timerDecrement = this._timerRefreshRate / 1000
    this._timeDecimalNr = 2
  }
}
