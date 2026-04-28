// ui.jsx — Apple-grade primitives: glass surfaces, cards, chips, bars, tab bar.
// All components respect the active theme via CSS variables.

// ── Score color helpers ───────────────────────────────────────────────────────
function scoreHue(score) {
  if (score === null || score === undefined) return 'var(--text-3)';
  if (score >= 8) return 'var(--sys-green)';
  if (score >= 6) return 'var(--sys-amber)';
  return 'var(--sys-red)';
}
function scoreHueSoft(score) {
  if (score === null || score === undefined) return 'transparent';
  if (score >= 8) return 'var(--sys-green-soft)';
  if (score >= 6) return 'var(--sys-amber-soft)';
  return 'var(--sys-red-soft)';
}

// ── Frosted glass surface ─────────────────────────────────────────────────────
function GlassSurface({ children, radius = 18, style = {}, tint = 'neutral', lift = 1 }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: radius,
      boxShadow: lift
        ? `0 ${lift*0.5}px ${lift*2}px rgba(0,0,0,var(--shadow-a1)), 0 ${lift*2}px ${lift*8}px rgba(0,0,0,var(--shadow-a2))`
        : 'none',
      ...style,
    }}>
      {/* blur layer */}
      <div style={{
        position:'absolute', inset:0, borderRadius:radius,
        backdropFilter:'blur(22px) saturate(170%)',
        WebkitBackdropFilter:'blur(22px) saturate(170%)',
        background: tint === 'dark' ? 'var(--glass-dark)' : 'var(--glass)',
      }}/>
      {/* hairline */}
      <div style={{
        position:'absolute', inset:0, borderRadius:radius,
        boxShadow:'inset 0 0.5px 0 var(--hairline-top), inset 0 -0.5px 0 var(--hairline-bot)',
        border:'0.5px solid var(--hairline)',
        pointerEvents:'none',
      }}/>
      <div style={{ position:'relative', zIndex:1 }}>{children}</div>
    </div>
  );
}

// ── Solid material card (for inside-app content) ──────────────────────────────
function Card({ children, radius = 18, padding = 16, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface-1)',
      borderRadius: radius,
      padding,
      boxShadow: '0 0.5px 0 var(--hairline-top) inset, 0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.03)',
      border:'0.5px solid var(--hairline)',
      cursor: onClick ? 'pointer':'default',
      ...style,
    }}>{children}</div>
  );
}

// Grouped list row — iOS-native feeling
function ListRow({ icon, iconTint, title, subtitle, value, last, onClick, right, destructive, mono }) {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'12px 14px',
      borderBottom: last ? 'none' : '0.5px solid var(--separator)',
      cursor: onClick ? 'pointer':'default',
      minHeight: 46,
    }}>
      {icon && (
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          display:'flex', alignItems:'center', justifyContent:'center',
          background: iconTint || 'var(--accent-soft)',
          color: iconTint ? '#fff' : 'var(--accent)',
          flexShrink:0,
        }}>{icon}</div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontSize:15, fontWeight: 500, letterSpacing:-0.2,
          color: destructive ? 'var(--sys-red)' : 'var(--text-1)',
          lineHeight:1.3,
        }}>{title}</div>
        {subtitle && <div style={{
          fontSize:12, color:'var(--text-3)', marginTop:2, lineHeight:1.3,
        }}>{subtitle}</div>}
      </div>
      {value !== undefined && (
        <div style={{
          fontSize: 14,
          fontFamily: mono ? 'ui-monospace, SF Mono, Menlo, monospace':'inherit',
          color:'var(--text-3)', letterSpacing:-0.1,
        }}>{value}</div>
      )}
      {right}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ children, style }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 400,
      letterSpacing: 0.04, textTransform:'uppercase',
      color:'var(--text-3)',
      padding:'18px 20px 6px',
      ...style,
    }}>{children}</div>
  );
}

// ── Pill chip ─────────────────────────────────────────────────────────────────
function Chip({ children, tint, style }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 9px', borderRadius:999,
      fontSize:11, fontWeight:600, letterSpacing:0.1,
      background: tint ? `${tint}22` : 'var(--fill-2)',
      color: tint || 'var(--text-2)',
      ...style,
    }}>{children}</span>
  );
}

// ── Score pill (the premium score indicator) ─────────────────────────────────
function ScorePill({ score, size = 'md' }) {
  const hue = scoreHue(score);
  const soft = scoreHueSoft(score);
  const big = size === 'lg';
  const fs = big ? 28 : 15;
  return (
    <div style={{
      display:'inline-flex', alignItems:'baseline', gap:3,
      padding: big ? '8px 16px' : '4px 11px',
      borderRadius: 999,
      background: soft,
      border: `0.5px solid ${hue}33`,
      color: hue,
      fontFamily:'ui-rounded, -apple-system, system-ui',
      fontWeight: 700,
      fontSize: fs,
      letterSpacing:-0.5,
    }}>
      {score !== null && score !== undefined ? score.toFixed(1) : '—'}
      {big && <span style={{ fontSize: 13, fontWeight:500, opacity:0.55 }}>/10</span>}
    </div>
  );
}

