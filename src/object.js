import {
  createMatrix,
  identity,
  multiply,
  rotate,
  scale,
  translate,
} from './minMatrix.js'

export default class ObjectGl {
  constructor(kgl, option = {}) {
    this.isProgram = false
    this.children = []

    this.kgl = kgl

    this.hasMatrix = 'hasMatrix' in option ? option.hasMatrix : true
    if (!this.hasMatrix) return

    this.mMatrix = createMatrix()
    this.mvpMatrix = createMatrix()
    this._translate = [0, 0, 0]
    this._scale = [1, 1, 1]
    this._rotate = [0, 0, 0]
    this.isUpdateMatrix = false

    if ('x' in option) {
      this.x = option.x
    }
    if ('y' in option) {
      this.y = option.y
    }
    if ('z' in option) {
      this.z = option.z
    }
    if ('scale' in option) {
      this.scale = option.scale
    }
    if ('scaleX' in option) {
      this.scaleX = option.scaleX
    }
    if ('scaleY' in option) {
      this.scaleY = option.scaleY
    }
    if ('scaleZ' in option) {
      this.scaleZ = option.scaleZ
    }
    if ('rotateX' in option) {
      this.rotateX = option.rotateX
    }
    if ('rotateY' in option) {
      this.rotateY = option.rotateY
    }
    if ('rotateZ' in option) {
      this.rotateZ = option.rotateZ
    }
    if ('rotate' in option) {
      this.rotate = option.rotate
    }
  }

  get x() {
    return this._translate[0]
  }

  set x(value) {
    this._translate[0] = value
    this.changeMatrix()
  }

  get y() {
    return this._translate[1]
  }

  set y(value) {
    this._translate[1] = value
    this.changeMatrix()
  }

  get z() {
    return this._translate[2]
  }

  set z(value) {
    this._translate[2] = value
    this.changeMatrix()
  }

  get scale() {
    return (this._scale[0] === this._scale[1]) === this._scale[2]
      ? this._scale[0]
      : null
  }

  set scale(value) {
    this._scale[0] = this._scale[1] = this._scale[2] = value
    this.changeMatrix()
  }

  get scaleX() {
    return this._scale[0]
  }

  set scaleX(value) {
    this._scale[0] = value
    this.changeMatrix()
  }

  get scaleY() {
    return this._scale[1]
  }

  set scaleY(value) {
    this._scale[1] = value
    this.changeMatrix()
  }

  get scaleZ() {
    return this._scale[2]
  }

  set scaleZ(value) {
    this._scale[2] = value
    this.changeMatrix()
  }

  get rotateX() {
    return this._rotate[0]
  }

  set rotateX(radian) {
    this._rotate[0] = radian
    this.changeMatrix()
  }

  get rotateY() {
    return this._rotate[1]
  }

  set rotateY(radian) {
    this._rotate[1] = radian
    this.changeMatrix()
  }

  get rotateZ() {
    return this._rotate[2]
  }

  set rotateZ(radian) {
    this._rotate[2] = radian
    this.changeMatrix()
  }

  get rotate() {
    return this.rotateZ
  }

  set rotate(radian) {
    this.rotateZ = radian
  }

  changeMatrix() {
    if (this.isUpdateMatrix) return

    this.kgl.setIsUpdateMatrix()
  }

  setIsUpdateMatrix() {
    if (!this.hasMatrix) return
    this.isUpdateMatrix = true

    if (!this.isProgram && this.children.length > 0) {
      for (let i = 0; i < this.children.length; i = (i + 1) | 0) {
        this.children[i].setIsUpdateMatrix()
      }
    }
  }

  updateMatrix(vpMatrix) {
    if (!this.hasMatrix) return

    const { isUpdateMatrix } = this

    if (isUpdateMatrix) {
      identity(this.mMatrix)

      translate(this.mMatrix, this._translate, this.mMatrix)

      rotate(this.mMatrix, this._rotate[0], [1, 0, 0], this.mMatrix)
      rotate(this.mMatrix, this._rotate[1], [0, 1, 0], this.mMatrix)
      rotate(this.mMatrix, this._rotate[2], [0, 0, 1], this.mMatrix)

      scale(
        this.mMatrix,
        [this._scale[0], this._scale[1], this._scale[2]],
        this.mMatrix
      )

      multiply(vpMatrix, this.mMatrix, this.mvpMatrix)

      if (!this.isProgram && this.children.length > 0) {
        for (let i = 0; i < this.children.length; i = (i + 1) | 0) {
          this.children[i].updateMatrix(this.mvpMatrix)
        }
      }

      this.isUpdateMatrix = false
    }

    return isUpdateMatrix
  }

  add(objectGl) {
    this.children.push(objectGl)
  }

  remove(objectGl) {
    this.children.some((value, i) => {
      if (value === objectGl) {
        this.children.splice(i, 1)
        return true
      }
      return false
    })
  }

  forEachProgram(func) {
    if (this.isProgram) {
      func(this)
    } else {
      for (let i = 0; i < this.children.length; i = (i + 1) | 0) {
        this.children[i].forEachProgram(func)
      }
    }
  }
}