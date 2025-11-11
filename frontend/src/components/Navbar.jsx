import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();
  const buttonRefs = useRef([]);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);

  // ✅ Removed "Archived"
  const navItems = [
    { label: "Notes", path: "/" },
    { label: "Profile", path: "/profile" },
    { label: "Trash", path: "/trash" }, // optional: added Trash button
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white text-black"
      : "text-gray-100 hover:text-white";

  // 🔄 Setup hover animations
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

  const handleEnter = (i) => tlRefs.current[i]?.play();
  const handleLeave = (i) => tlRefs.current[i]?.reverse();

  // 🧠 Reset hover animations when route changes
  useEffect(() => {
    tlRefs.current.forEach((tl, i) => {
      const path = navItems[i]?.path;
      if (location.pathname === path) {
        tl?.reverse();
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
              style={{
                width: 0,
                height: 0,
              }}
            />

            {/* Default text */}
            <span className="pill-label relative z-10 block">{item.label}</span>

            {/* Hover text */}
            <span
              className="pill-label-hover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-semibold z-20"
              style={{
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              {item.label}
            </span>
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            nav("/login");
          }}
          className="bg-red-500/80 hover:bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium 
                     transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
