// screens.jsx — All ZUPPEJ redesigned screens. Mobile-first, Apple-grade.
const { useState: uS, useMemo: uM, useEffect: uE } = React;

// ── Shared: phone viewport shell ─────────────────────────────────────────────
function PhoneShell({ children, dark, noTab, bg }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      background: bg || (dark ? 'var(--app-bg-dark)' : 'var(--app-bg)'),
      overflow:'hidden',
    }}>
      {/* scroll area */}
      <div style={{
        position:'absolute', inset: 0,
        overflowY:'auto', overflowX:'hidden',
        paddingTop: 54, // below dynamic island
        paddingBottom: noTab ? 34 : 110,
        scrollbarWidth:'none',
      }} className="phone-scroll">
        {children}
      </div>
    </div>
  );
}

// ── Navigation header (big rounded title, glass on scroll) ────────────────────
function NavHeader({ eyebrow, title, right, subtitle, dark }) {
  return (
    <div style={{ padding:'12px 20px 14px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          {eyebrow && <div style={{
            fontSize:12, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase',
            color:'var(--accent)', marginBottom:6,
          }}>{eyebrow}</div>}
          <h1 style={{
            fontFamily:'ui-rounded, -apple-system, "SF Pro Rounded", system-ui',
            fontSize: 32, fontWeight: 700, letterSpacing: 0.35,
            color:'var(--text-1)', lineHeight:1.03, margin:0,
            textTransform: eyebrow === 'HOY' || eyebrow === 'SEMANA' || eyebrow==='MES' || eyebrow==='CICLO' ? 'capitalize':'none',
          }}>{title}</h1>
          {subtitle && <div style={{
            fontSize:14, color:'var(--text-3)', marginTop:4, letterSpacing:-0.1,
          }}>{subtitle}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — Login
// ─────────────────────────────────────────────────────────────────────────────
function AuthScreen() {
  const [mode, setMode] = uS('login');
  const [focus, setFocus] = uS(null);
  return (
    <div style={{
      position:'absolute', inset:0,
      background: 'radial-gradient(ellipse at 50% 0%, #1B2A4E 0%, #0A1428 55%, #050A18 100%)',
      overflow:'hidden',
    }}>
      {/* ambient orbs */}
      <div style={{
        position:'absolute', top:-80, left:-60, width:280, height:280, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(96,165,250,0.35), transparent 70%)', filter:'blur(20px)',
      }}/>
      <div style={{
        position:'absolute', bottom:120, right:-80, width:260, height:260, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)', filter:'blur(20px)',
      }}/>

      <div style={{
        position:'absolute', inset:0, padding:'100px 28px 60px',
        display:'flex', flexDirection:'column', gap:36,
      }}>
        {/* app icon + lockup */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18 }}>
          <ZuppejAppIcon size={96}/>
          <div style={{ textAlign:'center' }}>
            <div style={{
              fontFamily:'ui-rounded, -apple-system, system-ui',
              fontSize:28, fontWeight:700, letterSpacing:0.5, color:'#fff',
            }}>ZUPPEJ</div>
            <div style={{
              fontSize:14, color:'rgba(255,255,255,0.55)', marginTop:4, letterSpacing:-0.1,
            }}>Ejecución personal. Cada día.</div>
          </div>
        </div>

        {/* glass login card */}
        <GlassSurface radius={24} tint="dark" lift={4}
          style={{ padding:'22px 20px 20px' }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.08)', borderRadius:10, padding:2, marginBottom:18 }}>
            {['login','signup'].map(m => (
              <button key={m} onClick={()=>setMode(m)} style={{
                flex:1, padding:'8px 10px', borderRadius:8, border:'none',
                background: mode===m ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: mode===m ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize:13, fontWeight: mode===m ? 600 : 500, cursor:'pointer',
                letterSpacing:-0.1,
              }}>{m==='login'?'Iniciar sesión':'Crear cuenta'}</button>
            ))}
          </div>

          {[
            { key:'email', label:'Correo', type:'email', placeholder:'tu@correo.com', value:'alex@zuppej.app' },
            { key:'password', label:'Contraseña', type:'password', placeholder:'••••••••', value:'••••••••••' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:12 }}>
              <label style={{
                display:'block', fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.55)',
                marginBottom:6, letterSpacing:0.1,
              }}>{f.label}</label>
              <div style={{
                position:'relative',
                background:'rgba(255,255,255,0.06)',
                border:`1px solid ${focus===f.key?'rgba(96,165,250,0.6)':'rgba(255,255,255,0.1)'}`,
                borderRadius:12, padding:'13px 14px',
                fontSize:15, color:'#fff', letterSpacing:-0.2,
                transition:'border-color 0.2s',
              }} onClick={()=>setFocus(f.key)}>
                {f.value}
              </div>
            </div>
          ))}

          <button style={{
            width:'100%', marginTop:10, padding:'14px 20px', borderRadius:14,
            border:'none', cursor:'pointer',
            background:'linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%)',
            boxShadow:'0 4px 14px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            color:'#fff', fontSize:16, fontWeight:600, letterSpacing:-0.2,
          }}>
            {mode==='login'?'Continuar':'Crear cuenta'}
          </button>

          <div style={{
            textAlign:'center', marginTop:14, fontSize:13,
            color:'rgba(255,255,255,0.45)',
          }}>
            {mode==='login' ? '¿Has olvidado tu contraseña?' : 'Al crear una cuenta aceptas nuestros términos.'}
          </div>
        </GlassSurface>

        <div style={{ marginTop:'auto', textAlign:'center' }}>
          <div style={{
            fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:0.2,
          }}>Sincronizado con iCloud · Supabase</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOY — Today's dashboard
