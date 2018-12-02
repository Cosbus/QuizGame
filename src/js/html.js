const htmlGameTemplate = document.createElement('template')
htmlGameTemplate.innerHTML = /* html */ `
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
</head>
`

const htmlFirstPageTemplate = document.createElement('template')
htmlFirstPageTemplate.innerHTML = /* html */ `
<div id="nick" class="center">
  <h1>Welcome to the quiz!</h1>
  <p>Please input your nickname below then press "submit"</p>
  <div class="input-field col s6">
    <input id="nickInput" type="text" class="center" >
    <label for="last_name"></label>
  </div>
  <a class="waves-effect waves-light btn" id="nickInputButton">Submit</a>
</div>
`

const htmlStartingGameTemplate = document.createElement('template')
htmlStartingGameTemplate.innerHTML = /* html */ `
<div id="start" class="center">
  <h1 id="thanks">Thank you </h1>
  <p>When you are ready press "Lets start!". Remember that you will be timed :)</p>
  <a class="waves-effect waves-light btn" id="startButton">Lets start!</a>
</div>
`

const htmlQuizView = document.createElement('template')
htmlQuizView.innerHTML = /* html */ `
<div id="quizView">
  <div class="center">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title" id="questionNr"></span>
          <p id="questionText"></p>
        </div>
        <div class="card-action" id="answerSpace">
          <div id="clearableDiv">
          </div>
          <p id="time"></p><p id="player"></p>
        </div>
      </div>
    </div>
  </div>
</div>
`

const htmlAnswerSpaceText = document.createElement('template')
htmlAnswerSpaceText.innerHTML = /* html */ `
<div class="input-field col s6">
  <input id="userAnswerInput" type="text" class="center" >
  <label for="userAnswerInput"></label>
</div>

<a class="waves-effect waves-light btn" id="answerInputButton">Submit</a>
`

const htmlAnswerSpaceButtons = document.createElement('template')
htmlAnswerSpaceButtons.innerHTML = /* html */ `
<div class="input-field col s6" id="buttonArea">
  <a class="waves-effect waves-light btn answerButtons"></a>
</div>
`

const htmlLostGameView = document.createElement('template')
htmlLostGameView.innerHTML = /* html */ `
<div id="lostGameView">
  <div class="center">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title" id="lost">You lost.</span>
          <p id="lostGameText"></p>
        </div>
        <div class="card-action" id="infoSpace">
          <div class="input-field col s6" id="buttonArea">
            <a class="waves-effect waves-light btn answerButtons" id="restartButton">Restart</a>
          </div>
          <p id="time"></p><p id="player"></p>
        </div>
      </div>
    </div>
  </div>
</div>
`

const htmlEndGameTemplate = document.createElement('template')
htmlEndGameTemplate.innerHTML = /* html */ `
<div id="endGame" class="center">
  <h1>Well Done!</h1>
  <div class="input-field col s6" id="infoDiv">
    <p id="totalTime"></p>
  </div>
  <a class="waves-effect waves-light btn" id="startOverButton">Start over</a>
</div>
`
export {
  htmlGameTemplate,
  htmlFirstPageTemplate,
  htmlStartingGameTemplate,
  htmlQuizView,
  htmlAnswerSpaceText,
  htmlAnswerSpaceButtons,
  htmlLostGameView,
  htmlEndGameTemplate
}
