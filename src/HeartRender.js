import React, { useEffect, useState } from "react";
import "./style.css";

const HeartRender = React.memo(({ username }) => {
  const [showPopup, setShowPopup] = useState(true);

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    var settings = {
      particles: {
        length: 5000,
        duration: 4,
        velocity: 80,
        effect: -1.3,
        size: 8,
      },
    };

    // Point class
    class Point {
      constructor(x, y) {
        this.x = typeof x !== "undefined" ? x : 0;
        this.y = typeof y !== "undefined" ? y : 0;
      }

      clone() {
        return new Point(this.x, this.y);
      }

      length(length) {
        if (typeof length === "undefined")
          return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
      }

      normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
      }
    }

    // Particle class
    class Particle {
      constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
      }

      initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
      }

      update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
      }

      draw(context, image) {
        function ease(t) {
          return --t * t * t + 1;
        }
        const size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(
          image,
          this.position.x - size / 2,
          this.position.y - size / 2,
          size,
          size
        );
      }
    }

    // ParticlePool class
    class ParticlePool {
      constructor(length) {
        this.particles = new Array(length);
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;

        for (let i = 0; i < this.particles.length; i++)
          this.particles[i] = new Particle();
      }

      add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);

        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        if (this.firstActive === this.firstFree) this.firstActive++;
        if (this.firstActive === this.particles.length) this.firstActive = 0;
      }

      update(deltaTime) {
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++)
            this.particles[i].update(deltaTime);
        }

        if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < this.particles.length; i++)
            this.particles[i].update(deltaTime);
          for (let i = 0; i < this.firstFree; i++)
            this.particles[i].update(deltaTime);
        }

        while (
          this.particles[this.firstActive].age >= this.duration &&
          this.firstActive !== this.firstFree
        ) {
          this.firstActive++;
          if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
      }

      draw(context, image) {
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++)
            this.particles[i].draw(context, image);
        }

        if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < this.particles.length; i++)
            this.particles[i].draw(context, image);
          for (let i = 0; i < this.firstFree; i++)
            this.particles[i].draw(context, image);
        }
      }
    }

    // Creating the Particle image
    const createParticleImage = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = settings.particles.size;
      canvas.height = settings.particles.size;

      function to(t) {
        const point = pointOnHeart(t);
        point.x =
          settings.particles.size / 2 +
          (point.x * settings.particles.size) / 350;
        point.y =
          settings.particles.size / 2 -
          (point.y * settings.particles.size) / 350;
        return point;
      }

      context.beginPath();
      let t = -Math.PI;
      let point = to(t);
      context.moveTo(point.x, point.y);

      while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        context.lineTo(point.x, point.y);
      }

      context.closePath();
      context.fillStyle = "#0766AD";
      context.fill();
      //#F0EFEF
      const image = new Image();
      image.src = canvas.toDataURL();
      return image;
    };

    const pointOnHeart = (t) => {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) -
          50 * Math.cos(2 * t) -
          20 * Math.cos(3 * t) -
          10 * Math.cos(4 * t) +
          25
      );
    };

    const canvas = document.getElementById("pinkboard");
    const context = canvas.getContext("2d");
    const particles = new ParticlePool(settings.particles.length);
    const particleRate =
      settings.particles.length / settings.particles.duration;
    let time;

    const image = createParticleImage();

    function render() {
      requestAnimationFrame(render);

      const newTime = new Date().getTime() / 1000;
      const deltaTime = newTime - (time || newTime);
      time = newTime;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const amount = particleRate * deltaTime;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        particles.add(
          canvas.width / 2 + pos.x,
          canvas.height / 2 - pos.y,
          dir.x,
          -dir.y
        );
      }

      particles.update(deltaTime);
      particles.draw(context, image);
    }

    const onResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.onresize = onResize;

    setTimeout(() => {
      onResize();
      render();
    });
  }, []);
  return (
    <div className="box">
      <canvas id="pinkboard"></canvas>
      {showPopup && <Popup username={username} onClose={closePopup} />}
    </div>
  );
});

const Popup = ({ username, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p className="popup-text">
          Hello <span style={{ color: "#0766ad" }}>{username}</span>, It's me.
          This is a gift I made for you. It's just a small project and doesn't
          have any functionality here but I hope you like it. And there are yet
          more to come!
        </p>
        <p>Khoa.</p>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HeartRender;
