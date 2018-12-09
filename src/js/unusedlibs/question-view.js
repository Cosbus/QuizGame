import {
  htmlQuizView,
  htmlAnswerSpaceText,
  htmlAnswerSpaceButtons } from '../html.js'

export default class QuestionView {
  constructor (template, player, question) {
    this._gameHTMLBody = template
    this._gameHTMLBody.appendChild(htmlQuizView.content.cloneNode(true))
    this._question = question
    this._player = player

    // variables related to the timer
    this._intervalID = null
    this._timeLimit = 20
    this._countdownTime = this._timeLimit
    this._timerRefreshRate = 10
    this._timerDecrement = this._timerRefreshRate / 1000
    this._timeDecimalNr = 2
  }

  connectedCallback () {
  }

  async renderQuestion () {
    // First we clear the question area
    let qArea = this._gameHTMLBody.querySelector('#clearableDiv')
    qArea.innerHTML = ''
    let result

    // Fetch the question data
    this._question.fetchQuestion().then(() => {
      this._gameHTMLBody.querySelector('#questionText').textContent =
      this._question.getQuestion()
      // find out whether the question offers alternatives and act accordingly
      if (!this._question.isAlternatives()) {
        return this._setupTextInput(qArea)
      } else {
        return this._setupAlternatives(qArea)
      }
    })

    // Then we set up the informational areas
    this._gameHTMLBody.querySelector('#questionNr').textContent =
     `Question #${this._question.getQuestionNumber()}`
    this._gameHTMLBody.querySelector('#player').textContent = this._player.getName()
    return Promise.resolve(this._startTimer())
  }

  continue (flag) {
    console.log('inne i continue')
    console.log(flag)
    console.log(this._question)
    console.log(this._question.getNextUrl())
    if (flag) { // Time is not up
      console.log('innanför time is not up')
      this._player.setTime(this._player.getTime() +
           (this._timeLimit - this._countdownTime))
      this._clearTimer()
      console.log(this._question.getNextUrl())
      if (!(this._question.getNextUrl() === '0')) { // there are more questions
        console.log('det finns fler frågor')
        if (this._question.didUserAnswerCorrect()) { // Answered correct
          console.log('inne för att hämta fler frågor')
          this.renderQuestion()
        } else { // Answered wrong
          console.log('kom in i felsvarsgrejen')
          this._gameHTMLBody.removeChild(this._gameHTMLBody.querySelector('#quizView'))
          return 1
        }
      } else { // No more questions
        this._gameHTMLBody.removeChild(this.shadowRoot.querySelector('#quizView'))
        console.log('no more questions...')
        return 0
      }
    } else { // Time is up
      this._clearTimer()
      return 2
    }
  }

  _setupTextInput (qArea) {
    qArea.appendChild(htmlAnswerSpaceText.content.cloneNode(true))
    return this._gameHTMLBody.querySelector('#answerInputButton').addEventListener('click',
      e => {
        clearInterval(this._intervalID)
        this._question.setUserAnswer(this._gameHTMLBody.querySelector('#userAnswerInput').value)
        return Promise.resolve(this._question.sendAnswer().then(this.continue(true)))
      })
  }

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
    return this._gameHTMLBody.querySelector('#answerRadioButton').addEventListener('click',
      e => {
        let radioButtons = this._gameHTMLBody.querySelectorAll('.radioButtons')
        for (let button of radioButtons) {
          if (button.querySelector('#radioButton').checked) {
            clearInterval(this._intervalID)
            this._question.setUserAnswer(button.getAttribute('id'))
            return this._question.sendAnswer().then(this.continue(true))
          }
        }
      })
  }

  _startTimer () {
    // any previous timers must be cleared and the timer reset
    clearInterval(this._intervalID)
    this._countdownTime = this._question.getTimeLimit()

    this._intervalID = setInterval(() => {
      this._gameHTMLBody.querySelector('#time').textContent = this._countdownTime
      this._countdownTime -= this._timerDecrement
      if (this._countdownTime <= 0) {
        this._clearTimer()
        return this.continue(false, false)
      }
      this._countdownTime = this._cropTime(this._countdownTime, this._timeDecimalNr)
    }, this._timerRefreshRate)
  }

  /**
   * A function which crops the time, i.e. returns a time rounded to the decimal number
   * number given as a parameter
   *
   * @param {number} time the time to crop
   * @param {number=2} decimals the number of decimals to round to
   */
  _cropTime (time, decimals = 2) {
    return parseFloat(Math.round(time * 10000) / 10000).toFixed(decimals)
  }

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