// ── Linear progress (Apple-elegant) ───────────────────────────────────────────
function LinearProgress({ value, max = 1, color, thickness = 4, radius = 999 }) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value/max : 0)) * 100;
  return (
    <div style={{
      background:'var(--fill-1)', borderRadius: radius, height: thickness, overflow:'hidden',
    }}>
      <div style={{
        height:'100%', width:`${pct}%`, background: color || 'var(--accent)',
        borderRadius: radius, transition:'width 0.5s cubic-bezier(.2,.8,.2,1)',
      }}/>
    </div>
  );
}

// ── Ring progress (activity rings) ────────────────────────────────────────────
function Ring({ value, max = 1, size = 64, stroke = 7, color = 'var(--accent)', track = 'var(--fill-1)', children }) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value/max : 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position:'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" opacity="0.6"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-pct)}
                style={{ transition:'stroke-dashoffset 0.6s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      {children && <div style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
      }}>{children}</div>}
    </div>
  );
}

// ── Large title + optional trailing ───────────────────────────────────────────
function LargeTitle({ eyebrow, title, trailing, style }) {
  return (
    <div style={{
      padding:'8px 20px 12px',
      display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12,
      ...style,
    }}>
      <div style={{ flex:1, minWidth:0 }}>
        {eyebrow && <div style={{
          fontSize:12, fontWeight:600, letterSpacing:0.2, textTransform:'uppercase',
          color:'var(--text-3)', marginBottom:4,
        }}>{eyebrow}</div>}
        <h1 style={{
          fontFamily:'ui-rounded, -apple-system, "SF Pro Rounded", system-ui',
          fontSize: 32, fontWeight: 700, letterSpacing: 0.35,
          color:'var(--text-1)', lineHeight:1.05, margin:0,
          textTransform:'capitalize',
        }}>{title}</h1>
      </div>
      {trailing}
    </div>
  );
}

// ── Segmented control ────────────────────────────────────────────────────────
function Segmented({ options, value, onChange, style }) {
  return (
    <div style={{
      display:'flex', padding:2, borderRadius:10,
      background:'var(--fill-1)', gap:2,
      ...style,
    }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          flex:1, padding:'7px 10px', borderRadius:8,
          border:'none',
          background: value === o.id ? 'var(--surface-1)' : 'transparent',
          color: value === o.id ? 'var(--text-1)' : 'var(--text-3)',
          fontSize:13, fontWeight: value === o.id ? 600 : 500,
          letterSpacing:-0.1,
          boxShadow: value === o.id ? '0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)' : 'none',
          cursor:'pointer', transition:'all 0.15s',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

// ── iOS-style bottom tab bar (liquid glass) ───────────────────────────────────
function TabBar({ items, current, onChange, dark }) {
  return (
    <div style={{
      position:'absolute', left:12, right:12, bottom: 14,
      zIndex: 40,
      pointerEvents:'auto',
    }}>
      <GlassSurface radius={28} lift={4} tint={dark ? 'dark':'neutral'}
        style={{ padding:'8px 6px' }}>
        <div style={{ display:'flex', justifyContent:'space-around' }}>
          {items.map(it => {
            const active = it.id === current;
            const Active = it.active;
            const Inactive = it.inactive;
            return (
              <button key={it.id} onClick={() => onChange(it.id)} style={{
                flex:1, minWidth:0, display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                padding:'6px 2px', background:'transparent', border:'none',
                color: active ? 'var(--accent)' : 'var(--text-3)',
                cursor:'pointer',
              }}>
                <div style={{ height:22, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {active ? <Active/> : <Inactive/>}
                </div>
                <span style={{
                  fontSize:10, fontWeight: active ? 600 : 500,
                  letterSpacing:-0.1,
                  color: active ? 'var(--accent)' : 'var(--text-3)',
                }}>{it.label}</span>
              </button>
            );
          })}
        </div>
      </GlassSurface>
    </div>
  );
}

// ── Stacked metric tile ───────────────────────────────────────────────────────
function MetricTile({ label, value, unit, color, sub, style }) {
  return (
    <div style={{
      background:'var(--surface-1)',
      border:'0.5px solid var(--hairline)',
      borderRadius:16, padding:'12px 14px',
      ...style,
    }}>
      <div style={{
        fontSize: 11, fontWeight:500, color:'var(--text-3)',
        letterSpacing:0.1, textTransform:'uppercase', marginBottom:6,
      }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
        <span style={{
          fontFamily:'ui-rounded, -apple-system, system-ui',
          fontSize: 26, fontWeight:700, letterSpacing:-0.8,
          color: color || 'var(--text-1)', lineHeight:1,
        }}>{value}</span>
        {unit && <span style={{
          fontSize: 13, color:'var(--text-3)', fontWeight:500,
        }}>{unit}</span>}
      </div>
      {sub && <div style={{
        fontSize: 11, color:'var(--text-3)', marginTop:6, letterSpacing:-0.1,
      }}>{sub}</div>}
    </div>
  );
}

Object.assign(window, {
  scoreHue, scoreHueSoft, GlassSurface, Card, ListRow, SectionHeader,
  Chip, ScorePill, LinearProgress, Ring, LargeTitle, Segmented, TabBar, MetricTile,
});
