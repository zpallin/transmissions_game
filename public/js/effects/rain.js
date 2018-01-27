var RainEmitter = {
  init: function(stage) {
    this.emitter = new PIXI.particles.Emitter(
      stage,
      [PIXI.Texture.fromImage('/public/img/HardRain.png')],
      {
        "alpha": {
          "start": 0.5,
          "end": 0.5
        },
        "scale": {
          "start": 1,
          "end": 1
        },
        "color": {
          "start": "ffffff",
          "end": "ffffff"
        },
        "speed": {
          "start": 3000,
          "end": 3000
        },
        "startRotation": {
          "min": 65,
          "max": 65
        },
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 0.81,
          "max": 0.81
        },
        "blendMode": "normal",
        "frequency": 0.004,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "pos": {
          "x": 0,
          "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
          "x": -600,
          "y": -460,
          "w": 900,
          "h": 20
        }
    });
    return this;
  },

  start: function() {
    if (this.emitter) {
      this.emitter.emit = true;
    }
  },

  stop: function() {
    if (this.emitter) {
      this.emitter.emit = false;
    }
  },

  update: function(time) {
    this.emitter.update(time)
  },

  isEmitting: function() {
    return this.emitter ? this.emitter.emit : false;
  }
}
