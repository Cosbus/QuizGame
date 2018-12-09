import cssTemplate from '../css.js'
import {
  htmlGameTemplate,
  htmlFirstPageTemplate,
  htmlStartingGameTemplate,
  htmlQuizView,
  htmlAnswerSpaceText,
  htmlAnswerSpaceButtons,
  htmlLostGameView,
  htmlEndGameTemplate } from '../html.js'

/**
 * A QuizGame element that handles a quiz game
 *
 * @class QuizGame
 * @extends {window.HTMLElement}
 */
export default class QuizGame extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })

    this.shadowRoot.appendChild(htmlGameTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))

    this._gameBody = this.shadowRoot.querySelector('#gameBody')
    this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))

    // Used to point to the next quiz question, default url is first question
    this._startingUrl = 'http://vhost3.lnu.se:20080/question/1'
    this._questionUrl = this._startingUrl
    this._answerUrl = ''
    this._question = ''
    this._nickname = ''
    this._questionNumber = 1
    this._userAnswer = ''
    this._points = 0
    this._totalTime = 0
    this._timeLimit = 20
    this._countdownTime = this._timeLimit
    this._intervalID = null
    this._timeDecimalNr = 2
    this._timerRefreshRate = 10
    this._timerDecrement = this._timerRefreshRate / 1000

    this._storageName = 'quizHighScores'
    this._highScores = {}
    this._currentObj = {}
  }

  /**
 * Sets which attributes are observed
 *
 * @readonly
 * @static
 * @memberof QuizGame
 */
  static get observedAttributes () {
    return []
  }

  /**
   * A function which is invoked each time an element is appended into the document.
   */
  connectedCallback () {
    this._gameBody.querySelector('#nickInputButton').addEventListener('click', this._preStart.bind(this))
  }

  _preStart (event) {
    let nick = this._gameBody.querySelector('#nickInput')
    this._nickname = nick.value
    this._gameBody.removeChild(this._gameBody.querySelector('#nick'))
    this._gameBody.appendChild(htmlStartingGameTemplate.content.cloneNode(true))
    this._gameBody.querySelector('#thanks').textContent += this._nickname
    this._gameBody.querySelector('#startButton').addEventListener('click', this._startGame.bind(this))
  }

  _startGame (event) {
    this._gameBody.removeChild(this.shadowRoot.querySelector('#start'))
    this._gameBody.appendChild(htmlQuizView.content.cloneNode(true))
    this._fetchQuestion()
  }

  /**
   * A function which fetches a new question and sets
   */
  async _fetchQuestion () {
    let result = await window.fetch(this._questionUrl)
    result = await result.json()
    this._question = result.question
    this._answerUrl = result.nextURL
    this._renderQuestion(result)
  }

  /**
   * A semi-private function which renders a question in the browser
   *
   * @param {*} result
   */
  _renderQuestion (result) {
    // First we clear the question area
    let qArea = this._gameBody.querySelector('#clearableDiv')
    qArea.innerHTML = ''

    // Then we set up the informational areas
    this._gameBody.querySelector('#questionNr').textContent =
     `Question #${this._questionNumber++}`
    let questionTextSpace = this._gameBody.querySelector('#questionText')
    questionTextSpace.textContent = this._question
    this._gameBody.querySelector('#player').textContent = this._nickname
    this._startTimer()

    // find out whether the question offers alternatives and act accordingly
    if (!result.alternatives) {
      this._setupTextInput(qArea)
    } else {
      this._setupAlternatives(result, qArea)
    }
  }

  _setupTextInput (qArea) {
    qArea.appendChild(htmlAnswerSpaceText.content.cloneNode(true))
    this._gameBody.querySelector('#answerInputButton').addEventListener('click', e => {
      this._userAnswer = this._gameBody.querySelector('#userAnswerInput').value
      this._sendAnswer()
    })
  }

  _setupAlternatives (result, qArea) {
    qArea.appendChild(htmlAnswerSpaceButtons.content.cloneNode(true))
    let alternatives = result.alternatives
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
    this._gameBody.querySelector('#answerRadioButton').addEventListener('click', e => {
      let radioButtons = this._gameBody.querySelectorAll('.radioButtons')
      for (let button of radioButtons) {
        if (button.querySelector('#radioButton').checked) {
          this._userAnswer = button.getAttribute('id')
          this._sendAnswer()
        }
      }
    })
  }

  _startTimer () {
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

  _cropTime (time, decimals) {
    return parseFloat(Math.round(time * 10000) / 10000).toFixed(decimals)
  }

  async _sendAnswer () {
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
      this._parseResult(result)
    } catch (err) {
      console.log(err)
    }
  }

  _parseResult (result) {
    if (result.message === 'Wrong answer! :(') {
      this._lostGame()
    } else if (result.message === 'Correct answer!') {
      if (result.nextURL === undefined) {
        this._totalTime += (this._timeLimit - this._countdownTime)
        this._gameEnd()
      } else {
        this._questionUrl = result.nextURL
        this._points++
        this._totalTime += (this._timeLimit - this._countdownTime)
        this._fetchQuestion()
      }
    }
  }

  _gameEnd () {
    this._gameBody.removeChild(this._gameBody.querySelector('#quizView'))
    this._gameBody.appendChild(htmlEndGameTemplate.content.cloneNode(true))

    // Set time information in view
    let titleText = `Well done ${this._nickname}!`
    let timeText = `It took you a total of ${this._cropTime(this._totalTime, this._timeDecimalNr)} seconds to answer
    all ${--this._questionNumber} questions!`
    this._gameBody.querySelector('#totalTime').textContent = timeText
    this._gameBody.querySelector('#endTitle').textContent = titleText

    // Set up the high scores
    this._setHighScores()

    // First get the template for the list-item and clone it
    let firstItem = this._gameBody.querySelector('#item1')
    let collection = this._gameBody.querySelector('#collection')

    // Then loop through the objects
    let objKeys = Object.keys(this._highScores)
    let objValues = Object.values(this._highScores)

    for (let i = 0; i < objKeys.length; i++) {
      let item = firstItem.cloneNode(true)
      item.querySelector('#firstItem').innerHTML = objValues[i].name
      item.querySelector('#secondItem').innerHTML = this._cropTime(objValues[i].time, 2)
      collection.appendChild(item)
    }

    // Save the high-score list
    this._saveHighScores()

    this._gameBody.querySelector('#startOverButton').addEventListener('click', e => {
      this._gameBody.removeChild(this._gameBody.querySelector('#endGame'))
      this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
      this._gameBody.querySelector('#nickInputButton').addEventListener('click', this._preStart.bind(this))
    })
    this._clearVars()
  }

  _setHighScores () {
    // construct the current object
    this._currentObj = { name: this._nickname, time: this._totalTime }

    // load the current high scores saved in browser
    this._loadHighScores()

    // Add the current game object to the high scores
    // Using "totalTime" as key for the current object
    let key = this._totalTime
    this._highScores[key] = this._currentObj

    // Retrieve the keys from the high scores
    let hsObjKeys = Object.keys(this._highScores)

    // Only keep five high scores, use iteration to avoid infinite loop
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

  _saveHighScores () {
    window.localStorage.setItem(this._storageName, JSON.stringify(this._highScores))
  }

  _loadHighScores () {
    if (window.localStorage.getItem(this._storageName)) {
      let result = window.localStorage.getItem(this._storageName)
      result = JSON.parse(result)
      this._highScores = result
    }
  }

  _clearVars () {
    clearInterval(this._intervalID)
    this._questionUrl = this._startingUrl
    this._answerUrl = ''
    this._question = ''
    this._questionNumber = 1
    this._userAnswer = ''
    this._points = 0
    this._totalTime = 0
    this._countdownTime = this._timeLimit
    this._intervalID = null
    this._highScores = {}
  }

  _lostGame () {
    // Clear space and set up template for further flow
    this._gameBody.removeChild(this.shadowRoot.querySelector('#quizView'))
    this._gameBody.appendChild(htmlLostGameView.content.cloneNode(true))

    this._gameBody.querySelector('#restartButton').addEventListener('click', e => {
      this._gameBody.removeChild(this.shadowRoot.querySelector('#lostGameView'))
      this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
      this._gameBody.querySelector('#nickInputButton').addEventListener('click', this._preStart.bind(this))
    })
    let text = this._gameBody.querySelector('#lostGameText')
    clearInterval(this._intervalID)
    if (this._countdownTime <= 0) {
      text.textContent = 'Time ran out.'
    } else {
      text.textContent = 'Your answer was incorrect.'
    }
    this._clearVars()
  }
}
