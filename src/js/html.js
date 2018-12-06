const htmlGameTemplate = document.createElement('template')
htmlGameTemplate.innerHTML = /* html */ `
<head>
 <!--Import materialize.css-->
 <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet">
</head>
  <body>
  <div class="container" id="gameBody">
  </div>
</body>
`

// Template for the first view of the Game
const htmlFirstPageTemplate = document.createElement('template')
htmlFirstPageTemplate.innerHTML = /* html */ `
<div id="nick" class="center">
  <div class="row">
      <h1>Welcome to the quiz!</h1>
  </div>
  <div class="row">
    <p>Please input your nickname below then press "submit"</p>
  </div>
  <div class="row">
    <div class="input-field">
        <div class="col s3"></div>
        <div class="col s1"><i class="material-icons prefix">account_circle</i></div>
        <div class="col s4"><input id="nickInput" type="text" class="center"></div>
        <div class="col s4"></div>
    </div>
  </div>
  <div class="row">
    <button class="waves-effect waves-light btn"  type="submit" name="action" id="nickInputButton">Submit
      <i class="material-icons right">send</i>
    </button>
  </div>
</div>
`

// The view prior to starting the quiz, so the user can get her/his bearing before starting
const htmlStartingGameTemplate = document.createElement('template')
htmlStartingGameTemplate.innerHTML = /* html */ `
<div id="start" class="center">
  <div class="row">
    <h1 id="thanks">Thank you </h1>
  </div>
  <div class="row">
    <p>When you are ready press "Lets start!". Remember that you will be timed :)</p>
  </div>
  <div class="row">
    <button class="waves-effect waves-light btn" id="startButton">
      Lets start!
      <i class="material-icons right">send</i>
    </button>
  </div>
</div>
`
// The card-view during the quiz
const htmlQuizView = document.createElement('template')
htmlQuizView.innerHTML = /* html */ `
<div id="quizView">
  <div class="center">
    <div class="col s12">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <div class="row">
            <span class="card-title" id="questionNr"></span>
          </div>
          <div class="row">
            <p id="questionText"></p>
          </div>
        </div>
        <div class="card-action" id="answerSpace">
          <div id="clearableDiv">
          </div>
          <div class="row">
            <div class="col s5">
            </div>
            <div class="col s1">
              <div>
                <i class="material-icons icon-white">schedule</i>
              </div>
              <div id="time">
              </div>
            </div>
            <div class="col s1">
              <div>
                <i class="material-icons icon-white">account_circle</i>
              </div>
              <div id="player">
              </div>
            <div class="col s5">
            </div>
        </div>
      </div>
    </div>
  </div>
</div>
`

// If the answer is given in text this template is used
const htmlAnswerSpaceText = document.createElement('template')
htmlAnswerSpaceText.innerHTML = /* html */ `
<div class="row">
  <div class="input-field">
      <div class="col s4"></div>
      <div class="col s4"><input id="userAnswerInput" type="text" class="center"></div>
      <div class="col s4"></div>
  </div>
</div>
<div class="row">
  <button class="waves-effect waves-light btn" id="answerInputButton">
    Submit
    <i class="material-icons right">send</i>
  </button>
</div>
`

const htmlAnswerSpaceButtons = document.createElement('template')
htmlAnswerSpaceButtons.innerHTML = /* html */ `
<div class="row" id="buttonArea">
  <p class="radioButtons">
    <label>
     <input class="with-gap" name="group3" type="radio" id="radioButton">
      <span id="radioText" class='radio-color'></span>
    </label>
  </p>
</div>
<div class="row">
  <button class="waves-effect waves-light btn" id="answerRadioButton">
    Submit
    <i class="material-icons right">send</i>
  </button>
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
            <button class="waves-effect waves-light btn answerButtons" id="restartButton">
              Restart
              <i class="material-icons right">send</i>
            </button>
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
  <h1 id="endTitle"></h1>
  <div class="input-field col s6" id="infoDiv">
    <p id="totalTime"></p>
  </div>
  <button class="waves-effect waves-light btn" id="startOverButton">
    Start over
    <i class="material-icons right">send</i>
  </button>
  <div class="input-field col s6" id="highScore">
    <ul class="collection with-header" id="collection">
        <li class="collection-header"><h4>High Scores</h4></li>
        <li class="collection-item" id="item1">
        <div class="li-container" id="first-li-box">
          <div class="first-li-item" id="firstItem">
             <i class="material-icons icon-black">account_circle</i>
          </div>
          <div class="second-li-item" id="secondItem">
            <i class="material-icons icon-black">schedule</i>
          </div>
          <div class="clear">
          </div>
        </div>
        </li>
      </ul>
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
