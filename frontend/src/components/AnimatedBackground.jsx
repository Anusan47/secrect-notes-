import React, { useEffect, useRef } from "react";
import "../styles/AnimatedBackground.css"; // we'll create this file next

export default function AnimatedBackground({ interval = 100, color = "#005cff" }) {
  const ref = useRef(null);

  useEffect(() => {
    let prevTime;

    const getRandomSpawnLocation = () => {
      const width = ref.current?.parentElement?.scrollWidth || window.innerWidth;
      const height = ref.current?.parentElement?.scrollHeight || window.innerHeight;
      const spawnX = Math.random() * (width - 80);
      const spawnY = Math.random() * (height - 80);
      return [spawnX + "px", spawnY + "px"];
    };

    const animate = (timestamp) => {
      if (!prevTime) prevTime = timestamp;

      if (timestamp - prevTime > interval) {
        const particle = document.createElement("div");
        particle.classList.add("sparkle");
        particle.style.backgroundColor = color;
        const [x, y] = getRandomSpawnLocation();
        particle.style.left = x;
        particle.style.top = y;

        particle.onanimationend = () => particle.remove();
        ref.current.append(particle);
        prevTime = timestamp;
      }

      requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [interval, color]);

  return <div ref={ref} className="animated-bg"></div>;
}
