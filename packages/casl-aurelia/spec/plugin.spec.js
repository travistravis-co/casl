import './spec_helper' // eslint-disable-line
import { defineAbility, PureAbility as Ability } from '@casl/ability'
import { ComponentTester } from 'aurelia-testing'
import { BindingEngine } from 'aurelia-binding'
import { bootstrap } from 'aurelia-bootstrapper'
import { configure } from '../src'

describe('CASL Aurelia plugin', () => {
  let component
  let ability

  beforeEach(() => {
    component = new ComponentTester()
      .inView('${"read" | able: post}') // eslint-disable-line
      .boundTo({ post: new Post() })
  })

  afterEach(() => {
    component.dispose()
  })

  describe('when `PureAbility` instance is passed as a plugin parameter', () => {
    beforeEach(async () => {
      ability = defineAbility(can => can('read', 'Post'))
      await configureApp(component, aurelia => configure(aurelia.use, ability))
    })

    it('registers that instance in DI container', () => {
      expect(component.container.get(Ability)).to.equal(ability)
    })

    it('allows to check abilities using `can` value converter', () => {
      expect(document.body.textContent).to.equal('true')
    })

    it('re-calls `can` value converter when that instance is updated', async () => {
      ability.update([])
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(document.body.textContent).to.equal('false')
    })
  })

  describe('when `PureAbility` instance is not passed as a plugin parameter', () => {
    beforeEach(async () => {
      await configureApp(component, aurelia => configure(aurelia.use))
    })

    it('creates an empty instance and registers it in DI container', () => {
      ability = component.container.get(Ability)

      expect(ability).to.be.instanceof(Ability)
      expect(ability.rules).to.be.empty
    })

    it('allows to check abilities using `can` value converter', () => {
      expect(document.body.textContent).to.equal('false')
    })

    it('re-calls `can` value converter when that instance is updated', async () => {
      component.container.get(Ability).update([{ subject: 'Post', action: 'read' }])
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(document.body.textContent).to.equal('true')
    })
  })

  describe('when `PureAbility` instance is not passed as a plugin parameter but was registered in DI container', () => {
    beforeEach(async () => {
      ability = defineAbility(can => can('read', 'Post'))
      await configureApp(component, (aurelia) => {
        aurelia.container.registerInstance(Ability, ability)
        configure(aurelia.use)
      })
    })

    it('allows to check abilities using `can` value converter', () => {
      expect(document.body.textContent).to.equal('true')
    })

    it('re-calls `can` value converter when that instance is updated', async () => {
      ability.update([])
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(document.body.textContent).to.equal('false')
    })
  })

  class Post {
    constructor(attrs) {
      Object.assign(this, attrs)
    }
  }

  function configureApp(cmp, callback) {
    cmp.bootstrap((aurelia) => {
      cmp.container = aurelia.container
      aurelia.use.standardConfiguration()
      aurelia.container.get(BindingEngine).observerLocator.dirtyChecker.checkDelay = 20
      callback(aurelia)
    })

    return cmp.create(bootstrap)
  }
})
