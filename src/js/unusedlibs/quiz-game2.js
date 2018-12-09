import cssTemplate from '../css.js'
import {
  htmlGameTemplate,
  htmlFirstPageTemplate,
  htmlStartingGameTemplate
} from '../html.js'
import Player from '../Player.js'
import QuestionView from './question-view.js'
import EndGameView from './endgame-view.js'
import LostGameView from './lostgame-view.js'
import Question from '../Question.js'

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

    this._player = new Player()
    this._question = new Question()
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
    this._gameBody.querySelector('#nickInputButton').addEventListener('click',
      this._preQuiz.bind(this))
  }

  restart () {
    // this._gameBody = this.shadowRoot.querySelector('#gameBody')
    this._gameBody.appendChild(htmlFirstPageTemplate.content.cloneNode(true))
    this.connectedCallback()
  }

  _preQuiz (event) {
    this._player.setName(this._gameBody.querySelector('#nickInput').value)
    this._gameBody.removeChild(this._gameBody.querySelector('#nick'))
    this._gameBody.appendChild(htmlStartingGameTemplate.content.cloneNode(true))
    this._gameBody.querySelector('#thanks').textContent += this._player.getName()
    this._gameBody.querySelector('#startButton').addEventListener('click',
      e => {
        this._gameBody.removeChild(this.shadowRoot.querySelector('#start'))
        let qw = new QuestionView(this._gameBody, this._player, this._question)
        qw.renderQuestion().then(function (result) {
          if (result === 0) {
            this.endGame()
          } else if (result === 1) {
            this.lostGame(1)
          } else {
            this.lostGame(2)
          }
        })
      })
  }

  endGame () {
    let egw = new EndGameView(this._player)
  }

  /**
   * A function which handles when the user has lost the game
   *
   * @param {number} flag sets how the user lost (1 = incorrect answer, 2 = time ran out)
   */
  lostGame (flag) {
    let lgw = new LostGameView(this._gameBody, flag)
  }

  clearAll () {
    this._question.clearQuestion()
    this._player.clearPlayer()
  }
}
