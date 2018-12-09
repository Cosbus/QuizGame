import { htmlEndGameTemplate } from '../html.js'
import HighScores from '../HighScores.js'

export default class EndGameView extends window.HTMLElement {
  constructor (htmlTemplate, player, controller) {
    super()

    this._gameHTMLBody = htmlTemplate
    this._gameHTMLBody.removeChild(this._gameHTMLBody.querySelector('#quizView'))
    this._gameHTMLBody.appendChild(htmlEndGameTemplate.content.cloneNode(true))
    this._player = player
    this._highScores = new HighScores()

    this._controller = controller
  }

  connectedCallback () {
    this._renderView()
    // Set up listener for button
    this._gameHTMLBody.querySelector('#startOverButton').addEventListener('click',
      e => {
        this._gameHTMLBody.removeChild(this._gameHTMLBody.querySelector('#endGame'))
        this._controller.restart()
      })
  }

  _renderView () {
    // Set time information in view
    let titleText = `Well done ${this._player.getName()}!`
    let timeText = `It took you a total of ${this._player.getTime()} seconds to answer
    all questions!`
    this._gameHTMLBody.querySelector('#totalTime').textContent = timeText
    this._gameHTMLBody.querySelector('#endTitle').textContent = titleText

    // Set up the high scores
    this._highScores.setHighScores(this._player.getName(), this._player.getTime())

    // First get the template for the list-item and clone it
    let firstItem = this._gameHTMLBody.querySelector('#item1')
    let collection = this._gameHTMLBody.querySelector('#collection')

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
  }
}
