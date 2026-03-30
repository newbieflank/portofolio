import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');`;

const styles = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f0f0d;
    --ink2: #525250;
    --ink3: #9a9997;
    --surface: #f8f7f4;
    --surface2: #efede8;
    --border: rgba(0,0,0,0.07);
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Outfit', system-ui, sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--ink); color: var(--surface); }
  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
  @keyframes overlayIn  { from{opacity:0}                              to{opacity:1} }
  @keyframes overlayOut { from{opacity:1}                              to{opacity:0} }
  @keyframes modalIn    { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes modalOut   { from{opacity:1;transform:translateY(0) scale(1)}       to{opacity:0;transform:translateY(20px) scale(0.97)} }
`;

/* ── useInView ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

/* ── PROJECTS DATA ── */
const projects = [
  {
    num: "01", name: "Library Management Desktop App",
    year: "2023",
    role: "Backend Developer",
    icon: "📚",
    tags: ["Java", "NetBeans", "MySQL", "RFID"],
    desc: "Desktop-based library system for managing members, staff, and book data with RFID authentication.",
    live: "",
    github: "https://github.com/newbieflank/perpusmu.git",
    longDesc: "A desktop application developed using Java in NetBeans to manage library operations, including member registration, staff management, and book inventory. The system integrates RFID card authentication to enhance security and streamline user access, enabling faster and more efficient data processing within the library environment.",
    highlights: [
      "Developed CRUD system for members, staff, and book management",
      "Integrated RFID-based authentication for secure user access",
      "Optimized database structure using MySQL for efficient data handling",
      "Implemented role-based access control for different user types",
      "Ensured data consistency and validation across all modules"
    ],
    challenge: "Integrating RFID authentication with the desktop application and ensuring reliable data communication between the hardware and the system, while maintaining data integrity in the database."
  },
  {
    num: "02", name: "Boarding House Recommendation System",
    year: "2024",
    role: "Backend Developer",
    icon: "🏠",
    tags: ["PHP Native", "MySQL", "REST API", "Android"],
    desc: "Backend system for managing boarding house data, search functionality, and mobile app integration.",
    live: "",
    github: "https://github.com/newbieflank/web_rekost.git",
    longDesc: "A web-based backend system developed using native PHP to manage users, boarding house owners, and property listings. The system was designed with a structured database and business logic to support efficient search and data management. It also provides API endpoints integrated with an Android mobile application, allowing users to browse, search, and view detailed boarding house information seamlessly.",
    highlights: [
      "Designed and implemented database schema for users, owners, and boarding house data",
      "Developed RESTful APIs for mobile application integration",
      "Implemented search and filtering logic for boarding house listings",
      "Handled data validation and consistency across backend services",
      "Collaborated with UI/UX team using Figma for system integration"
    ],
    challenge: "Ensuring efficient and accurate search results while maintaining performance as data grows, and synchronizing backend APIs with mobile application requirements."
  },
  {
    num: "03", name: "Posyandu Management System",
    year: "2025",
    role: "Backend Developer",
    icon: "🩺",
    tags: ["Laravel", "MySQL", "REST API", "Flutter"],
    desc: "Backend system for managing maternal health data, schedules, and mobile integration for Posyandu services.",
    live: "",
    github: "https://github.com/Mafirrr/Website_Posyandu.git",
    longDesc: "A backend system built with Laravel to manage users, midwives, health cadres, educational content, and Posyandu activity schedules. The system provides RESTful APIs integrated with a Flutter mobile application, enabling users to access health check data, schedules, and maternal health information efficiently. The architecture focuses on scalability, data integrity, and seamless mobile synchronization.",
    highlights: [
      "Developed RESTful APIs for mobile app integration",
      "Designed relational database for healthcare and user data",
      "Managed authentication and role-based access (admin, midwife, cadre)",
      "Ensured secure and structured data handling for sensitive information",
      "Collaborated on system design and UI/UX using Figma"
    ],
    challenge: "Handling complex healthcare data structures while ensuring data consistency, security, and smooth synchronization between backend and mobile application."
  },
  {
    num: "04", name: "Flood Early Detection System",
    year: "2025",
    role: "Backend & System Developer",
    icon: "🌊",
    tags: ["Fuzzy Logic", "Flutter", "IoT", "Embedded System"],
    desc: "Early flood detection system using fuzzy logic with real-time monitoring and mobile alerts.",
    live: "",
    github: "https://github.com/newbieflank/FloodSense.git",
    longDesc: "An early warning system designed to detect flood risks using the Mamdani Fuzzy Logic method based on water level and flow velocity parameters. The system integrates an embedded prototype with sensors to simulate real-world monitoring, while a Flutter mobile application displays real-time water conditions and sends early warning notifications to users.",
    highlights: [
      "Implemented Mamdani Fuzzy Logic for flood risk classification",
      "Built real-time monitoring system using embedded sensors",
      "Developed Flutter app for live status and notifications",
      "Designed system workflow from hardware to mobile integration",
      "Simulated real-world environmental monitoring scenario"
    ],
    challenge: "Translating fuzzy logic calculations into a reliable real-time system while ensuring accurate sensor readings and seamless communication between hardware and mobile application."
  },
];

/* ── PROJECT MODAL ── */
function ProjectModal({ project: p, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 300);
  }

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,15,13,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        animation: `${closing ? "overlayOut" : "overlayIn"} 0.3s ease forwards`,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          width: "100%", maxWidth: 780,
          maxHeight: "90vh", overflowY: "auto",
          animation: `${closing ? "modalOut" : "modalIn"} 0.32s cubic-bezier(0.16,1,0.3,1) forwards`,
          position: "relative",
          scrollbarWidth: "none",
        }}
      >
        {/* Top bar */}
        <div style={{ padding: "1.75rem 2.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", position: "sticky", top: 0, background: "var(--surface)", zIndex: 10, borderRadius: "8px 8px 0 0" }}>
          <div>
            <p style={{ fontSize: "0.67rem", color: "var(--ink3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{p.num} — {p.year}</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.5rem,3vw,2.1rem)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{p.name}</h2>
          </div>
          <button
            onClick={handleClose}
            style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink2)", flexShrink: 0, marginTop: 2, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.background = "var(--surface2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink2)"; e.currentTarget.style.background = "transparent"; }}
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Thumbnail */}
        <div style={{ width: "100%", aspectRatio: "16/7", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem", borderBottom: "1px solid var(--border)" }}>
          {p.icon}
        </div>

        {/* Content */}
        <div style={{ padding: "2rem 2.25rem 2.5rem" }}>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid var(--border)", marginBottom: "1.75rem" }}>
            {[{ label: "Role", val: p.role }, { label: "Year", val: p.year }].map(m => (
              <div key={m.label}>
                <p style={{ fontSize: "0.65rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>{m.label}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--ink)", fontWeight: 300 }}>{m.val}</p>
              </div>
            ))}
            <div>
              <p style={{ fontSize: "0.65rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7 }}>Stack</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ background: "var(--surface2)", color: "var(--ink2)", fontSize: "0.72rem", padding: "0.22rem 0.65rem", borderRadius: 2, letterSpacing: "0.04em" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.65rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Overview</p>
            <p style={{ fontSize: "0.95rem", color: "var(--ink2)", lineHeight: 1.82, fontWeight: 300 }}>{p.longDesc}</p>
          </div>

          {/* Key features */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.65rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Key Features</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {p.highlights.map((h, i) => (
                <li key={i} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start", fontSize: "0.92rem", color: "var(--ink2)", lineHeight: 1.65, fontWeight: 300 }}>
                  <span style={{ marginTop: "0.5rem", width: 4, height: 4, borderRadius: "50%", background: "var(--ink3)", flexShrink: 0 }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Challenge */}
          <div style={{ marginBottom: "2.25rem", padding: "1.1rem 1.4rem", background: "var(--surface2)", borderRadius: 4, borderLeft: "2.5px solid var(--ink)" }}>
            <p style={{ fontSize: "0.65rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.55rem" }}>Challenge & Solution</p>
            <p style={{ fontSize: "0.9rem", color: "var(--ink2)", lineHeight: 1.78, fontWeight: 300 }}>{p.challenge}</p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <ModalBtn href={p.live} filled>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2l4.5 4.5L7.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Live Demo
            </ModalBtn>
            <ModalBtn href={p.github}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 00-2.055 12.67c.325.06.443-.14.443-.312v-1.227c-1.81.393-2.19-.874-2.19-.874-.296-.75-.722-.95-.722-.95-.59-.403.044-.395.044-.395.652.046 1 .67 1 .67.58 1 1.524.71 1.895.543.059-.422.228-.71.415-.874-1.445-.163-2.963-.722-2.963-3.21 0-.708.254-1.288.67-1.74-.068-.164-.29-.824.063-1.717 0 0 .546-.175 1.788.666A6.23 6.23 0 018 5.75c.552.003 1.108.075 1.628.219 1.24-.84 1.786-.666 1.786-.666.354.893.131 1.553.064 1.717.418.452.67 1.032.67 1.74 0 2.495-1.52 3.044-2.97 3.205.234.2.442.598.442 1.205v1.786c0 .174.118.375.447.312A6.502 6.502 0 008 1.5z" fill="currentColor" /></svg>
              View Code
            </ModalBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalBtn({ href, children, filled }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "0.7rem 1.5rem", fontSize: "0.78rem", fontWeight: 500,
      letterSpacing: "0.07em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2,
      background: filled ? (hov ? "#333330" : "var(--ink)") : (hov ? "var(--surface2)" : "transparent"),
      color: filled ? "var(--surface)" : (hov ? "var(--ink)" : "var(--ink2)"),
      border: `1px solid ${filled ? "var(--ink)" : (hov ? "var(--ink)" : "var(--border)")}`,
      transition: "all 0.18s",
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</a>
  );
}

/* ── NAV ── */
function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Projects", "Skills", "Contact"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 5vw", height: 60,
      background: scrolled ? "rgba(248,247,244,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <a href="#hero" style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)", textDecoration: "none", letterSpacing: "-0.01em" }}>Septian Portofolio.</a>
      <ul style={{ display: "flex", gap: "2.25rem", listStyle: "none" }}>
        {links.map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} style={{ fontSize: "0.78rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", color: active === l.toLowerCase() ? "var(--ink)" : "var(--ink3)", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--ink)"}
              onMouseLeave={e => e.target.style.color = active === l.toLowerCase() ? "var(--ink)" : "var(--ink3)"}
            >{l}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  const anim = d => ({ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.8s ease ${d}s, transform 0.8s ease ${d}s` });
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 5vw 80px", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <div style={{ ...anim(0.1), fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink3)", display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
        <span style={{ display: "inline-block", width: 28, height: 1, background: "var(--ink3)" }} /> Available for hire
      </div>
      <h1 style={{ ...anim(0.2), fontFamily: "var(--serif)", fontSize: "clamp(3rem,7.5vw,6rem)", lineHeight: 1.06, letterSpacing: "-0.02em", fontWeight: 300, marginBottom: "2rem", maxWidth: 820 }}>
        Building <em style={{ fontStyle: "italic", color: "var(--ink2)" }}>clean</em>,<br />purposeful<br />web experiences.
      </h1>
      <p style={{ ...anim(0.3), fontSize: "1.05rem", color: "var(--ink2)", maxWidth: 440, lineHeight: 1.75, fontWeight: 300, marginBottom: "3rem" }}>
        Web developer based in East Java, Indonesia — crafting fast, accessible, and beautifully simple interfaces that people love to use.
      </p>
      <div style={{ ...anim(0.4), display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[["#projects", "View Projects", true], ["#contact", "Get in Touch", false]].map(([href, label, filled]) => (
          <a key={label} href={href} style={{ display: "inline-block", padding: "0.8rem 2rem", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2, transition: "all 0.2s", background: filled ? "var(--ink)" : "transparent", color: filled ? "var(--surface)" : "var(--ink)", border: `1px solid ${filled ? "var(--ink)" : "var(--border)"}` }}
            onMouseEnter={e => { if (filled) e.currentTarget.style.background = "#333330"; else e.currentTarget.style.borderColor = "var(--ink)"; }}
            onMouseLeave={e => { if (filled) e.currentTarget.style.background = "var(--ink)"; else e.currentTarget.style.borderColor = "var(--border)"; }}
          >{label}</a>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: "2.5rem", left: "5vw", display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", animation: "bob 2s ease-in-out infinite" }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M6 1v10M2 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg> Scroll
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  const stats = [{ num: "4", label: "Projects" }, { num: "3+", label: "Years exp." }, { num: "3+", label: "Clients" }];
  return (
    <section id="about" style={{ padding: "6rem 5vw", maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <FadeIn><p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink3)", display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}><span style={{ display: "inline-block", width: 20, height: 1, background: "var(--ink3)" }} />About Me</p></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", gap: "4rem", alignItems: "start" }}>
        <FadeIn delay={0.05}>
          <div
            style={{
              aspectRatio: "3/4",
              background: "var(--surface2)",
              borderRadius: 3,
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <img
              src="/portofolio/image.jpg"
              alt="Septian"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: "1.25rem",
                background: "var(--ink)",
                color: "var(--surface)",
                padding: "0.4rem 1rem",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: 2
              }}
            >
              Web Developer
            </div>
          </div>
        </FadeIn>
        <div>
          <FadeIn delay={0.1}><h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", lineHeight: 1.12, letterSpacing: "-0.01em", fontWeight: 300, marginBottom: "1.5rem" }}>Turning ideas<br />into interfaces.</h2></FadeIn>
          <FadeIn delay={0.15}>
            <p style={{ color: "var(--ink2)", marginBottom: "1.25rem", fontWeight: 300, lineHeight: 1.8, fontSize: "0.95rem" }}>
              Hi! I'm a passionate back-end developer who enjoys building reliable, scalable systems and turning complex logic into efficient, maintainable solutions. I focus on clean architecture, optimized performance, and secure data handling to ensure everything runs smoothly behind the scenes.
            </p>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.8, fontSize: "0.95rem" }}>
              Whether it's designing APIs, managing databases, or developing full-stack applications with a strong back-end foundation — I bring consistency, precision, and attention to detail in every project. I believe the best systems are the ones users never notice, because everything just works.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
              {stats.map(s => (
                <div key={s.label}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 300, display: "block", lineHeight: 1, marginBottom: 4 }}>{s.num}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--ink3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── PROJECT CARD ── */
function ProjectCard({ p, onOpen, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={index * 0.08}>
      <div
        onClick={() => onOpen(p)}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === "Enter" && onOpen(p)}
        style={{ display: "block", padding: "2.5rem", color: "inherit", background: hovered ? "var(--surface2)" : "var(--surface)", transition: "background 0.2s", cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p style={{ fontSize: "0.68rem", color: "var(--ink3)", letterSpacing: "0.1em", marginBottom: "2rem", fontWeight: 400 }}>{p.num}</p>
        <div style={{ width: "100%", aspectRatio: "16/9", background: "var(--surface2)", borderRadius: 2, border: "1px solid var(--border)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", transition: "transform 0.3s", transform: hovered ? "scale(1.015)" : "scale(1)" }}>
          {p.icon}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.85rem" }}>
          {p.tags.map(t => <span key={t} style={{ background: "var(--surface2)", color: "var(--ink2)", fontSize: "0.7rem", padding: "0.25rem 0.65rem", borderRadius: 2, letterSpacing: "0.04em" }}>{t}</span>)}
        </div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>{p.name}</h3>
        <p style={{ fontSize: "0.87rem", color: "var(--ink2)", lineHeight: 1.65, fontWeight: 300, marginBottom: "1.25rem" }}>{p.desc}</p>
        <div style={{ fontSize: "0.75rem", color: hovered ? "var(--ink)" : "var(--ink3)", display: "flex", alignItems: "center", gap: hovered ? 10 : 6, transition: "all 0.2s", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          View project
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </FadeIn>
  );
}

/* ── PROJECTS SECTION ── */
function Projects() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="projects" style={{ padding: "6rem 5vw", maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <FadeIn>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink3)", display: "flex", alignItems: "center", gap: 10, marginBottom: "0.85rem" }}><span style={{ display: "inline-block", width: 20, height: 1, background: "var(--ink3)" }} />Projects</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", letterSpacing: "-0.01em", fontWeight: 300, lineHeight: 1.1 }}>Selected Work</h2>
        </div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 2, background: "var(--border)" }}>
        {projects.map((p, i) => <ProjectCard key={p.num} p={p} index={i} onOpen={setSelected} />)}
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ── SKILLS ── */
const skillGroups = [
  {
    label: "Backend Development",
    skills: [
      "Laravel",
      "PHP",
      "RESTful APIs",
      "Node.js",
      "SQLite",
      "API Integration",
      "Authentication & Authorization"
    ],
    featured: [
      "Laravel",
      "PHP",
      "RESTful APIs",
    ]
  },
  {
    label: "Mobile & Integration",
    skills: [
      "Flutter",
      "Android",
      "API Consumption",
      "Real-time Data"
    ],
    featured: [
      "Flutter",
      "API Consumption"
    ]
  },
  { label: "Database & Tools", skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Git / GitHub", "Docker", "Figma"], featured: ["MySQL", "Firebase", "Git / GitHub", "Docker"] },
];

function Pill({ label, featured }) {
  const [hov, setHov] = useState(false);
  return (
    <span style={{ background: featured ? "var(--ink)" : hov ? "var(--surface2)" : "transparent", color: featured ? "var(--surface)" : hov ? "var(--ink)" : "var(--ink2)", border: `1px solid ${featured ? "var(--ink)" : hov ? "var(--ink)" : "var(--border)"}`, fontSize: "0.82rem", padding: "0.4rem 1rem", borderRadius: 999, transition: "all 0.18s", cursor: "default", fontWeight: 300, letterSpacing: "0.01em" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{label}</span>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "6rem 5vw", maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        <div>
          <FadeIn><p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink3)", display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}><span style={{ display: "inline-block", width: 20, height: 1, background: "var(--ink3)" }} />Skills</p></FadeIn>
          <FadeIn delay={0.05}><h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.9rem,3vw,2.6rem)", lineHeight: 1.15, letterSpacing: "-0.01em", fontWeight: 300, marginBottom: "1.5rem" }}>Tools &amp; Technologies</h2></FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.95rem" }}>
              I specialize in back-end development — building scalable APIs, managing databases, and ensuring systems run efficiently and securely behind the scenes.
            </p>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.8, fontSize: "0.95rem" }}>
              Always learning, always improving system performance.
            </p>
          </FadeIn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {skillGroups.map((g, i) => (
            <FadeIn key={g.label} delay={i * 0.08}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)", marginBottom: "0.75rem", fontWeight: 400 }}>{g.label}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.skills.map(s => <Pill key={s} label={s} featured={g.featured.includes(s)} />)}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function ContactLink({ l }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={l.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", padding: "0.9rem 1.1rem", border: `1px solid ${hov ? "var(--ink)" : "var(--border)"}`, borderRadius: 3, background: hov ? "var(--surface2)" : "transparent", transition: "all 0.2s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 32, height: 32, background: "var(--surface2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink2)", flexShrink: 0 }}>{l.icon}</div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink3)", display: "block", marginBottom: 2 }}>{l.label}</span>
        <span style={{ fontSize: "0.88rem", color: "var(--ink)", fontWeight: 300 }}>{l.val}</span>
      </div>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: "var(--ink3)" }}><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </a>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const inputStyle = { background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "0.75rem 1rem", fontFamily: "var(--sans)", fontSize: "0.9rem", color: "var(--ink)", outline: "none", width: "100%", fontWeight: 300 };
  const socialLinks = [
    { label: "Email", val: "sgaluh525@gmail.com", href: "mailto:sgaluh525@gmail.com", icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.1" /><path d="M1 5l6.5 4.5L14 5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg> },
    { label: "GitHub", val: "github.com/newbieflank", href: "https://github.com/newbieflank", icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 00-2.055 12.67c.325.06.443-.14.443-.312v-1.227c-1.81.393-2.19-.874-2.19-.874-.296-.75-.722-.95-.722-.95-.59-.403.044-.395.044-.395.652.046 1 .67 1 .67.58 1 1.524.71 1.895.543.059-.422.228-.71.415-.874-1.445-.163-2.963-.722-2.963-3.21 0-.708.254-1.288.67-1.74-.068-.164-.29-.824.063-1.717 0 0 .546-.175 1.788.666A6.23 6.23 0 018 5.75c.552.003 1.108.075 1.628.219 1.24-.84 1.786-.666 1.786-.666.354.893.131 1.553.064 1.717.418.452.67 1.032.67 1.74 0 2.495-1.52 3.044-2.97 3.205.234.2.442.598.442 1.205v1.786c0 .174.118.375.447.312A6.502 6.502 0 008 1.5z" fill="currentColor" /></svg> },
    { label: "LinkedIn", val: "linkedin.com/in/septian-galoh-prasetyo", href: "https://linkedin.com/in/septian-galoh-prasetyo", icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.1" /><path d="M5 7v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /><circle cx="5" cy="5.5" r="0.7" fill="currentColor" /><path d="M8 11V8.5C8 7.7 8.5 7 9.5 7S11 7.7 11 8.5V11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg> },
  ];
  return (
    <section id="contact" style={{ padding: "6rem 5vw", maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        <div>
          <FadeIn><p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink3)", display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}><span style={{ display: "inline-block", width: 20, height: 1, background: "var(--ink3)" }} />Contact</p></FadeIn>
          <FadeIn delay={0.05}><h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.01em", fontWeight: 300, marginBottom: "1.25rem" }}>Let's work<br />together.</h2></FadeIn>
          <FadeIn delay={0.1}><p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.95rem" }}>Have a project in mind? I'd love to hear about it. Reach out via any channel or use the form.</p></FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {socialLinks.map((l, i) => <FadeIn key={l.label} delay={0.12 + i * 0.07}><ContactLink l={l} /></FadeIn>)}
          </div>
        </div>
        <FadeIn delay={0.1}>
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", border: "1px solid var(--border)", borderRadius: 3, gap: "1rem", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l5 5 7-8" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 300 }}>Message sent!</p>
              <p style={{ color: "var(--ink2)", fontWeight: 300, fontSize: "0.9rem" }}>I'll get back to you as soon as possible.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} style={{ marginTop: "0.5rem", background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "0.6rem 1.5rem", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", color: "var(--ink2)", fontFamily: "var(--sans)" }}>Send another</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ key: "name", label: "Your Name", placeholder: "John Doe", type: "text" }, { key: "email", label: "Email Address", placeholder: "john@email.com", type: "email" }, { key: "subject", label: "Subject", placeholder: "Project inquiry...", type: "text" }].map(f => (
                <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = "var(--ink)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)" }}>Message</label>
                <textarea rows={5} placeholder="Tell me about your project..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: "none" }} onFocus={e => e.target.style.borderColor = "var(--ink)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
              </div>
              <button onClick={() => setSent(true)} style={{ marginTop: "0.5rem", background: "var(--ink)", color: "var(--surface)", border: "none", borderRadius: 2, padding: "0.85rem 2rem", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)", width: "fit-content", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#333330"} onMouseLeave={e => e.currentTarget.style.background = "var(--ink)"}>Send Message</button>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  const [hov, setHov] = useState(false);
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "1.75rem 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
      <span style={{ fontSize: "0.78rem", color: "var(--ink3)", fontWeight: 300 }}>&copy; 2026 — Your Name. All rights reserved.</span>
      <a href="#hero" style={{ fontSize: "0.78rem", color: hov ? "var(--ink)" : "var(--ink3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        Back to top <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 5l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </a>
    </footer>
  );
}

/* ── APP ── */
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  useEffect(() => {
    const sections = ["hero", "about", "projects", "skills", "contact"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <>
      <style>{styles}</style>
      <Nav active={activeSection} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
