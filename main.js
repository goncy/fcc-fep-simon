const STEPS = ['green', 'red', 'yellow', 'blue']
const getRandomStep = () => STEPS[Math.floor(Math.random() * STEPS.length)]
const wait = (time) => new Promise(resolve => setTimeout(resolve, time))

window.app = new Vue({
  el: '#app',
  data: {
    level: 1,
    message: '',
    strict: false,
    status: 'init',
    steps: [getRandomStep()],
    lit: null,
    step: 1,
    audios: {
      green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
      red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
      yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
      blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    }
  },
  methods: {
    async play() {
      this.status = 'waiting'
      await wait(500)
      await this.playback()
      this.status = 'playing'
    },
    async playback() {
      for (let step of this.steps) {
        this.lit = step
        await wait(500)
        this.lit = null
        await wait(500)
      }
    },
    async reset() {
      this.step = 1
      this.lit = null
      this.message = ''
      await wait(250)

      if (this.strict) {
        this.level = 1
        this.steps = [getRandomStep()]
      }

      this.play()
    },
    hardReset() {
      status = 'init'
      this.step = 1
      this.lit = null
      this.level = 1
      this.steps = [getRandomStep()]
      this.message = ''
    },
    async clicked(key) {
      // Correct click
      if (key === this.steps[this.step - 1]) {
        this.lit = key
        await wait(200)
        this.lit = null

        if (this.step === this.steps.length) {
          this.addLevel()
          await wait(250)
          this.play()
        } else {
          this.step++
        }
      } else {
        // Incorrect click
        this.lit = key
        this.status = 'waiting'
        this.message = 'You lost!'
        await wait(2000)
        this.reset()
      }
    },
    addLevel() {
      if (this.level < 20) {
        this.level++
        this.step = 1
        this.steps.push(getRandomStep())
      } else {
        this.hardReset()
        this.message = "You won!"
      }
    },
    toggleStrict() {
      this.strict = !this.strict
    }
  },
  computed: {
    playing() {
      return this.status === 'playing'
    },
    waiting() {
      return this.status === 'waiting'
    },
    init() {
      return this.status === 'init'
    }
  }
})