// ─────────────────────────────────────────────────────────────────────────────
function HoyScreen() {
  const [tab, setTab] = uS('dashboard');
  const todayScore = 7.8;
  const habits = [
    { name:'Lectura 30 min', done:true },
    { name:'Ejercicio', done:true },
    { name:'Meditación', done:true },
    { name:'Sin redes antes de 12h', done:false },
    { name:'Review del plan', done:true },
    { name:'Journaling nocturno', done:false },
  ];
  const doneH = habits.filter(h=>h.done).length;
  const tasks = {
    top3: [
      { text:'Cerrar propuesta Q2', done:false },
      { text:'Sesión deep work — arquitectura', done:true },
      { text:'Llamada con mentor', done:false },
    ],
    enfoque: [
      { text:'Revisar pull requests', done:false },
      { text:'Preparar plan de trading', done:false },
    ],
    parking: [
      { text:'Organizar notas de lectura', done:false },
    ],
  };

  const tabs = [
    { id:'dashboard', label:'Dashboard' },
    { id:'tareas', label:'Tareas' },
    { id:'habitos', label:'Hábitos' },
    { id:'mental', label:'Mental' },
    { id:'cierre', label:'Cierre' },
  ];

  return (
    <>
      <NavHeader
        eyebrow="HOY"
        title="jueves, 24 abril"
        right={<ScorePill score={todayScore} size="lg"/>}/>

      {/* Tab strip — glass pill */}
      <div style={{ padding:'0 20px 14px' }}>
        <div style={{ display:'flex', gap:4, overflowX:'auto' }} className="phone-scroll">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'6px 13px', borderRadius:999, border:'none',
              background: tab===t.id ? 'var(--accent)' : 'var(--fill-1)',
              color: tab===t.id ? '#fff' : 'var(--text-2)',
              fontSize:13, fontWeight: tab===t.id ? 600 : 500,
              letterSpacing:-0.1, cursor:'pointer', whiteSpace:'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {tab === 'dashboard' && <HoyDashboard score={todayScore} habits={habits} tasks={tasks}/>}
      {tab === 'tareas' && <HoyTareas tasks={tasks}/>}
      {tab === 'habitos' && <HoyHabitos habits={habits}/>}
      {tab === 'mental' && <HoyMental/>}
      {tab === 'cierre' && <HoyCierre/>}
    </>
  );
}

