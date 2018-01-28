var RainEmitter = {
  init: function(stage) {
    this.emitter = new PIXI.particles.Emitter(
      stage,
      [PIXI.Texture.fromImage('/public/img/HardRain.png')],
      {
        "alpha": {
          "start": 0.2,
          "end": 0.9
        },
        "scale": {
          "start": 0.3,
          "end": 0.3
        },
        "color": {
          "start": "f1f3f4",
          "end": "f1f3f4"
        },
        "speed": {
          "start": 1000,
          "end": 1000
        },
        "startRotation": {
          "min": 90,
          "max": 90
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
        "maxParticles": 5000,
        "pos": {
          "x": 0,
          "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
          "x": 0,
          "y": 0,
          "w": 600,
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
