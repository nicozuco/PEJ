// screens-other.jsx — Semanal, Mensual, Calendario, 12 Semanas, Ideas, Ajustes
const { useState: uSs } = React;

// ─────────────────────────────────────────────────────────────────────────────
// SEMANAL
// ─────────────────────────────────────────────────────────────────────────────
function SemanalScreen() {
  const DAYS = [
    { d:'Lun', n:21, score:7.2 },
    { d:'Mar', n:22, score:8.4 },
    { d:'Mié', n:23, score:6.5 },
    { d:'Jue', n:24, score:7.8, today:true },
    { d:'Vie', n:25, score:null },
    { d:'Sáb', n:26, score:null },
    { d:'Dom', n:27, score:null },
  ];
  const evalD = DAYS.filter(d=>d.score!==null);
  const avg = evalD.reduce((a,b)=>a+b.score,0)/evalD.length;
  const best = Math.max(...evalD.map(d=>d.score));
  const habits = [
    { name:'Lectura 30 min', done:3, total:4 },
    { name:'Ejercicio', done:4, total:4 },
    { name:'Meditación', done:3, total:4 },
    { name:'Sin redes antes de 12h', done:2, total:4 },
    { name:'Review del plan', done:4, total:4 },
    { name:'Journaling nocturno', done:2, total:4 },
  ];

  return (
    <>
      <NavHeader
        eyebrow="SEMANA 17"
        title="21 – 27 abr"
        right={
          <div style={{ display:'flex', gap:6 }}>
            <GlassPillBtn icon={<IconChevR size={16} style={{ transform:'scaleX(-1)' }}/>}/>
            <GlassPillBtn icon={<IconChevR size={16}/>}/>
          </div>
        }/>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* KPI row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <MetricTile label="Media" value={avg.toFixed(1)} unit="/10" color={scoreHue(avg)} sub="por encima del objetivo"/>
          <MetricTile label="Mejor día" value={best.toFixed(1)} unit="" color={scoreHue(best)} sub="martes"/>
          <MetricTile label="Días ≥ 8" value="1" unit={`/${evalD.length}`} color="var(--sys-green)"/>
          <MetricTile label="Evaluados" value={evalD.length} unit="/7" color="var(--accent)"/>
        </div>

        {/* Day bars */}
        <Card radius={22} padding={18}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>Rendimiento diario</div>
            <div style={{ fontSize:12, color:'var(--text-3)' }}>0 → 10</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8, alignItems:'end' }}>
            {DAYS.map((d,i)=>{
              const pct = d.score !== null ? (d.score/10) : 0;
              const col = d.score !== null ? scoreHue(d.score) : 'var(--fill-2)';
              return (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div style={{
                    fontSize:11, fontFamily:'ui-monospace, SF Mono',
                    color: d.score!==null ? col : 'var(--text-3)', fontWeight:600,
                  }}>{d.score!==null?d.score.toFixed(1):'—'}</div>
                  <div style={{
                    width:'100%', height:86, background:'var(--fill-1)', borderRadius:8,
                    display:'flex', alignItems:'flex-end', overflow:'hidden',
                    border: d.today ? `1.5px solid ${col}` : '0.5px solid var(--separator)',
                  }}>
                    <div style={{
                      width:'100%', height: d.score!==null ? `${pct*100}%` : 0,
                      background:`linear-gradient(180deg, ${col}cc, ${col})`,
                      borderRadius: pct<1 ? '0 0 7px 7px':8,
                      transition:'height 0.5s cubic-bezier(.2,.8,.2,1)',
                    }}/>
                  </div>
                  <div style={{ fontSize:11, color: d.today ? 'var(--accent)' : 'var(--text-3)', fontWeight: d.today ? 600 : 500 }}>
                    {d.d}
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-3)' }}>{d.n}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Habits summary */}
        <Card padding={0} radius={22}>
          <div style={{ padding:'14px 18px 10px' }}>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>Hábitos de la semana</div>
          </div>
          {habits.map((h,i)=>{
            const pct = h.done / h.total;
            const col = pct>=0.8 ? 'var(--sys-green)' : pct>=0.5 ? 'var(--sys-amber)' : 'var(--sys-red)';
            return (
              <div key={i} style={{
                padding:'10px 18px',
                borderTop:'0.5px solid var(--separator)',
                display:'grid', gridTemplateColumns:'1fr 40px 100px', gap:10, alignItems:'center',
              }}>
                <div style={{ fontSize:13, color:'var(--text-1)', letterSpacing:-0.1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.name}</div>
                <div style={{ fontSize:11, fontFamily:'ui-monospace, SF Mono', color:col, fontWeight:600, textAlign:'right' }}>
                  {h.done}/{h.total}
                </div>
                <LinearProgress value={h.done} max={h.total} color={col} thickness={5}/>
              </div>
            );
          })}
        </Card>

        <div style={{
          padding:'12px 16px', borderRadius:16,
          background:'var(--sys-indigo-soft)',
          border:'0.5px solid var(--sys-indigo-soft-strong)',
          fontSize:13, color:'var(--sys-indigo)', letterSpacing:-0.1, lineHeight:1.5,
        }}>
          <strong>Review del domingo:</strong> completa la revisión profunda y define el Top 3 de la próxima semana.
        </div>
      </div>
    </>
  );
}

function GlassPillBtn({ icon }) {
  return (
    <button style={{
      width:34, height:34, borderRadius:17,
      background:'var(--fill-1)', border:'0.5px solid var(--hairline)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'var(--text-2)', cursor:'pointer',
    }}>{icon}</button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENSUAL
// ─────────────────────────────────────────────────────────────────────────────
function MensualScreen() {
  // Abril 2026: 1st is Wednesday
  const DAYS_IN = 30;
  const FIRST_OFFSET = 2; // Mon-start grid
  const days = [];
  for (let i=0; i<FIRST_OFFSET; i++) days.push({ pad:true });
  for (let d=1; d<=DAYS_IN; d++) {
    const score = d > 24 ? null : (d===24 ? 7.8 : 5 + Math.abs((d*7919)%500)/100);
    days.push({ d, score, today: d===24 });
  }
  while (days.length % 7) days.push({ pad:true });

  return (
    <>
      <NavHeader
        eyebrow="MES"
        title="abril 2026"
        right={
          <div style={{ display:'flex', gap:6 }}>
            <GlassPillBtn icon={<IconChevR size={16} style={{ transform:'scaleX(-1)' }}/>}/>
            <GlassPillBtn icon={<IconChevR size={16}/>}/>
          </div>
        }/>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <MetricTile label="Media" value="7.1" unit="/10" color="var(--sys-amber)" sub="+0.3 vs marzo"/>
          <MetricTile label="Mejor día" value="9.2" color="var(--sys-green)" sub="día 12"/>
          <MetricTile label="Hábitos" value="78" unit="%" color="var(--sys-green)"/>
          <MetricTile label="Días eval." value="24" unit="/30" color="var(--accent)"/>
        </div>

        <Card radius={22} padding={16}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:8 }}>
            {['L','M','X','J','V','S','D'].map(d=>(
              <div key={d} style={{
                textAlign:'center', fontSize:11, color:'var(--text-3)', fontWeight:600, letterSpacing:0.2,
              }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
            {days.map((c,i)=>{
              if (c.pad) return <div key={i} style={{ aspectRatio:'1', opacity:0.3 }}/>;
              const col = c.score !== null ? scoreHue(c.score) : 'var(--fill-1)';
              const soft = c.score !== null ? scoreHueSoft(c.score) : 'transparent';
              return (
                <div key={i} style={{
                  aspectRatio:'1',
                  background: c.score !== null ? soft : 'var(--fill-1)',
                  border: c.today ? `1.5px solid var(--accent)` : '0.5px solid var(--separator)',
                  borderRadius:10,
                  display:'flex', flexDirection:'column',
                  justifyContent:'space-between', padding:5,
                  position:'relative',
                }}>
                  <div style={{
                    fontSize:11, fontWeight: c.today ? 700 : 500,
                    color: c.today ? 'var(--accent)' : 'var(--text-2)', letterSpacing:-0.1,
                  }}>{c.d}</div>
                  {c.score !== null ? (
                    <div style={{
                      fontSize:10, fontFamily:'ui-rounded, -apple-system, system-ui',
                      fontWeight:700, color: col, letterSpacing:-0.3, textAlign:'right',
                    }}>{c.score.toFixed(1)}</div>
                  ):(
                    <div style={{
                      width:4, height:4, borderRadius:2, background:'var(--separator-strong)', marginLeft:'auto',
                    }}/>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card radius={22} padding={18}>
          <div style={{
            fontSize:11, fontWeight:600, color:'var(--text-3)', letterSpacing:0.8, textTransform:'uppercase', marginBottom:10,
          }}>Reflexión del mes</div>
          <div style={{
            fontSize:14, color:'var(--text-2)', lineHeight:1.6, letterSpacing:-0.15, fontStyle:'italic',
          }}>
            Abril ha sido el mes con mejor ejecución del trimestre. El cambio clave: bloquear las 2h de la mañana sin notificaciones.
          </div>
        </Card>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDARIO
// ─────────────────────────────────────────────────────────────────────────────
function CalendarioScreen() {
  const DAYS_IN = 30;
  const FIRST_OFFSET = 2;
  const days = [];
  for (let i=0;i<FIRST_OFFSET;i++) days.push({ pad:true });
  for (let d=1; d<=DAYS_IN; d++) {
    days.push({
      d,
      today: d===24,
      hasEvent: [3,8,12,17,24,28].includes(d),
      eventCount: d===24 ? 3 : ([8,17].includes(d) ? 2 : 1),
      type: d===15 ? 'festivo' : (d===20 ? 'vacaciones':null),
    });
  }
  while (days.length % 7) days.push({ pad:true });

  const events = [
    { time:'09:00', title:'Deep work — arquitectura', tag:'focus', color:'var(--accent)' },
    { time:'11:30', title:'Llamada con mentor', tag:'meeting', color:'var(--sys-purple)' },
    { time:'16:00', title:'Revisión plan de trading', tag:'trading', color:'var(--sys-amber)' },
  ];

  return (
    <>
      <NavHeader
        eyebrow="CALENDARIO"
        title="abril"
        right={<GlassPillBtn icon={<IconPlus size={16}/>}/>}/>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
        <Card radius={22} padding={14}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3, marginBottom:6 }}>
            {['L','M','X','J','V','S','D'].map(d=>(
              <div key={d} style={{ textAlign:'center', fontSize:11, color:'var(--text-3)', fontWeight:600 }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
            {days.map((c,i)=>{
              if (c.pad) return <div key={i} style={{ aspectRatio:'1' }}/>;
              return (
                <div key={i} style={{
                  aspectRatio:'1',
                  background: c.today ? 'var(--accent)' : (c.type ? 'var(--fill-1)':'transparent'),
                  borderRadius: c.today ? 12 : 10,
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  position:'relative', padding:3,
                }}>
                  <div style={{
                    fontSize:14, fontWeight: c.today ? 700 : 500,
                    color: c.today ? '#fff' : (c.type ? 'var(--text-3)' : 'var(--text-1)'),
                    letterSpacing:-0.2,
                  }}>{c.d}</div>
                  {c.hasEvent && (
                    <div style={{ display:'flex', gap:2, marginTop:2 }}>
                      {Array.from({length:Math.min(c.eventCount,3)}).map((_,j)=>(
                        <div key={j} style={{
                          width:4, height:4, borderRadius:2,
                          background: c.today ? '#fff' : 'var(--accent)',
                          opacity: c.today ? 0.8 : 1,
                        }}/>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div style={{ padding:'0 4px' }}>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2, marginBottom:10 }}>
            Jueves 24 · 3 eventos
          </div>
        </div>

        <Card padding={0} radius={22}>
          {events.map((e,i)=>(
            <div key={i} style={{
              display:'flex', gap:14, padding:'14px 18px',
              borderTop: i>0 ? '0.5px solid var(--separator)':'none',
            }}>
              <div style={{
                width:4, borderRadius:2, background:e.color, flexShrink:0,
              }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontFamily:'ui-monospace, SF Mono', color:e.color, fontWeight:600 }}>
                  {e.time}
                </div>
                <div style={{ fontSize:15, fontWeight:500, color:'var(--text-1)', marginTop:2, letterSpacing:-0.2 }}>
                  {e.title}
                </div>
                <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2, letterSpacing:-0.1 }}>
                  <IconReminder size={11}/> <span style={{ verticalAlign:'middle' }}>10 min antes</span>
                </div>
              </div>
              <span style={{ color:'var(--text-3)', alignSelf:'center' }}><IconChevR size={14}/></span>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 SEMANAS
// ─────────────────────────────────────────────────────────────────────────────
function DoceScreen() {
  const weeks = [];
  for (let w=1; w<=12; w++) {
    let score = null;
    if (w <= 5) score = 65 + Math.abs((w*7919)%40);
    if (w === 5) score = 92;
    weeks.push({ w, score, current: w === 5 });
  }
  const scores = weeks.filter(w=>w.score!==null).map(w=>w.score);
  const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);

  return (
    <>
      <NavHeader
        eyebrow="CICLO · Q2"
        title="12 semanas"
        subtitle="Enfoque: Lanzar producto v2"/>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* Progress hero */}
        <Card padding={0} radius={22} style={{ overflow:'hidden' }}>
          <div style={{
            padding:'20px', background:`linear-gradient(135deg, var(--accent-soft), transparent)`,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <Ring value={5} max={12} size={88} stroke={9} color="var(--accent)">
                <div style={{ textAlign:'center' }}>
                  <div style={{
                    fontFamily:'ui-rounded, -apple-system, system-ui',
                    fontSize:24, fontWeight:700, color:'var(--accent)', letterSpacing:-0.8,
                  }}>5</div>
                  <div style={{ fontSize:9, color:'var(--text-3)', fontWeight:600, letterSpacing:0.2 }}>/ 12</div>
                </div>
              </Ring>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:'var(--text-3)', fontWeight:600, letterSpacing:0.4, textTransform:'uppercase' }}>Semana actual</div>
                <div style={{ fontFamily:'ui-rounded, -apple-system, system-ui', fontSize:28, fontWeight:700, color:'var(--text-1)', letterSpacing:-0.7, marginTop:2 }}>
                  Semana 5
                </div>
                <div style={{ fontSize:13, color:'var(--text-3)', marginTop:2, letterSpacing:-0.1 }}>
                  Media de ejecución · <span style={{ color:'var(--sys-green)', fontWeight:600 }}>{avg}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* On-track banner */}
          <div style={{
            padding:'12px 20px', background:'var(--sys-green-soft)', display:'flex', alignItems:'center', gap:10,
            borderTop:'0.5px solid var(--separator)',
          }}>
            <div style={{
              width:24, height:24, borderRadius:12, background:'var(--sys-green)', color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}><IconCheck size={13}/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--sys-green)', letterSpacing:-0.1 }}>Vas en camino</div>
              <div style={{ fontSize:11, color:'var(--text-3)' }}>Por encima del umbral del 85%</div>
            </div>
          </div>
        </Card>

        {/* Week grid */}
        <Card radius={22} padding={18}>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2, marginBottom:14 }}>
            Progreso del ciclo
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8 }}>
            {weeks.map(w=>{
              const col = w.score === null ? 'var(--fill-1)'
                : w.score >= 85 ? 'var(--sys-green)'
                : w.score >= 60 ? 'var(--sys-amber)' : 'var(--sys-red)';
              const soft = w.score === null ? 'var(--fill-1)'
                : w.score >= 85 ? 'var(--sys-green-soft)'
                : w.score >= 60 ? 'var(--sys-amber-soft)' : 'var(--sys-red-soft)';
              return (
                <div key={w.w} style={{
                  aspectRatio:'1',
                  background: w.score !== null ? soft : 'var(--fill-1)',
                  border: w.current ? `1.5px solid ${col}` : '0.5px solid var(--separator)',
                  borderRadius:12,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
                }}>
                  <div style={{
                    fontSize:10, color:'var(--text-3)', fontWeight:500, letterSpacing:0.2,
                  }}>S{w.w}</div>
                  <div style={{
                    fontFamily:'ui-rounded, -apple-system, system-ui',
                    fontSize:14, fontWeight:700,
                    color: w.score !== null ? col : 'var(--text-3)', letterSpacing:-0.3,
                  }}>{w.score !== null ? `${w.score}%` : '—'}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Weekly scorecard */}
        <Card padding={0} radius={22}>
          <div style={{ padding:'14px 18px 10px' }}>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>Scorecard — semana 5</div>
            <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>3 tácticas · 2 en ejecución</div>
          </div>
          {[
            { t:'Publicar landing v2', pct:100, col:'var(--sys-green)' },
            { t:'Cerrar 3 entrevistas', pct:66, col:'var(--sys-amber)' },
            { t:'Refinar backlog Q2', pct:40, col:'var(--sys-red)' },
          ].map((it,i)=>(
            <div key={i} style={{
              padding:'12px 18px', display:'grid', gridTemplateColumns:'1fr auto', gap:10,
              borderTop:'0.5px solid var(--separator)', alignItems:'center',
            }}>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:'var(--text-1)', letterSpacing:-0.15, marginBottom:6 }}>{it.t}</div>
                <LinearProgress value={it.pct} max={100} color={it.col} thickness={5}/>
              </div>
              <div style={{
                fontSize:13, fontFamily:'ui-monospace, SF Mono', color:it.col, fontWeight:600,
              }}>{it.pct}%</div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IDEAS
// ─────────────────────────────────────────────────────────────────────────────
function IdeasScreen() {
  const STATUSES = [
    { id:'inbox', label:'Inbox', color:'var(--text-3)', count:4 },
    { id:'explorando', label:'Explorando', color:'var(--sys-purple)', count:3 },
    { id:'progreso', label:'En progreso', color:'var(--sys-amber)', count:2 },
    { id:'hecha', label:'Implementada', color:'var(--sys-green)', count:7 },
  ];
  const ideas = [
    { title:'Resumen semanal por audio', desc:'Generar un audio de 2 min con el recap del domingo.', status:'progreso', prio:'alta', age:'hace 3 días' },
    { title:'Modo foco con respiración', desc:'Añadir breathing exercise de 4-7-8 antes de empezar deep work.', status:'explorando', prio:'media', age:'hace 1 semana' },
    { title:'Integrar con Apple Health', desc:'Sync pasos, sueño y minutos de ejercicio como hábitos automáticos.', status:'explorando', prio:'urgente', age:'hoy' },
    { title:'Widget de score en la pantalla de inicio', desc:'Medium widget con score del día y racha.', status:'inbox', prio:'media', age:'hace 2 días' },
  ];
  const prioColor = { urgente:'var(--sys-red)', alta:'var(--sys-orange)', media:'var(--accent)', baja:'var(--text-3)' };

  return (
    <>
      <NavHeader
        eyebrow="IDEAS"
        title="Capturar"
        right={<GlassPillBtn icon={<IconSearch size={16}/>}/>}/>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* Quick capture */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'12px 16px', borderRadius:16,
          background:'var(--fill-1)',
          border:'0.5px solid var(--hairline)',
        }}>
          <span style={{ color:'var(--accent)' }}><IconIdeas size={18}/></span>
          <span style={{ flex:1, fontSize:14, color:'var(--text-3)', letterSpacing:-0.1 }}>Captura una idea…</span>
          <span style={{ color:'var(--text-3)' }}><IconPlus size={16}/></span>
        </div>

        {/* Status counts */}
        <div style={{ display:'flex', gap:8, overflowX:'auto' }} className="phone-scroll">
          {STATUSES.map(s=>(
            <div key={s.id} style={{
              flexShrink:0,
              padding:'10px 14px', borderRadius:14,
              background:'var(--surface-1)', border:'0.5px solid var(--hairline)',
              minWidth:96,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <div style={{ width:6, height:6, borderRadius:3, background:s.color }}/>
                <div style={{ fontSize:11, color:'var(--text-3)', fontWeight:500, letterSpacing:0.1 }}>{s.label}</div>
              </div>
              <div style={{
                fontFamily:'ui-rounded, -apple-system, system-ui',
                fontSize:22, fontWeight:700, color:'var(--text-1)', letterSpacing:-0.5, lineHeight:1,
              }}>{s.count}</div>
            </div>
          ))}
        </div>

        {/* Ideas list */}
        <Card padding={0} radius={22}>
          {ideas.map((idea,i)=>{
            const status = STATUSES.find(s=>s.id===idea.status);
            return (
              <div key={i} style={{
                padding:'14px 18px',
                borderTop: i>0 ? '0.5px solid var(--separator)':'none',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:10, alignItems:'flex-start', marginBottom:6 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2, flex:1 }}>{idea.title}</div>
                  <div style={{
                    width:8, height:8, borderRadius:4, background:prioColor[idea.prio], flexShrink:0, marginTop:6,
                  }}/>
                </div>
                <div style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.5, letterSpacing:-0.1, marginBottom:10 }}>
                  {idea.desc}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Chip tint={status.color}>{status.label}</Chip>
                  <span style={{ fontSize:11, color:'var(--text-3)' }}>{idea.age}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AJUSTES
// ─────────────────────────────────────────────────────────────────────────────
function AjustesScreen() {
  const colors = ['#3B82F6','#6366F1','#8B5CF6','#10B981','#F59E0B','#EC4899','#64748B','#F97316'];
  return (
    <>
      <NavHeader eyebrow="AJUSTES" title="Configuración"/>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:18 }}>
        {/* Account */}
        <Card padding={0} radius={22}>
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px' }}>
            <div style={{
              width:48, height:48, borderRadius:24,
              background:'linear-gradient(135deg, var(--accent), var(--sys-purple))',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontSize:18, fontWeight:700,
            }}>A</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.3 }}>Alex Morales</div>
              <div style={{ fontSize:13, color:'var(--text-3)', letterSpacing:-0.1 }}>alex@zuppej.app</div>
            </div>
            <span style={{ color:'var(--text-3)' }}><IconChevR size={14}/></span>
          </div>
          <div style={{
            padding:'10px 18px', borderTop:'0.5px solid var(--separator)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            background:'var(--sys-green-soft)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:4, background:'var(--sys-green)' }}/>
              <span style={{ fontSize:12, color:'var(--sys-green)', fontWeight:600, letterSpacing:-0.1 }}>iCloud sincronizado</span>
            </div>
            <span style={{ fontSize:11, fontFamily:'ui-monospace, SF Mono', color:'var(--text-3)' }}>hace 2 min</span>
          </div>
        </Card>

        {/* Accent color */}
        <div>
          <SectionHeader>Color de acento</SectionHeader>
          <Card padding={14} radius={18}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
              {colors.map(c=>(
                <div key={c} style={{
                  width:36, height:36, borderRadius:18, background:c,
                  boxShadow: c==='#3B82F6' ? `0 0 0 3px var(--surface-1), 0 0 0 5px ${c}` : '0 1px 3px rgba(0,0,0,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {c==='#3B82F6' && <span style={{ color:'#fff' }}><IconCheck size={14}/></span>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sections */}
        <div>
          <SectionHeader>Vistas</SectionHeader>
          <Card padding={0} radius={18}>
            <ListRow
              icon={<IconHabits size={16}/>} iconTint="var(--sys-green)"
              title="Hábitos" value="Activo"
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
            <ListRow
              icon={<IconMental size={16}/>} iconTint="var(--sys-purple)"
              title="Control mental" value="Activo"
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
            <ListRow
              icon={<IconFlag size={16}/>} iconTint="var(--sys-orange)"
              title="Cierre diario" value="Activo"
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
            <ListRow
              icon={<IconReflection size={16}/>} iconTint="var(--accent)"
              title="Reflexión semanal" value="Activo" last
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
          </Card>
        </div>

        <div>
          <SectionHeader>Datos y sincronización</SectionHeader>
          <Card padding={0} radius={18}>
            <ListRow icon={<IconCycle size={16}/>} iconTint="var(--accent)" title="Sincronizar ahora"
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
            <ListRow icon={<IconAnalytics size={16}/>} iconTint="var(--sys-indigo)" title="Exportar datos"
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
            <ListRow icon={<IconReminder size={16}/>} iconTint="var(--sys-red)" title="Notificaciones" value="3 activas" last
              right={<span style={{ color:'var(--text-3)' }}><IconChevR size={13}/></span>}/>
          </Card>
        </div>

        <div>
          <SectionHeader>Cuenta</SectionHeader>
          <Card padding={0} radius={18}>
            <ListRow title="Cerrar sesión" destructive last/>
          </Card>
        </div>

        <div style={{
          textAlign:'center', fontSize:11, color:'var(--text-3)', padding:'10px 0 20px', letterSpacing:0.1,
        }}>
          ZUPPEJ · versión 2.0 · diseñada para ejecutar
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  SemanalScreen, MensualScreen, CalendarioScreen, DoceScreen, IdeasScreen, AjustesScreen,
});
