if (typeof window.GeogebraMoodleElements === 'undefined') {
  // Normalement ce script ne devrait être chargé qu'une unique fois car appelé en module
  // On vérifie tout de même au cas où que le fichier ne soit pas appelé en module

  var deployggb = document.createElement('script')
  deployggb.onload = function () {
    customElements.define('geogebra-moodle', GeogebraMoodle)
  }
  deployggb.src = 'https://www.geogebra.org/apps/deployggb.js'
  document.head.appendChild(deployggb);

  window.GeogebraMoodleElements = []

  /*window.addEventListener('message', (event) => {
    if (typeof event.data == 'string' && event.data.startsWith('AppChecked|')) {
      const iMoodle = 0
      if (typeof window.GeogebraMoodleElements[iMoodle] !== 'undefined') {
        const iframe = window.GeogebraMoodleElements[iMoodle]
        const datas = event.data.split('|')
        if (datas[3]) { // AppChecked|Name|Time|S;c;o;r;e|UserId?
          const scores = datas[3].split(';')
          const maxScore = scores.length
          const score = scores.filter(x => x == '1').length
          const moodleScore = Math.round(score / maxScore * 10) * 10
          if (iframe.parentNode.parentNode.querySelector('[name$="_answer"]').value != '') {
            alert('Vous aviez déjà obtenu une note pour cet exercice, la note n\'a donc pas été mise à jour.');
          } else {
            iframe.parentNode.parentNode.querySelector('[name$="_answer"]').value = moodleScore
            iframe.parentNode.parentNode.querySelector('[name$="_-submit"]')?.click()
          }
        }
      }
    }
  })*/

  const style = document.createElement('style')
  style.innerHTML = '.geogebra-question-type .form-inline, .geogebra-question-type .im-controls, .geogebra-question-type .rightanswer { display: none; }'
  style.innerHTML += '.geogebracontainer { max-width:100% !important; overflow: hidden; } .geogebra-blur { filter: blur(5px); pointer-events: none; }'
  document.head.appendChild(style)

  class GeogebraMoodle extends HTMLElement {
    connectedCallback() {
      let APP_ID
      try {
        APP_ID = this.getAttribute('app')
      } catch (e) {
        PAGE_URL = 'data:text,' + e
      }

      const VARIABLE = this.getAttribute('variable') || 'grade';
      const MAXSCORE = this.getAttribute('maxscore') || 100;

      // Geogebra n'accepte pas les shadowRoot
      // const shadow = this.attachShadow({ mode: 'open' }) // this.shadowRoot

      const iMoodle = window.GeogebraMoodleElements.length;
      let SEED = this.getAttribute('graine') || 'auto'; // auto pour récupérer la graine depuis l'id de la question

      let questionDiv = this.parentNode
      // On remonte de parent en parent depuis la balise script jusqu'à trouver le div avec le numero de la question en id
      while (questionDiv !== null) { // s'arrêtera lorsqu'il n'y aura plus de parents
        if (typeof questionDiv.id === 'string' && questionDiv.id.startsWith('question-')) {
          if (SEED === 'auto') {
            let m;
            if(m = questionDiv.id.match(/^question-([0-9]+)-([0-9]+)$/)) {
              SEED = parseInt(m[1]) + parseInt(m[2]);
            }
          }
          break
        }
        questionDiv = questionDiv.parentNode
      }

      if (questionDiv === null) {
        shadow.appendChild(document.createTextNode('[Erreur de détection de la l’environnement moodle]'))
        return
      }

      questionDiv.classList.add('geogebra-question-type')

      const iframe = document.createElement('div')
      iframe.classList.add('geogebracontainer')
      this.iframe = iframe
      window.GeogebraMoodleElements.push(this)

      this.afficherPopupDejaFait = () => {
        iframe.classList.add('geogebra-blur') // geogebra va retirer le style, il faut passer par une classe
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Vous avez déjà effectué cet exercice';
        successMessage.setAttribute('style', 'position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: lightgreen;padding: 10px;border: 1px solid green;color: green;');
        this.appendChild(successMessage)
      }
      
      this.appendChild(iframe)

      let appletOnLoad;
      if (!questionDiv.classList.contains('notyetanswered')) {
        this.afficherPopupDejaFait()
        appletOnLoad = (api) => {
          if (api.getValueString('correction') !== '') {
            iframe.classList.remove('geogebra-blur');
            api.setAuxiliary('correction', true);
            api.setValue('correction', 1);
          }
        };
      } else {
        appletOnLoad = (api) => {
          // api.setWidth(iframe.offsetWidth);
          api.setAuxiliary(VARIABLE, true);
          api.registerObjectUpdateListener(VARIABLE, () => {
            if(SEED !== '-1') { // -1 on aléatoire à chaque actualisation donc pas de graine
              api.evalCommand('SetSeed(' + SEED + ')');
            } 
            /*
              SCORE / MAXSCORE => [0, 1]
              (SCORE/MAXSCORE) * 10 => [0, 10]
              ARRONDI(SCORE/MAXSCORE) => {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
              ARRONDI(SCORE/MAXSCORE) * 10 => {0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100}
            */
             const moodleScore = Math.round((api.getValue(VARIABLE) / MAXSCORE) * 10) * 10;
             this.parentNode.parentNode.querySelector('[name$="_answer"]').value = moodleScore
             this.parentNode.parentNode.querySelector('[name$="_-submit"]')?.click()
          });
        };
      }
        var applet = new GGBApplet({
          id: "geogebra-moodle-" + iMoodle,
          scaleContainerClass: 'geogebracontainer',
          // autoHeight: true,
          // width: iframe.offsetWidth,
          material_id: APP_ID,
          showFullScreenButton: true,
          appletOnLoad
        });
        applet.inject(iframe);

    }

    attributeChangedCallback(name, oldValue, newValue) {
      name === 'height' && (this.iframe.style.height = newValue)
    }

    static get observedAttributes() { return ['height'] }
  }


}