function HoyDashboard({ score, habits, tasks }) {
  const doneH = habits.filter(h=>h.done).length;
  const mental = 8.2;
  const top3Done = tasks.top3.filter(t=>t.done).length;
  const streak = 12;

  return (
    <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
      {/* HERO — Score card */}
      <Card padding={0} radius={22} style={{ overflow:'hidden' }}>
        <div style={{
          position:'relative', padding:'22px 22px 18px',
          background:`linear-gradient(135deg, ${scoreHueSoft(score)} 0%, transparent 70%)`,
        }}>
          <div style={{
            fontSize:12, fontWeight:600, letterSpacing:1, textTransform:'uppercase',
            color:'var(--text-3)', marginBottom:10,
          }}>Score del día</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:16 }}>
            <div style={{
              fontFamily:'ui-rounded, -apple-system, system-ui',
              fontSize: 72, fontWeight: 700, letterSpacing:-2.5,
              color: scoreHue(score), lineHeight:0.95,
            }}>{score.toFixed(1)}</div>
            <div style={{ paddingBottom:10, flex:1 }}>
              <div style={{ fontSize:13, color:'var(--text-3)', marginBottom:6 }}>de 10 · por encima del objetivo</div>
              <LinearProgress value={score} max={10} color={scoreHue(score)} thickness={5}/>
            </div>
          </div>
          {/* streak chip */}
          <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
            <Chip tint="var(--sys-orange)">🔥 {streak} días</Chip>
            <Chip tint="var(--accent)">Media 7d · 7.2</Chip>
            <Chip>Mes · 6.9</Chip>
          </div>
        </div>
      </Card>

      {/* Three activity rings */}
      <Card padding={18} radius={22}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around', gap:8 }}>
          {[
            { label:'Hábitos', value:doneH, max:habits.length, unit:`${doneH}/${habits.length}`, color:'var(--sys-green)' },
            { label:'Mental', value:mental, max:10, unit:`${mental.toFixed(1)}`, color:'var(--accent)' },
            { label:'Top 3', value:top3Done, max:3, unit:`${top3Done}/3`, color:'var(--sys-purple)' },
          ].map(r=>(
            <div key={r.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <Ring value={r.value} max={r.max} size={72} stroke={7} color={r.color}>
                <span style={{
                  fontFamily:'ui-rounded, -apple-system, system-ui',
                  fontSize:16, fontWeight:700, color:r.color, letterSpacing:-0.5,
                }}>{r.unit}</span>
              </Ring>
              <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:500, letterSpacing:0.1, textTransform:'uppercase' }}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top 3 */}
      <Card padding={0} radius={22}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 18px 10px' }}>
          <div>
            <div style={{
              fontSize:11, fontWeight:600, letterSpacing:0.8, textTransform:'uppercase',
              color:'var(--text-3)', marginBottom:2,
            }}>TOP 3 DE HOY</div>
            <div style={{ fontSize:16, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>
              Prioridades no negociables
            </div>
          </div>
          <Chip tint="var(--accent)">{tasks.top3.filter(t=>t.done).length}/3</Chip>
        </div>
        <div style={{ padding:'0 18px 12px' }}>
          {tasks.top3.map((t,i)=>(
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12, padding:'10px 0',
              borderTop: i>0 ? '0.5px solid var(--separator)':'none',
            }}>
              <div style={{
                width:22, height:22, borderRadius:11,
                border: t.done ? 'none' : '1.5px solid var(--separator-strong)',
                background: t.done ? 'var(--sys-green)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff',
              }}>
                {t.done && <IconCheck size={13}/>}
              </div>
              <div style={{
                flex:1, fontSize:15, color: t.done ? 'var(--text-3)':'var(--text-1)',
                letterSpacing:-0.2,
                textDecoration: t.done ? 'line-through':'none',
              }}>{t.text}</div>
              <div style={{
                fontSize:11, fontWeight:700, color:'var(--accent)',
                background:'var(--accent-soft)', padding:'2px 7px', borderRadius:999,
              }}>#{i+1}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Habits quick list */}
      <Card padding={0} radius={22}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 18px 10px' }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{ color:'var(--sys-green)' }}><IconHabits size={18}/></span>
            <div style={{ fontSize:16, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>Hábitos</div>
          </div>
          <div style={{
            fontFamily:'ui-monospace, SF Mono', fontSize:13, color:'var(--text-3)',
          }}>{doneH}/{habits.length}</div>
        </div>
        <div style={{ padding:'0 18px 10px' }}>
          <LinearProgress value={doneH} max={habits.length} color="var(--sys-green)" thickness={4}/>
        </div>
        <div style={{ padding:'0 8px 14px' }}>
          {habits.slice(0,5).map((h,i)=>(
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12, padding:'9px 10px',
              borderRadius:10,
            }}>
              <div style={{
                width:20, height:20, borderRadius:6,
                border: h.done ? 'none' : '1.5px solid var(--separator-strong)',
                background: h.done ? 'var(--sys-green)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
              }}>
                {h.done && <IconCheck size={12}/>}
              </div>
              <div style={{ flex:1, fontSize:14, color: h.done ? 'var(--text-3)':'var(--text-1)', letterSpacing:-0.15 }}>
                {h.name}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insight banner */}
      <div style={{
        padding:'14px 16px', borderRadius:16,
        background:'linear-gradient(135deg, var(--accent-soft), transparent)',
        border:'0.5px solid var(--accent-soft-strong)',
        display:'flex', gap:12, alignItems:'flex-start',
      }}>
        <div style={{
          flexShrink:0, width:30, height:30, borderRadius:9,
          background:'var(--accent)', color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}><IconSparkle size={16}/></div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-1)', marginBottom:2, letterSpacing:-0.1 }}>
            Vas en racha
          </div>
          <div style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.4, letterSpacing:-0.1 }}>
            12 días consecutivos con score ≥ 6. Tu mejor racha del trimestre.
          </div>
        </div>
      </div>
    </div>
  );
}

function HoyTareas({ tasks }) {
  const LANES = [
    { id:'top3', label:'Top 3', desc:'máx. 3', color:'var(--accent)' },
    { id:'enfoque', label:'En Foco', desc:'', color:'var(--sys-purple)' },
    { id:'parking', label:'Parking', desc:'', color:'var(--text-3)' },
  ];
  return (
    <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background:'var(--fill-1)', borderRadius:12, padding:'10px 14px',
      }}>
        <span style={{ color:'var(--text-3)' }}><IconPlus size={16}/></span>
        <span style={{ fontSize:14, color:'var(--text-3)', letterSpacing:-0.1 }}>Nueva tarea…</span>
      </div>

      {LANES.map(lane => (
        <Card key={lane.id} padding={0} radius={22}>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px 8px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:6, height:6, borderRadius:3, background: lane.color }}/>
              <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>{lane.label}</div>
              {lane.desc && <span style={{ fontSize:11, color:'var(--text-3)' }}>{lane.desc}</span>}
            </div>
            <div style={{ fontFamily:'ui-monospace, SF Mono', fontSize:12, color:'var(--text-3)' }}>
              {tasks[lane.id].length}
            </div>
          </div>
          <div style={{ padding:'0 10px 12px' }}>
            {tasks[lane.id].map((t,i)=>(
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:11, padding:'10px 10px',
                borderRadius:12,
                background: t.done ? 'transparent':'transparent',
              }}>
                <div style={{
                  width:20, height:20, borderRadius:10,
                  border: t.done ? 'none' : `1.5px solid ${lane.color}55`,
                  background: t.done ? lane.color : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
                  flexShrink:0,
                }}>
                  {t.done && <IconCheck size={12}/>}
                </div>
                <div style={{
                  flex:1, fontSize:14, color: t.done ? 'var(--text-3)':'var(--text-1)',
                  letterSpacing:-0.15,
                  textDecoration: t.done ? 'line-through':'none',
                }}>{t.text}</div>
              </div>
            ))}
            {tasks[lane.id].length === 0 && (
              <div style={{
                textAlign:'center', padding:'14px 0', fontSize:13, color:'var(--text-3)', fontStyle:'italic',
              }}>Sin tareas</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function HoyHabitos({ habits }) {
  const doneH = habits.filter(h=>h.done).length;
  const pct = Math.round(doneH/habits.length*100);
  return (
    <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
      <Card radius={22} padding={20}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Ring value={doneH} max={habits.length} size={90} stroke={9} color="var(--sys-green)">
            <div style={{ textAlign:'center' }}>
              <div style={{
                fontFamily:'ui-rounded, -apple-system, system-ui',
                fontSize:22, fontWeight:700, color:'var(--sys-green)', letterSpacing:-0.8,
              }}>{doneH}<span style={{ fontSize:13, color:'var(--text-3)', fontWeight:500 }}>/{habits.length}</span></div>
            </div>
          </Ring>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'var(--text-3)', fontWeight:500, letterSpacing:0.4, textTransform:'uppercase' }}>Hoy</div>
            <div style={{ fontSize:20, fontWeight:700, color:'var(--text-1)', letterSpacing:-0.3, marginTop:2 }}>
              {pct}% completado
            </div>
            <div style={{ fontSize:13, color:'var(--text-3)', marginTop:4, letterSpacing:-0.1 }}>
              Objetivo: 80% para sumar al score
            </div>
          </div>
        </div>
      </Card>

      <Card padding={0} radius={22}>
        {habits.map((h,i)=>(
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
            borderBottom: i<habits.length-1 ? '0.5px solid var(--separator)':'none',
          }}>
            <div style={{
              width:24, height:24, borderRadius:7,
              border: h.done ? 'none' : '1.5px solid var(--separator-strong)',
              background: h.done ? 'var(--sys-green)' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
              flexShrink:0,
            }}>
              {h.done && <IconCheck size={14}/>}
            </div>
            <div style={{
              flex:1, fontSize:15, color: h.done ? 'var(--text-3)':'var(--text-1)', letterSpacing:-0.2,
              textDecoration: h.done ? 'line-through':'none',
            }}>{h.name}</div>
            {h.done && (
              <div style={{
                fontSize:10, fontFamily:'ui-monospace, SF Mono',
                color:'var(--sys-green)', fontWeight:600,
              }}>+{(10/habits.length).toFixed(2)}</div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function HoyMental() {
  const FACTORS = [
    { label:'Miedo', state:'bien', desc:'Actué con claridad.' },
    { label:'Codicia', state:'bien', desc:'Sin riesgo extra.' },
    { label:'Venganza', state:'bien', desc:'No perseguí pérdidas.' },
    { label:'Paciencia', state:'mal', desc:'Entré antes del setup.' },
    { label:'Seguir el plan', state:'bien', desc:'Sistema respetado.' },
    { label:'Gestión riesgo', state:'bien', desc:'Sizing y stops OK.' },
  ];
  const score = 8.2;
  return (
    <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
      <Card radius={22} padding={20}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--text-3)', letterSpacing:1, textTransform:'uppercase' }}>Control mental</div>
            <div style={{
              fontFamily:'ui-rounded, -apple-system, system-ui',
              fontSize:56, fontWeight:700, color: scoreHue(score), letterSpacing:-2, lineHeight:1, marginTop:6,
            }}>{score.toFixed(1)}<span style={{ fontSize:18, color:'var(--text-3)', fontWeight:500 }}>/10</span></div>
          </div>
          <Chip tint="var(--sys-green)">5 bien · 1 mal</Chip>
        </div>
      </Card>

      <Card padding={0} radius={22}>
        {FACTORS.map((f,i)=>(
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
            borderBottom: i<FACTORS.length-1 ? '0.5px solid var(--separator)':'none',
          }}>
            <div style={{
              width:8, height:8, borderRadius:4,
              background: f.state==='bien' ? 'var(--sys-green)' : 'var(--sys-red)',
              flexShrink:0,
            }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:500, color:'var(--text-1)', letterSpacing:-0.2 }}>{f.label}</div>
              <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2, letterSpacing:-0.1 }}>{f.desc}</div>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {['bien','mal'].map(s=>(
                <div key={s} style={{
                  padding:'5px 10px', borderRadius:7,
                  fontSize:11, fontWeight:600,
                  background: f.state===s
                    ? (s==='bien' ? 'var(--sys-green-soft)':'var(--sys-red-soft)')
                    : 'var(--fill-1)',
                  color: f.state===s
                    ? (s==='bien'?'var(--sys-green)':'var(--sys-red)')
                    : 'var(--text-3)',
                }}>
                  {s==='bien'?'Bien':'Mal'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <Card radius={22} padding={18}
        style={{ background:'var(--surface-ink)', border:'0.5px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>Recordatorios</div>
        {[
          'No necesitas operar hoy.',
          'Protege tu capital ante todo.',
          'No persigas el precio.',
          'Sigue tu plan. El plan no falla, la ejecución sí.',
        ].map((r,i)=>(
          <div key={i} style={{
            display:'flex', gap:10, padding:'8px 0',
            borderTop: i>0 ? '0.5px solid rgba(255,255,255,0.06)':'none',
          }}>
            <span style={{
              fontFamily:'ui-monospace, SF Mono', fontSize:11,
              color:'rgba(96,165,250,0.8)', minWidth:18,
            }}>0{i+1}</span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.72)', fontStyle:'italic', letterSpacing:-0.1, lineHeight:1.5 }}>
              {r}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function HoyCierre() {
  return (
    <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:14 }}>
      {[
        { label:'¿Qué movió la aguja hoy?', value:'Cerré el primer MVP de la propuesta Q2. Liberó 3h de lunes.' },
        { label:'Bloqueo o error principal', value:'Me distraje con Slack durante el deep work. 20 min perdidos.' },
        { label:'Primera acción de mañana', value:'Revisar feedback del mentor a primera hora.' },
      ].map(f => (
        <div key={f.label}>
          <div style={{
            fontSize:11, fontWeight:600, color:'var(--text-3)',
            letterSpacing:0.8, textTransform:'uppercase', marginBottom:6, paddingLeft:4,
          }}>{f.label}</div>
          <Card radius={16} padding={14}>
            <div style={{ fontSize:14, color:'var(--text-1)', lineHeight:1.5, letterSpacing:-0.15 }}>{f.value}</div>
          </Card>
        </div>
      ))}

      <Card padding={0} radius={22} style={{ marginTop:4 }}>
        <div style={{ padding:'14px 18px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', letterSpacing:-0.2 }}>Checklist de cierre</div>
          <Chip tint="var(--sys-green)">3/5</Chip>
        </div>
        {[
          { t:'Tareas del día revisadas', d:true },
          { t:'Inbox vacío', d:true },
          { t:'Prioridades de mañana claras', d:true },
          { t:'Plan de trading listo', d:false },
          { t:'Diario completado', d:false },
        ].map((it,i,arr)=>(
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 18px',
            borderTop: '0.5px solid var(--separator)',
          }}>
            <div style={{
              width:20, height:20, borderRadius:6,
              border: it.d ? 'none' : '1.5px solid var(--separator-strong)',
              background: it.d ? 'var(--sys-green)':'transparent',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
            }}>
              {it.d && <IconCheck size={12}/>}
            </div>
            <div style={{
              flex:1, fontSize:14, color: it.d ? 'var(--text-3)':'var(--text-1)', letterSpacing:-0.15,
              textDecoration: it.d ? 'line-through':'none',
            }}>{it.t}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

Object.assign(window, { PhoneShell, NavHeader, AuthScreen, HoyScreen });
