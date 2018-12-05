const gameTemplate = document.createElement('template')
gameTemplate.innerHTML = /* html */ `

<style>
  :host {
    
  }

  @font-face {
      font-family: 'Material Icons';
      font-style: normal;
      font-weight: 400;
      src: url(../fonts/materializecss.woff2) format('woff2'),
    }
  
  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
  p {
    
  }

  .center {
    text-align:center;
  }

  .li-container {
    width: 100%;
  }

  .first-li-item {
    float: left;
    width: 40%
  }

  .second-li-item {
    float: right;
    width: 40%;
  }

  .clear {
    clear: both;
  }

#buttonArea{

  }

  #answerButtons {
    color: red;
  }
  
  #templateButton {
    padding: 25;
    color: red;
  }
  
</style>
`

export default gameTemplate
