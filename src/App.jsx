import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400&display=swap');`;

const styles = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0a0a08;
    --ink2: #3d3d38;
    --ink3: #8a8a82;
    --ink4: #b5b5ac;
    --surface: #f5f4f0;
    --surface2: #eceae3;
    --surface3: #e2e0d6;
    --accent: #c8a96e;
    --accent2: #8b6f3e;
    --border: rgba(0,0,0,0.08);
    --border2: rgba(0,0,0,0.14);
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'DM Sans', system-ui, sans-serif;
    --mono: 'DM Mono', monospace;
  }
  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  ::selection { background: var(--ink); color: var(--surface); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 99px; }

  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
  @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
  @keyframes overlayOut { from{opacity:1} to{opacity:0} }
  @keyframes modalIn    { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes modalOut   { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(24px) scale(0.97)} }
  @keyframes shimmer    { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes lineGrow   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes spinSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float1     { 0%,100%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(15px,-20px) rotate(5deg)} 66%{transform:translate(-10px,10px) rotate(-3deg)} }
  @keyframes float2     { 0%,100%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(-20px,15px) rotate(-6deg)} 66%{transform:translate(10px,-10px) rotate(4deg)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

  .cursor-dot {
    width: 8px; height: 8px; background: var(--accent); border-radius: 50%;
    position: fixed; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%);
    transition: transform 0.1s, opacity 0.3s;
  }
  .cursor-ring {
    width: 36px; height: 36px; border: 1.5px solid var(--accent); border-radius: 50%;
    position: fixed; pointer-events: none; z-index: 9998; transform: translate(-50%,-50%);
    transition: all 0.15s ease-out;
    opacity: 0.6;
  }

  .grain-overlay {
    position: fixed; inset: 0; z-index: 200; pointer-events: none; opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  .tag-chip {
    background: var(--surface2);
    color: var(--ink2);
    font-size: 0.68rem;
    padding: 0.25rem 0.7rem;
    border-radius: 2px;
    letter-spacing: 0.05em;
    font-family: var(--mono);
    border: 1px solid var(--border);
    transition: all 0.2s;
  }

  .section-label {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink3);
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 3rem;
    font-family: var(--mono);
  }
  .section-label::before {
    content: '';
    display: inline-block;
    width: 32px;
    height: 1px;
    background: var(--accent);
  }

  .hover-lift {
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
  }
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  }

  .nav-link {
    font-size: 0.73rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--ink3);
    transition: color 0.2s;
    font-family: var(--mono);
    position: relative;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0; right: 0;
    height: 1px; background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .nav-link:hover, .nav-link.active { color: var(--ink); }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

  .project-card {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: var(--surface);
  }
  .project-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease;
    filter: saturate(0.85);
  }
  .project-card:hover img {
    transform: scale(1.07);
    filter: saturate(1);
  }
  .project-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,8,0.85) 0%, rgba(10,10,8,0.15) 60%, transparent 100%);
    transition: opacity 0.3s;
  }
  .project-card:hover .project-card-overlay {
    opacity: 0.95;
  }
  .project-card-content {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 1.75rem;
  }
  .project-card-arrow {
    width: 44px; height: 44px;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white;
    position: absolute;
    top: 1.25rem; right: 1.25rem;
    opacity: 0;
    transform: scale(0.85);
    transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(4px);
  }
  .project-card:hover .project-card-arrow {
    opacity: 1;
    transform: scale(1);
  }

  .skill-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 0.45rem 1.1rem;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 300;
    transition: all 0.2s;
    cursor: default;
    border: 1px solid var(--border2);
    background: transparent;
    color: var(--ink2);
    font-family: var(--sans);
    letter-spacing: 0.01em;
  }
  .skill-pill.featured {
    background: var(--ink);
    color: var(--surface);
    border-color: var(--ink);
  }
  .skill-pill:hover {
    border-color: var(--accent);
    color: var(--accent2);
  }
  .skill-pill.featured:hover {
    background: var(--accent2);
    border-color: var(--accent2);
    color: var(--surface);
  }

  .input-field {
    background: transparent;
    border: 1px solid var(--border2);
    border-radius: 3px;
    padding: 0.85rem 1.1rem;
    font-family: var(--sans);
    font-size: 0.88rem;
    color: var(--ink);
    outline: none;
    width: 100%;
    font-weight: 300;
    transition: border-color 0.2s;
  }
  .input-field:focus { border-color: var(--accent); }
  .input-field::placeholder { color: var(--ink4); }

  .btn-primary {
    background: var(--ink);
    color: var(--surface);
    border: none;
    border-radius: 2px;
    padding: 0.9rem 2.2rem;
    font-size: 0.76rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: var(--sans);
    transition: background 0.2s, transform 0.2s;
    display: inline-flex; align-items: center; gap: 10px;
  }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }

  .btn-outline {
    background: transparent;
    color: var(--ink2);
    border: 1px solid var(--border2);
    border-radius: 2px;
    padding: 0.9rem 2.2rem;
    font-size: 0.76rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: var(--sans);
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none;
  }
  .btn-outline:hover { border-color: var(--ink); color: var(--ink); background: var(--surface2); }

  .hero-deco-num {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--ink4);
    letter-spacing: 0.1em;
  }

  .stat-number {
    font-family: var(--serif);
    font-size: 3rem;
    font-weight: 400;
    line-height: 1;
    color: var(--ink);
    display: block;
  }
  .stat-label {
    font-family: var(--mono);
    font-size: 0.67rem;
    color: var(--ink3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 6px;
    display: block;
  }

  @media (max-width: 768px) {
    .two-col { grid-template-columns: 1fr !important; }
    .projects-grid { grid-template-columns: 1fr !important; }
    .nav-links { display: none; }
  }
`;

/* ── CUSTOM CURSOR ── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ── useInView ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

/* ── PROJECTS DATA ── */
const projects = [
  {
    num: "01",
    name: "Library Management Desktop App",
    year: "2023",
    role: "Backend Developer",
    image: "/portofolio/Perpusmu.png",
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
    num: "02",
    name: "Boarding House Recommendation System",
    year: "2024",
    role: "Backend Developer",
    image: "/portofolio/Rekost.png",
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
    num: "03",
    name: "Posyandu Management System",
    year: "2025",
    role: "Backend Developer",
    image: "/portofolio/Posyandu.png",
    tags: ["Laravel", "MySQL", "REST API", "Flutter"],
    desc: "Backend system for managing maternal health data, schedules, and mobile integration for Posyandu services.",
    live: "",
    github: "https://github.com/Mafirrr/Website_Posyandu.git",
    longDesc: "A backend system built with Laravel to manage users, midwives, health cadres, educational content, and Posyandu activity schedules. The system provides RESTful APIs integrated with a Flutter mobile application, enabling users to access health check data, schedules, and maternal health information efficiently.",
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
    num: "04",
    name: "Flood Early Detection System",
    year: "2025",
    role: "Backend & System Developer",
    image: "/portofolio/FloodSense.png",
    tags: ["Fuzzy Logic", "Flutter", "IoT", "Embedded System"],
    desc: "Early flood detection system using fuzzy logic with real-time monitoring and mobile alerts.",
    live: "",
    github: "https://github.com/newbieflank/FloodSense.git",
    longDesc: "An early warning system designed to detect flood risks using the Mamdani Fuzzy Logic method based on water level and flow velocity parameters. The system integrates an embedded prototype with sensors to simulate real-world monitoring, while a Flutter mobile application displays real-time water conditions and sends early warning notifications.",
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
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, []);
  function handleClose() { setClosing(true); setTimeout(onClose, 320); }

  return (
    <div onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,10,8,0.72)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", animation: `${closing ? "overlayOut" : "overlayIn"} 0.3s ease forwards` }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: 6, border: "1px solid var(--border2)", width: "100%", maxWidth: 820, maxHeight: "92vh", overflowY: "auto", animation: `${closing ? "modalOut" : "modalIn"} 0.36s cubic-bezier(0.16,1,0.3,1) forwards`, scrollbarWidth: "none" }}>

        {/* Header */}
        <div style={{ padding: "1.75rem 2.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", position: "sticky", top: 0, background: "var(--surface)", zIndex: 10, borderRadius: "6px 6px 0 0" }}>
          <div>
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.63rem", color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{p.num} / {p.year}</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.15 }}>{p.name}</h2>
          </div>
          <button onClick={handleClose} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink2)", flexShrink: 0, marginTop: 2, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--surface)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--ink2)"; }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Hero image */}
        <div style={{ width: "100%", aspectRatio: "16/7", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
          <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Content */}
        <div style={{ padding: "2.25rem 2.5rem 3rem" }}>
          {/* Meta */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", paddingBottom: "1.75rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
            {[{ l: "Role", v: p.role }, { l: "Year", v: p.year }].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>{m.l}</p>
                <p style={{ fontSize: "0.88rem", color: "var(--ink)", fontWeight: 300 }}>{m.v}</p>
              </div>
            ))}
            <div>
              <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Stack</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {p.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.85rem" }}>Overview</p>
            <p style={{ fontSize: "0.93rem", color: "var(--ink2)", lineHeight: 1.88, fontWeight: 300 }}>{p.longDesc}</p>
          </div>

          {/* Key features */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.85rem" }}>Key Features</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {p.highlights.map((h, i) => (
                <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", fontSize: "0.9rem", color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300 }}>
                  <span style={{ marginTop: "0.6rem", width: 5, height: 1, background: "var(--accent)", flexShrink: 0, display: "inline-block" }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Challenge */}
          <div style={{ marginBottom: "2.5rem", padding: "1.25rem 1.5rem", background: "var(--surface2)", borderRadius: 4, borderLeft: "3px solid var(--accent)" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.65rem" }}>Challenge & Solution</p>
            <p style={{ fontSize: "0.88rem", color: "var(--ink2)", lineHeight: 1.82, fontWeight: 300 }}>{p.challenge}</p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: "none" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2l4.5 4.5L7.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Live Demo
              </a>
            )}
            <a href={p.github} target="_blank" rel="noreferrer" className="btn-outline">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 00-2.055 12.67c.325.06.443-.14.443-.312v-1.227c-1.81.393-2.19-.874-2.19-.874-.296-.75-.722-.95-.722-.95-.59-.403.044-.395.044-.395.652.046 1 .67 1 .67.58 1 1.524.71 1.895.543.059-.422.228-.71.415-.874-1.445-.163-2.963-.722-2.963-3.21 0-.708.254-1.288.67-1.74-.068-.164-.29-.824.063-1.717 0 0 .546-.175 1.788.666A6.23 6.23 0 018 5.75c.552.003 1.108.075 1.628.219 1.24-.84 1.786-.666 1.786-.666.354.893.131 1.553.064 1.717.418.452.67 1.032.67 1.74 0 2.495-1.52 3.044-2.97 3.205.234.2.442.598.442 1.205v1.786c0 .174.118.375.447.312A6.502 6.502 0 008 1.5z" fill="currentColor" /></svg>
              View Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── NAV ── */
function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Projects", "Skills", "Contact"];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5vw", height: 64, background: scrolled ? "rgba(245,244,240,0.92)" : "transparent", backdropFilter: scrolled ? "blur(18px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent", transition: "all 0.35s ease" }}>
      <a href="#hero" style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 700, color: "var(--ink)", textDecoration: "none", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
        S<span style={{ color: "var(--accent)" }}>.</span>
      </a>
      <ul className="nav-links" style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
        {links.map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} className={`nav-link ${active === l.toLowerCase() ? "active" : ""}`}>{l}</a>
          </li>
        ))}
      </ul>
      <a href="#contact" style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.55rem 1.25rem", border: "1px solid var(--border2)", borderRadius: 2, textDecoration: "none", color: "var(--ink)", transition: "all 0.2s", background: "transparent" }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--surface)"; e.currentTarget.style.borderColor = "var(--ink)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>
        Hire me
      </a>
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  const anim = (d) => ({ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.9s ease ${d}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s` });

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "130px 5vw 100px", maxWidth: 1200, margin: "0 auto", position: "relative" }}>

      {/* Floating decorative blobs */}
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 320, height: 320, background: "radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", animation: "float1 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 200, height: 200, background: "radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", animation: "float2 10s ease-in-out infinite" }} />

      {/* Available badge */}
      <div style={{ ...anim(0.1), display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.4rem 1rem", borderRadius: 99, border: "1px solid rgba(200,169,110,0.4)", background: "rgba(200,169,110,0.08)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 0 2px rgba(76,175,80,0.25)", display: "inline-block", animation: "spinSlow 0s" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent2)" }}>Available for hire</span>
        </div>
      </div>

      {/* Main heading */}
      <h1 style={{ ...anim(0.2), fontFamily: "var(--serif)", fontSize: "clamp(3.2rem,8vw,7rem)", lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 900, marginBottom: "2rem", maxWidth: 900 }}>
        Building <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>clean</em>,<br />
        purposeful<br />
        <span style={{ color: "var(--ink2)", fontWeight: 400 }}>web experiences.</span>
      </h1>

      {/* Subtext */}
      <p style={{ ...anim(0.32), fontSize: "1.05rem", color: "var(--ink2)", maxWidth: 480, lineHeight: 1.82, fontWeight: 300, marginBottom: "3rem" }}>
        Back-end developer from East Java, Indonesia — crafting scalable APIs, clean architecture, and systems that just work.
      </p>

      {/* CTA Buttons */}
      <div style={{ ...anim(0.44), display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "5rem" }}>
        <a href="#projects" className="btn-primary" style={{ textDecoration: "none' " }}>
          View Projects
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2l4.5 4.5L7.5 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
        <a href="#contact" className="btn-outline" style={{ textDecoration: "none" }}>Get in Touch</a>
      </div>

      {/* Stats row */}
      <div style={{ ...anim(0.56), display: "flex", gap: "3rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)", width: "fit-content" }}>
        {[{ n: "4", l: "Projects" }, { n: "3+", l: "Years exp." }, { n: "3+", l: "Clients" }].map(s => (
          <div key={s.l}>
            <span className="stat-number" style={{ fontSize: "2rem" }}>{s.n}</span>
            <span className="stat-label">{s.l}</span>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "3rem", left: "5vw", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "bob 2.2s ease-in-out infinite" }}>
        <svg width="1" height="50" viewBox="0 0 1 50"><line x1="0.5" y1="0" x2="0.5" y2="50" stroke="var(--accent)" strokeWidth="1" /></svg>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--ink3)", letterSpacing: "0.15em", textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  return (
    <section id="about" style={{ padding: "7rem 5vw", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <FadeIn><p className="section-label">About Me</p></FadeIn>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: "5rem", alignItems: "start" }}>

        {/* Photo */}
        <FadeIn delay={0.05}>
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3/4", background: "var(--surface2)", borderRadius: 4, border: "1px solid var(--border)", overflow: "hidden" }}>
              <img src="/portofolio/image.jpeg" alt="Septian" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
            </div>
            {/* Badge */}
            <div style={{ position: "absolute", bottom: "-1.2rem", right: "-1.2rem", background: "var(--ink)", color: "var(--surface)", padding: "0.75rem 1.3rem", borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", display: "block", marginBottom: 3 }}>Role</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 400 }}>Backend Dev.</span>
            </div>
            {/* Decorative frame */}
            <div style={{ position: "absolute", top: "-12px", left: "-12px", width: 60, height: 60, border: "1.5px solid var(--accent)", borderRadius: 3, opacity: 0.5 }} />
          </div>
        </FadeIn>

        <div>
          <FadeIn delay={0.1}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 700, marginBottom: "1.75rem" }}>
              Turning ideas<br />into <em style={{ fontWeight: 400, color: "var(--accent2)" }}>interfaces</em>.
            </h2>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p style={{ color: "var(--ink2)", marginBottom: "1.25rem", fontWeight: 300, lineHeight: 1.88, fontSize: "0.95rem" }}>
              Hi! I'm a passionate back-end developer who enjoys building reliable, scalable systems and turning complex logic into efficient, maintainable solutions. I focus on clean architecture, optimized performance, and secure data handling.
            </p>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.88, fontSize: "0.95rem" }}>
              Whether it's designing APIs, managing databases, or developing full-stack applications — I bring consistency, precision, and attention to detail in every project. The best systems are the ones users never notice, because everything just works.
            </p>
          </FadeIn>

          {/* Stats grid */}
          <FadeIn delay={0.22}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
              {[{ n: "4", l: "Projects completed" }, { n: "3+", l: "Years experience" }, { n: "3+", l: "Happy clients" }].map(s => (
                <div key={s.l} style={{ padding: "1.5rem", background: "var(--surface2)", borderRadius: 4, border: "1px solid var(--border)", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--surface3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface2)"; }}>
                  <span className="stat-number">{s.n}</span>
                  <span className="stat-label">{s.l}</span>
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
  const isLarge = index === 0 || index === 3;
  return (
    <FadeIn delay={index * 0.08}>
      <div
        className="project-card hover-lift"
        onClick={() => onOpen(p)}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === "Enter" && onOpen(p)}
        style={{ borderRadius: 5, border: "1px solid var(--border)", overflow: "hidden", aspectRatio: isLarge ? "4/3" : "3/2" }}
      >
        <div className="project-card-overlay" />
        <img src={p.image} alt={p.name} loading="lazy" />
        <div className="project-card-arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="project-card-content">
          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.75rem" }}>
            {p.tags.slice(0, 3).map(t => (
              <span key={t} style={{ background: "rgba(245,244,240,0.15)", color: "rgba(245,244,240,0.9)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.63rem", padding: "0.2rem 0.6rem", borderRadius: 2, fontFamily: "var(--mono)", letterSpacing: "0.06em" }}>{t}</span>
            ))}
          </div>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "rgba(200,169,110,0.9)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{p.num} / {p.year}</p>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.1rem,2vw,1.5rem)", fontWeight: 700, color: "white", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "0.4rem" }}>{p.name}</h3>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", fontWeight: 300, lineHeight: 1.55 }}>{p.desc}</p>
          <div style={{ marginTop: "0.9rem", display: "flex", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            View details
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ── PROJECTS SECTION ── */
function Projects() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="projects" style={{ padding: "7rem 5vw", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <FadeIn>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="section-label">Projects</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,3.2rem)", letterSpacing: "-0.02em", fontWeight: 700, lineHeight: 1.08 }}>Selected Work</h2>
          </div>
          <p style={{ color: "var(--ink3)", fontWeight: 300, fontSize: "0.88rem", maxWidth: 280, textAlign: "right", lineHeight: 1.7 }}>Click any project to explore details, tech stack, and challenges.</p>
        </div>
      </FadeIn>

      {/* 2x2 masonry-feel grid */}
      <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
        {projects.map((p, i) => <ProjectCard key={p.num} p={p} index={i} onOpen={setSelected} />)}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ── SKILLS ── */
const skillGroups = [
  { label: "Backend Development", skills: ["Laravel", "PHP", "RESTful APIs", "Node.js", "SQLite", "API Integration", "Auth & Authorization"], featured: ["Laravel", "PHP", "RESTful APIs"] },
  { label: "Mobile & Integration", skills: ["Flutter", "Android", "API Consumption", "Real-time Data"], featured: ["Flutter", "API Consumption"] },
  { label: "Database & Tools", skills: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Git / GitHub", "Docker", "Figma"], featured: ["MySQL", "Firebase", "Git / GitHub", "Docker"] },
];

function Skills() {
  return (
    <section id="skills" style={{ padding: "7rem 5vw", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem", alignItems: "start" }}>

        <div>
          <FadeIn><p className="section-label">Skills</p></FadeIn>
          <FadeIn delay={0.05}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,3.5vw,3rem)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 700, marginBottom: "1.75rem" }}>
              Tools &<br /><em style={{ fontWeight: 400, color: "var(--accent2)" }}>Technologies</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.88, marginBottom: "1.1rem", fontSize: "0.95rem" }}>
              I specialize in back-end development — building scalable APIs, managing databases, and ensuring systems run efficiently and securely.
            </p>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.88, fontSize: "0.95rem" }}>
              Always learning, always improving.
            </p>
          </FadeIn>

          {/* Experience bar visual */}
          <FadeIn delay={0.18}>
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ label: "Backend Systems", pct: 90 }, { label: "API Design", pct: 85 }, { label: "Database Architecture", pct: 80 }, { label: "Mobile Integration", pct: 72 }].map(b => (
                <div key={b.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--ink2)", letterSpacing: "0.06em" }}>{b.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--accent)" }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 3, background: "var(--surface2)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${b.pct}%`, background: `linear-gradient(90deg, var(--accent2), var(--accent))`, borderRadius: 99, transformOrigin: "left", animation: "lineGrow 1.2s cubic-bezier(0.16,1,0.3,1) forwards" }} />
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {skillGroups.map((g, i) => (
            <FadeIn key={g.label} delay={i * 0.1}>
              <div style={{ padding: "1.75rem", background: "var(--surface2)", borderRadius: 5, border: "1px solid var(--border)" }}>
                <p style={{ fontFamily: "var(--mono)", fontSize: "0.63rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 1, background: "var(--accent)", display: "inline-block" }} />
                  {g.label}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {g.skills.map(s => (
                    <span key={s} className={`skill-pill ${g.featured.includes(s) ? "featured" : ""}`}>{s}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const socialLinks = [
    { label: "Email", val: "sgaluh525@gmail.com", href: "mailto:sgaluh525@gmail.com", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" /><path d="M1.5 5.5l6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg> },
    { label: "GitHub", val: "github.com/newbieflank", href: "https://github.com/newbieflank", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 00-2.055 12.67c.325.06.443-.14.443-.312v-1.227c-1.81.393-2.19-.874-2.19-.874-.296-.75-.722-.95-.722-.95-.59-.403.044-.395.044-.395.652.046 1 .67 1 .67.58 1 1.524.71 1.895.543.059-.422.228-.71.415-.874-1.445-.163-2.963-.722-2.963-3.21 0-.708.254-1.288.67-1.74-.068-.164-.29-.824.063-1.717 0 0 .546-.175 1.788.666A6.23 6.23 0 018 5.75c.552.003 1.108.075 1.628.219 1.24-.84 1.786-.666 1.786-.666.354.893.131 1.553.064 1.717.418.452.67 1.032.67 1.74 0 2.495-1.52 3.044-2.97 3.205.234.2.442.598.442 1.205v1.786c0 .174.118.375.447.312A6.502 6.502 0 008 1.5z" fill="currentColor" /></svg> },
    { label: "LinkedIn", val: "linkedin.com/in/septian-galoh-prasetyo", href: "https://linkedin.com/in/septian-galoh-prasetyo", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.1" /><path d="M5 7v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /><circle cx="5" cy="5.5" r="0.7" fill="currentColor" /><path d="M8 11V8.5C8 7.7 8.5 7 9.5 7S11 7.7 11 8.5V11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg> },
  ];

  return (
    <section id="contact" style={{ padding: "7rem 5vw", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid var(--border)" }}>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

        <div>
          <FadeIn><p className="section-label">Contact</p></FadeIn>
          <FadeIn delay={0.05}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,3.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 700, marginBottom: "1.25rem" }}>
              Let's work<br /><em style={{ fontWeight: 400, color: "var(--accent2)" }}>together.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ color: "var(--ink2)", fontWeight: 300, lineHeight: 1.88, marginBottom: "2.5rem", fontSize: "0.95rem" }}>
              Have a project in mind? I'd love to hear about it. Reach out via any channel or fill the form.
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {socialLinks.map((l, i) => (
              <FadeIn key={l.label} delay={0.14 + i * 0.07}>
                <a href={l.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", padding: "1rem 1.25rem", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", transition: "all 0.22s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(200,169,110,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ width: 38, height: 38, background: "var(--surface2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent2)", flexShrink: 0 }}>{l.icon}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.63rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink3)", display: "block", marginBottom: 3 }}>{l.label}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: 300 }}>{l.val}</span>
                  </div>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: "var(--accent)" }}><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.12}>
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", border: "1px solid var(--border)", borderRadius: 5, gap: "1.25rem", textAlign: "center", background: "var(--surface2)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11l6 6 8-9" stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 400 }}>Message sent!</p>
              <p style={{ color: "var(--ink2)", fontWeight: 300, fontSize: "0.9rem" }}>I'll get back to you as soon as possible.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn-outline">Send another</button>
            </div>
          ) : (
            <div style={{ padding: "2.5rem", background: "var(--surface2)", borderRadius: 5, border: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", fontWeight: 400, marginBottom: "1.75rem", color: "var(--ink)" }}>Send a message</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[{ key: "name", label: "Your Name", placeholder: "John Doe", type: "text" }, { key: "email", label: "Email Address", placeholder: "john@email.com", type: "email" }, { key: "subject", label: "Subject", placeholder: "Project inquiry...", type: "text" }].map(f => (
                  <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontFamily: "var(--mono)", fontSize: "0.63rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-field" style={{ background: "var(--surface)" }} />
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "var(--mono)", fontSize: "0.63rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink3)" }}>Message</label>
                  <textarea rows={5} placeholder="Tell me about your project..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="input-field" style={{ resize: "none", background: "var(--surface)" }} />
                </div>
                <button onClick={() => setSent(true)} className="btn-primary" style={{ marginTop: "0.5rem", width: "fit-content" }}>
                  Send Message
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2l4.5 4.5L7.5 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)" }}>S<span style={{ color: "var(--accent)" }}>.</span></span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--ink3)" }}>&copy; 2026 Septian Galoh Prasetyo</span>
        </div>
        <a href="#hero" style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--ink3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--ink3)"}>
          Back to top
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 5l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
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
    }, { threshold: 0.35 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="grain-overlay" />
      <Cursor />
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
