import { htmlLostGameView } from '../html.js'

export default class LostGameView {
  constructor (template, controller, flag = 1) {
    this._gameHTMLBody = template
    this._gameHTMLBody.appendChild(htmlLostGameView.content.cloneNode(true))
    this._controller = controller

    // A flag indicating how the user lost (0 = time ran out, 1 = incorrect answer)
    this._flag = flag
    console.log('Inne i lostgameview?!!')
  }

  connectedCallback () {
    this._renderView()
    this._gameHTMLBody.querySelector('#restartButton').addEventListener('click', e => {
      this._gameBody.removeChild(this.shadowRoot.querySelector('#lostGameView'))
      this._controller.restart()
    })
  }

  renderView () {
    let text = this._gameHTMLBody.querySelector('#lostGameText')
    clearInterval(this._intervalID)
    if (this._flag === 0) {
      text.textContent = 'Time ran out.'
    } else {
      text.textContent = 'Your answer was incorrect.'
    }
  }
}
