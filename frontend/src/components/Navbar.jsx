import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const buttonRefs = useRef([]);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);

  const navItems = [
    { label: "Notes", path: "/" },
    { label: "Profile", path: "/profile" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white text-black"
      : "text-gray-200 hover:text-white";

  useEffect(() => {
    buttonRefs.current.forEach((btn, i) => {
      const circle = circleRefs.current[i];
      if (!circle || !btn) return;

      const { width: w, height: h } = btn.getBoundingClientRect();
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      });

      const label = btn.querySelector(".pill-label");
      const hoverLabel = btn.querySelector(".pill-label-hover");

      if (label) gsap.set(label, { y: 0 });
      if (hoverLabel) gsap.set(hoverLabel, { y: h + 8, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(circle, { scale: 1.3, duration: 0.4, ease: "power3.out" }, 0);
      tl.to(label, { y: -(h + 8), duration: 0.4, ease: "power3.out" }, 0);
      tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0);
      tlRefs.current[i] = tl;
    });
  }, []);

  const handleEnter = (i) => {
    const path = navItems[i].path;
    // ❌ Prevent hover animation for active button
    if (location.pathname === path) return;
    tlRefs.current[i]?.play();
  };

  const handleLeave = (i) => {
    const path = navItems[i].path;
    if (location.pathname === path) return;
    tlRefs.current[i]?.reverse();
  };

  // 🧠 Reset hover animation for active button on route change
  useEffect(() => {
    navItems.forEach((item, i) => {
      const tl = tlRefs.current[i];
      if (location.pathname === item.path) {
        tl?.reverse(0); // ✅ Instantly reverse hover animation for active one
      }
    });
  }, [location.pathname]);

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%]
                 bg-white/20 backdrop-blur-xl border border-white/30
                 shadow-[0_8px_32px_rgba(31,38,135,0.37)]
                 rounded-3xl px-6 py-3 flex items-center justify-between
                 text-white transition-all duration-300
                 hover:shadow-[0_8px_40px_rgba(31,38,135,0.45)] z-50"
    >
      {/* App Title */}
      <h1
        onClick={() => nav("/")}
        className="text-xl font-bold tracking-wide cursor-pointer 
                   bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Secure Notes
      </h1>

      {/* Nav Buttons */}
      <div className="flex items-center gap-3">
        {navItems.map((item, i) => (
          <button
            key={item.path}
            ref={(el) => (buttonRefs.current[i] = el)}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            onClick={() => nav(item.path)}
            className={`relative overflow-hidden px-5 py-2 rounded-full font-medium text-sm ${isActive(
              item.path
            )}`}
            style={{
              minWidth: "90px",
              textAlign: "center",
              lineHeight: "1.2rem",
            }}
          >
            {/* Hover circle */}
            <span
              ref={(el) => (circleRefs.current[i] = el)}
              className="absolute left-1/2 bottom-0 bg-white rounded-full opacity-70"
            />

            {/* Default text */}
            <span className="pill-label relative z-10 block text-gray-500">{item.label}</span>

            {/* Hover text */}
            <span
              className="pill-label-hover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-semibold z-20"
              style={{ pointerEvents: "none" }}
              aria-hidden="true"
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
