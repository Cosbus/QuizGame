
export default class Player {
  constructor (name = 'Kim Doe') {
    this._name = name
    this._totalTime = 0
  }

  setName (name) {
    this._name = name
  }

  getName () {
    return this._name
  }

  setTime (time) {
    this._totalTime = time
  }

  getTime () {
    return this._totalTime
  }

  clearPlayer () {
    this._name = ''
    this._totalTime = 0
  }
}
