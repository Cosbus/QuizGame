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
        <div class="card-action">
          <div class="input-field col s6">
          <input id="userAnswerInput" type="text" class="center" >
          <label for="userAnswerInput"></label>
          </div>
          <p id="time"></p><p id="player"></p>
          <a class="waves-effect waves-light btn" id="answerInputButton">Submit</a>
        </div>
      </div>
    </div>
  </div>
</div>
`

export {
  htmlGameTemplate,
  htmlFirstPageTemplate,
  htmlStartingGameTemplate,
  htmlQuizView
}
