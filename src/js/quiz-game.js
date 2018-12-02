import cssTemplate from './css.js'
import {
  htmlGameTemplate,
  htmlFirstPageTemplate,
  htmlStartingGameTemplate,
  htmlQuizView,
  htmlAnswerSpaceText,
  htmlAnswerSpaceButtons,
  htmlLostGameView } from './html.js'

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
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(htmlGameTemplate.content.cloneNode(true))
    this.shadowRoot.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
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

  connectedCallback () {
    this.shadowRoot.querySelector('#nickInputButton').addEventListener('click', this._preStart.bind(this))
  }

  _preStart (event) {
    console.log(event.target.getAttribute('id'))
    let nick = this.shadowRoot.querySelector('#nickInput')
    this._nickname = nick.value
    this.shadowRoot.removeChild(this.shadowRoot.querySelector('#nick'))
    this.shadowRoot.appendChild(htmlStartingGameTemplate.content.cloneNode(true))
    this.shadowRoot.querySelector('#thanks').textContent += this._nickname
    this.shadowRoot.querySelector('#startButton').addEventListener('click', this._startGame.bind(this))
  }

  _startGame (event) {
    this.shadowRoot.removeChild(this.shadowRoot.querySelector('#start'))
    this.shadowRoot.appendChild(htmlQuizView.content.cloneNode(true))
    this._fetchQuestion()
  }

  async _fetchQuestion () {
    let result = await window.fetch(this._questionUrl)
    result = await result.json()
    this._question = result.question
    this._answerUrl = result.nextURL
    this._renderQuestion(result)
  }

  _renderQuestion (result) {
    // First we clear the question area
    let qArea = this.shadowRoot.querySelector('#clearableDiv')
    qArea.innerHTML = ''

    // Then we set up the informational areas
    this.shadowRoot.querySelector('#questionNr').textContent =
     `Question #${this._questionNumber++}`
    let questionTextSpace = this.shadowRoot.querySelector('#questionText')
    questionTextSpace.textContent = this._question
    this.shadowRoot.querySelector('#player').textContent = `Player: ${this._nickname}`
    this._startTimer()

    // find out whether the question offers alternatives and act accordingly
    if (!result.alternatives) {
      this._setupTextInput(result, qArea)
    } else {
      console.log(result.alternatives)
      this._setupAlternatives(result, qArea)
    }
  }

  _setupTextInput (result, qArea) {
    qArea.appendChild(htmlAnswerSpaceText.content.cloneNode(true))
    this.shadowRoot.querySelector('#answerInputButton').addEventListener('click', e => {
      this._userAnswer = this.shadowRoot.querySelector('#userAnswerInput').value
      this._sendAnswer()
    })
  }

  _setupAlternatives (result, qArea) {
    qArea.appendChild(htmlAnswerSpaceButtons.content.cloneNode(true))
    let alternatives = result.alternatives
    let keys = Object.keys(alternatives)
    let alts = Object.values(alternatives)

    // get the template for the button
    let firstBtn = this.shadowRoot.querySelector('.answerButtons')
    firstBtn.textContent = alts[0]
    firstBtn.setAttribute('id', keys[0])
    let btnSpace = this.shadowRoot.querySelector('#buttonArea')

    // set up a button for each alternative
    for (let i = 1; i < alts.length; i++) {
      let text = alts[i]
      let btn = firstBtn.cloneNode(true)
      btn.setAttribute('id', keys[i])
      btnSpace.appendChild(btn)
      btn.textContent = text
    }

    // Set up a delegating eventListener
    this.shadowRoot.querySelector('#buttonArea').addEventListener('click', e => {
      let buttons = this.shadowRoot.querySelectorAll('.answerButtons')

      for (let button of buttons) {
        if (e.target.getAttribute('id') === button.getAttribute('id')) {
          this._userAnswer = button.getAttribute('id')
          this._sendAnswer()
          console.log(this._userAnswer)
        }
      }
    })
  }

  _startTimer () {
    clearInterval(this._intervalID)
    this._countdownTime = this._timeLimit
    let text = this.shadowRoot.querySelector('#time')
    this._intervalID = setInterval(() => {
      text.textContent = `Time left: ${this._countdownTime}`
      this._countdownTime -= 0.1
      if (this._countdownTime <= 0) {
        this._lostGame()
      }
      this._countdownTime = parseFloat(Math.round(this._countdownTime * 100) / 100).toFixed(1)
    }, 100)
  }

  async _sendAnswer () {
    console.log(this._userAnswer)
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
    if (result.message === 'Correct answer!') {
      this._questionUrl = result.nextURL
      console.log(result.nextURL)
      this._points++
      this._totalTime += (this._timeLimit - this._countdownTime)
      console.log(this._totalTime)
      this._fetchQuestion()
    } else {
      console.log(result.message)
      this._lostGame()
    }
  }

  _lostGame () {
    // Clear space and set up template for further flow
    this.shadowRoot.removeChild(this.shadowRoot.querySelector('#quizView'))
    this.shadowRoot.appendChild(htmlLostGameView.content.cloneNode(true))
    this.shadowRoot.querySelector('#restartButton').addEventListener('click', e => {
      this.shadowRoot.removeChild(this.shadowRoot.querySelector('#lostGameView'))
      this.shadowRoot.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
      this.shadowRoot.querySelector('#nickInputButton').addEventListener('click', this._preStart.bind(this))
      this._preStart.bind(this)
    })
    let text = this.shadowRoot.querySelector('#lostGameText')
    clearInterval(this._intervalID)
    if (this._countdownTime <= 0) {
      text.textContent = 'Time ran out.'
    } else {
      text.textContent = 'Your answer was incorrect.'
    }

    // Clear and zero the different variables
    this._questionUrl = this._startingUrl
    this._answerUrl = ''
    this._question = ''
    this._questionNumber = 1
    this._userAnswer = ''
    this._points = 0
    this._totalTime = 0
    this._countdownTime = this._timeLimit
    this._intervalID = null
  }

  /* this.shadowRoot.querySelector('#text').addEventListener('click', async e => {
      console.log('klick!')
    })

    this.shadowRoot.querySelector('#text2').addEventListener('click', this._sendPost())
  }

  async _sendPost () {
    console.log('klick2!')
    let result = await window.fetch('http://vhost3.lnu.se:20080/answer/1',
      {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ 'answer': 2 }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      })
    result = await result.json()
    console.log(result)
    console.log('{answer: 2}')
    console.log(JSON.stringify('{answer: 2}'))
  } */
}
