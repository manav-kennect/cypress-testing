

before(() => {
  window.testedSelectors = []
})

after(() => {
  const selectors = Cypress._.uniq(window.testedSelectors)

  console.log('tested the following selectors:', selectors)

 
  const win = cy.state('window')

  selectors.forEach((selector) => {
    const el = win.document.querySelector(selector)

    if (el) {
      el.style.opacity = 1
      el.style.border = '2px solid magenta'
    }
  })

  
})

const getSelector = ($el) => {
  if ($el.attr('data-cy')) {
    console.log($el)
    return `[data-cy=${$el.attr('data-cy')}]`
  }
  else {
    return `[cy-data=${$el.attr('cy-data')}]`
  }

}

const rememberSelector = ($el) => {
  const selector = getSelector($el)

  window.testedSelectors.push(selector)
}

Cypress.Commands.overwrite('type', function (type, $el, text, options) {
  rememberSelector($el)

  return type($el, text, options)
})

Cypress.Commands.overwrite('check', function (check, $el, options) {
  rememberSelector($el)

  return check($el, options)
})

Cypress.Commands.overwrite('click', function (click, $el, options) {
  rememberSelector($el)

  return click($el, options)
})