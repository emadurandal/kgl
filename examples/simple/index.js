import { KglAuto } from '../../src/index.js'

new KglAuto({
  programs: {
    main: {
      fragmentShaderId: 'fs',
      uniforms: {
        uTime: 0,
      },
    },
  },
  tick: (kgl, time) => {
    kgl.programs.main.uniforms.uTime = time
    kgl.draw()
  },
})
