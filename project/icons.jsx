// icons.jsx — Bespoke icon family. Thin SF-Symbols-ish strokes, 24x24 canvas, currentColor.
// Plus filled variants for active tab bar states. Also exports the ZUPPEJ app icon.

const ICON_SIZE = 22;

const IconBase = ({ children, size = ICON_SIZE, stroke = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ── Primary nav ───────────────────────────────────────────────────────────────
const IconHoy = (p) => (
  <IconBase {...p}>
    {/* A sun rising over a horizon — "today" */}
    <circle cx="12" cy="12.5" r="3.2"/>
    <path d="M12 6.3V4.5M18.2 12.5h1.8M4 12.5h1.8M16.7 7.8l1.3-1.3M6 18.5l1.3-1.3M16.7 17.2l1.3 1.3M6 6.5l1.3 1.3"/>
  </IconBase>
);
const IconHoyFill = (p) => (
  <svg width={p?.size||ICON_SIZE} height={p?.size||ICON_SIZE} viewBox="0 0 24 24"
       fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round">
    <circle cx="12" cy="12.5" r="3.6"/>
    <g strokeWidth="2" strokeLinecap="round">
      <path d="M12 5.6V4M18.4 12.5H20M4 12.5h1.6M16.8 7.7l1.2-1.2M6 19l1.2-1.2M16.8 17.3l1.2 1.2M6 6l1.2 1.2"/>
    </g>
  </svg>
);

const IconSemanal = (p) => (
  <IconBase {...p}>
    {/* 7 elegant vertical strokes of varying height — a week's rhythm */}
    <path d="M4 17V14"/>
    <path d="M7.3 17V10.5"/>
    <path d="M10.6 17V12.5"/>
    <path d="M14 17V7.5"/>
    <path d="M17.3 17V11.5"/>
    <path d="M20 17V13"/>
    <path d="M3 19.5h18"/>
  </IconBase>
);
const IconSemanalFill = (p) => (
  <svg width={p?.size||ICON_SIZE} height={p?.size||ICON_SIZE} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3.2" y="14"  width="1.6" height="5" rx="0.8"/>
    <rect x="6.5" y="10.5" width="1.6" height="8.5" rx="0.8"/>
    <rect x="9.8" y="12.5" width="1.6" height="6.5" rx="0.8"/>
    <rect x="13.2" y="7.5" width="1.6" height="11.5" rx="0.8"/>
    <rect x="16.5" y="11.5" width="1.6" height="7.5" rx="0.8"/>
    <rect x="19.2" y="13" width="1.6" height="6" rx="0.8"/>
  </svg>
);

const IconMensual = (p) => (
  <IconBase {...p}>
    {/* Calendar page with header band */}
    <rect x="3.5" y="5" width="17" height="15.5" rx="3"/>
    <path d="M3.5 9.5h17"/>
    <path d="M8 3.5v3M16 3.5v3"/>
    <circle cx="8" cy="14" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="14" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="14" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="8" cy="17.5" r="0.9" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none"/>
  </IconBase>
);
const IconMensualFill = (p) => (
  <svg width={p?.size||ICON_SIZE} height={p?.size||ICON_SIZE} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="5" width="18" height="16" rx="3.2"/>
    <rect x="7" y="2.5" width="1.8" height="4" rx="0.9"/>
    <rect x="15.2" y="2.5" width="1.8" height="4" rx="0.9"/>
    <rect x="3" y="8.2" width="18" height="1.2" opacity="0.4"/>
  </svg>
);

const IconCalendario = (p) => (
  <IconBase {...p}>
    {/* Calendar with one highlighted day cell */}
    <rect x="3.5" y="5" width="17" height="15.5" rx="3"/>
    <path d="M3.5 9.5h17"/>
    <path d="M8 3.5v3M16 3.5v3"/>
    <rect x="14.5" y="12.5" width="3.5" height="3" rx="0.8" fill="currentColor" stroke="none"/>
  </IconBase>
);
const IconCalendarioFill = IconMensualFill;

const IconDoce = (p) => (
  <IconBase {...p}>
    {/* Target / bullseye — 12 weeks focus */}
    <circle cx="12" cy="12" r="8.5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
  </IconBase>
);
const IconDoceFill = (p) => (
  <svg width={p?.size||ICON_SIZE} height={p?.size||ICON_SIZE} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="9" opacity="0.35"/>
    <circle cx="12" cy="12" r="5.5" opacity="0.6"/>
    <circle cx="12" cy="12" r="2.2"/>
  </svg>
);

const IconIdeas = (p) => (
  <IconBase {...p}>
    {/* Lightbulb — rounded */}
    <path d="M9.2 16.5V18.3c0 .6.5 1.2 1.2 1.2h3.2c.7 0 1.2-.5 1.2-1.2V16.5"/>
    <path d="M10 21.5h4"/>
    <path d="M12 3.5a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.7v.5h5.6v-.5c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3.5z"/>
  </IconBase>
);
const IconIdeasFill = (p) => (
  <svg width={p?.size||ICON_SIZE} height={p?.size||ICON_SIZE} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3.5a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.7v.5h5.6v-.5c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3.5z"/>
    <rect x="9" y="17" width="6" height="2.5" rx="1.2" opacity="0.6"/>
    <rect x="10" y="20" width="4" height="1.6" rx="0.8" opacity="0.4"/>
  </svg>
);

const IconAjustes = (p) => (
  <IconBase {...p}>
    {/* Two-slider minimal settings */}
    <path d="M5 7h8"/>
    <circle cx="16" cy="7" r="2.2"/>
    <path d="M18.2 7H20"/>
    <path d="M5 17h4"/>
    <circle cx="12" cy="17" r="2.2"/>
    <path d="M14.2 17H20"/>
  </IconBase>
);
const IconAjustesFill = (p) => (
  <svg width={p?.size||ICON_SIZE} height={p?.size||ICON_SIZE} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7h8"/><circle cx="16" cy="7" r="2.4" fill="currentColor"/><path d="M18.4 7H20"/>
    <path d="M5 17h4"/><circle cx="12" cy="17" r="2.4" fill="currentColor"/><path d="M14.4 17H20"/>
  </svg>
);

// ── Entity / content icons ─────────────────────────────────────────────────────
const IconScore = (p) => (
  <IconBase {...p}>
    {/* Diamond / gem — quality score */}
    <path d="M6 4.5h12l3 4.5-9 11L3 9z"/>
    <path d="M3 9h18M8.5 9l3.5-4.5L15.5 9M12 4.5v15.5"/>
  </IconBase>
);

const IconHabits = (p) => (
  <IconBase {...p}>
    {/* Concentric rings — activity rings */}
    <circle cx="12" cy="12" r="8.5"/>
    <circle cx="12" cy="12" r="5.2"/>
    <circle cx="12" cy="12" r="2.2"/>
  </IconBase>
);

const IconMental = (p) => (
  <IconBase {...p}>
    {/* Stylized head + thought line */}
    <path d="M9 20.5v-2c0-.6-.3-1.2-.8-1.6A6.5 6.5 0 0 1 6 11.8C6 8 9 5 12.8 5h.4a6 6 0 0 1 6 6.2c0 1.4-.5 2.8-1.4 3.9l-1 1.2c-.4.4-.6 1-.6 1.5v2.5"/>
    <path d="M9 20.5h8"/>
    <path d="M10.5 11.5a2 2 0 0 1 3 0"/>
  </IconBase>
);

const IconTasks = (p) => (
  <IconBase {...p}>
    {/* Check-in-circle list */}
    <circle cx="6" cy="7" r="2"/>
    <path d="M5 7l.8.8L7.2 6.3"/>
    <path d="M10.5 7H20"/>
    <circle cx="6" cy="17" r="2"/>
    <path d="M10.5 17H20"/>
  </IconBase>
);

const IconReflection = (p) => (
  <IconBase {...p}>
    {/* Open book */}
    <path d="M3 5.5c3-.5 6-.5 9 1v13c-3-1.5-6-1.5-9-1z"/>
    <path d="M21 5.5c-3-.5-6-.5-9 1v13c3-1.5 6-1.5 9-1z"/>
  </IconBase>
);

const IconReminder = (p) => (
  <IconBase {...p}>
    {/* Bell */}
    <path d="M6 16.5c0-.8.3-1.6.8-2.2.7-.8 1-1.8 1-2.8V10a4.2 4.2 0 0 1 8.4 0v1.5c0 1 .3 2 1 2.8.5.6.8 1.4.8 2.2z"/>
    <path d="M4.8 16.5h14.4"/>
    <path d="M10.5 19.5a2 2 0 0 0 3 0"/>
  </IconBase>
);

const IconAnalytics = (p) => (
  <IconBase {...p}>
    {/* Line chart w/ dot */}
    <path d="M3 19h18"/>
    <path d="M4 15l4-4 4 2 6-7"/>
    <circle cx="18" cy="5" r="1.6" fill="currentColor" stroke="none"/>
  </IconBase>
);

const IconCycle = (p) => (
  <IconBase {...p}>
    {/* Refresh / cycle arrows */}
    <path d="M20 11a8 8 0 0 0-13.7-4.4L4 9"/>
    <path d="M4 5v4h4"/>
    <path d="M4 13a8 8 0 0 0 13.7 4.4L20 15"/>
    <path d="M20 19v-4h-4"/>
  </IconBase>
);

const IconStrategy = (p) => (
  <IconBase {...p}>
    {/* Chess-knight-ish corner path */}
    <path d="M5 19h14"/>
    <path d="M7 19V9l4-3 3 3v4l4 3v3"/>
    <circle cx="11" cy="6" r="1.5" fill="currentColor" stroke="none"/>
  </IconBase>
);

const IconFocus = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="8.5"/>
    <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/>
    <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>
  </IconBase>
);

const IconPlus = (p) => (
  <IconBase {...p} stroke={2}><path d="M12 5v14M5 12h14"/></IconBase>
);

const IconChevR = (p) => (
  <IconBase {...p}><path d="M9 5l7 7-7 7"/></IconBase>
);

const IconCheck = (p) => (
  <IconBase {...p} stroke={2.4}><path d="M4.5 12.5l5 5 10-11"/></IconBase>
);

const IconSearch = (p) => (
  <IconBase {...p}>
    <circle cx="11" cy="11" r="6.5"/>
    <path d="M16 16l4 4"/>
  </IconBase>
);

const IconFilter = (p) => (
  <IconBase {...p}>
    <path d="M4 6h16M7 12h10M10 18h4"/>
  </IconBase>
);

const IconMore = (p) => (
  <IconBase {...p}><circle cx="6" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.3" fill="currentColor" stroke="none"/></IconBase>
);

const IconFlag = (p) => (
  <IconBase {...p}>
    <path d="M5 4v17"/>
    <path d="M5 5c4-2 7 2 11 0v8c-4 2-7-2-11 0"/>
  </IconBase>
);

const IconSparkle = (p) => (
  <IconBase {...p}>
    <path d="M12 4v6M12 14v6M4 12h6M14 12h6"/>
    <path d="M7.5 7.5l3 3M13.5 13.5l3 3M16.5 7.5l-3 3M10.5 13.5l-3 3" opacity="0.5"/>
  </IconBase>
);

// ── ZUPPEJ App Icon — premium rounded-square ───────────────────────────────────
const ZuppejAppIcon = ({ size = 120 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: size * 0.225,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 ${size*0.08}px ${size*0.18}px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.3)`,
  }}>
    {/* base navy gradient */}
    <div style={{
      position:'absolute', inset:0,
      background:'linear-gradient(155deg, #1B2A4E 0%, #0A1428 55%, #060B1A 100%)',
    }}/>
    {/* inner glow */}
    <div style={{
      position:'absolute', inset:0,
      background:'radial-gradient(ellipse at 30% 20%, rgba(96,165,250,0.35) 0%, transparent 60%)',
    }}/>
    {/* glass sheen across top */}
    <div style={{
      position:'absolute', top:0, left:0, right:0, height:'55%',
      background:'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)',
    }}/>
    {/* Z monogram + arc */}
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ position:'absolute', inset:0 }}>
      <defs>
        <linearGradient id="zg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8FAFF"/>
          <stop offset="1" stopColor="#A7C0FF"/>
        </linearGradient>
        <linearGradient id="zg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#60A5FA" stopOpacity="0.85"/>
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      {/* Rising arc — execution progress */}
      <path d="M24 82 Q60 18 96 82" stroke="url(#zg2)" strokeWidth="4"
            fill="none" strokeLinecap="round" opacity="0.75"/>
      {/* Z */}
      <path d="M36 42 H82 L40 80 H86"
            stroke="url(#zg1)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Accent dot */}
      <circle cx="96" cy="82" r="4.5" fill="#60A5FA"/>
    </svg>
    {/* subtle highlight rim */}
    <div style={{
      position:'absolute', inset:0,
      borderRadius: size * 0.225,
      boxShadow: 'inset 0 1px 0.5px rgba(255,255,255,0.35), inset 0 -1px 0.5px rgba(0,0,0,0.3)',
      pointerEvents:'none',
    }}/>
  </div>
);

Object.assign(window, {
  IconHoy, IconHoyFill, IconSemanal, IconSemanalFill,
  IconMensual, IconMensualFill, IconCalendario, IconCalendarioFill,
  IconDoce, IconDoceFill, IconIdeas, IconIdeasFill, IconAjustes, IconAjustesFill,
  IconScore, IconHabits, IconMental, IconTasks, IconReflection, IconReminder,
  IconAnalytics, IconCycle, IconStrategy, IconFocus,
  IconPlus, IconChevR, IconCheck, IconSearch, IconFilter, IconMore, IconFlag, IconSparkle,
  ZuppejAppIcon,
});
