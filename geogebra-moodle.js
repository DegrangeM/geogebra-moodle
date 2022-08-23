if (typeof window.GeogebraMoodleElements === 'undefined') {
  // Normalement ce script ne devrait être chargé qu'une unique fois car appelé en module
  // On vérifie tout de même au cas où que le fichier ne soit pas appelé en module

  var deployggb = document.createElement('script')
  deployggb.onload = function () {
    var applet = new GGBApplet({material_id:"XXXXX"})
    applet.inject('ggb-element');
    const api = applet.getAppletObject()
  }
  deployggb.src = 'https://www.geogebra.org/apps/deployggb.js'
  document.head.appendChild(deployggb);

  window.GeogebraMoodleElements = []

  window.addEventListener('message', (event) => {
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
  })

  const style = document.createElement('style')
  style.innerHTML = '.geogebra-question-type .form-inline, .geogebra-question-type .im-controls, .geogebra-question-type .rightanswer { display: none; }'
  document.head.appendChild(style)

  class GeogebraMoodle extends HTMLElement {
    connectedCallback() {
      let APP_ID
      try {
        APP_ID = this.getAttribute('app')
      } catch (e) {
        PAGE_URL = 'data:text,' + e
      }

      const shadow = this.attachShadow({ mode: 'open' }) // this.shadowRoot

      const iMoodle = window.GeogebraMoodleElements.length

      let questionDiv = this.parentNode
      // On remonte de parent en parent depuis la balise script jusqu'à trouver le div avec le numero de la question en id
      while (questionDiv !== null) { // s'arrêtera lorsqu'il n'y aura plus de parents
        if (typeof questionDiv.id === 'string' && questionDiv.id.startsWith('question-')) {
          break
        }
        questionDiv = questionDiv.parentNode
      }

      if (questionDiv === null) {
        shadow.appendChild(document.createTextNode('[Erreur de détection de la l’environnement moodle]'))
        return
      }

      questionDiv.classList.add('geogebra-question-type')

      const iframe = document.createElement('iframe')
      this.iframe = iframe
      window.GeogebraMoodleElements.push(this)

      iframe.setAttribute('width', '100%')
      iframe.style.height = '80vh'
      iframe.setAttribute('src', 'https://geogebra.org/watch?app=' + APP_ID)
      iframe.setAttribute('frameBorder', '0')
      iframe.setAttribute('allow', 'fullscreen')

      this.afficherPopupDejaFait = () => {
        iframe.style.pointerEvents = 'none'
        iframe.style.filter = 'blur(5px)'
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Vous avez déjà effectué cet exercice';
        successMessage.setAttribute('style', 'position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: lightgreen;padding: 10px;border: 1px solid green;color: green;');
        shadow.appendChild(iframe)
        shadow.appendChild(successMessage)
      }

      if (!questionDiv.classList.contains('notyetanswered')) {
        this.afficherPopupDejaFait()
      } else {
        if (iMoodle > 0) {
          alert('Attention, il y a déjà une intégration de Geogebra sur la page')
        }
        
        shadow.appendChild(iframe)
      }

    }

    attributeChangedCallback(name, oldValue, newValue) {
      name === 'height' && (this.iframe.style.height = newValue)
    }

    static get observedAttributes() { return ['height'] }
  }

  // Define the new element
  customElements.define('geogebra-moodle', GeogebraMoodle)
}