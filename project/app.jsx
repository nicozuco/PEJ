// app.jsx — Assembles all ZUPPEJ screens onto the design canvas.

const { useState: uSA, useMemo: uMA } = React;

const TABS = [
  { id:'hoy',      label:'Hoy',        active: IconHoyFill,        inactive: IconHoy },
  { id:'semanal',  label:'Semanal',    active: IconSemanalFill,    inactive: IconSemanal },
  { id:'mensual',  label:'Mensual',    active: IconMensualFill,    inactive: IconMensual },
  { id:'calendario', label:'Calendario', active: IconCalendarioFill, inactive: IconCalendario },
  { id:'doce',     label:'12 sem',     active: IconDoceFill,       inactive: IconDoce },
  { id:'ideas',    label:'Ideas',      active: IconIdeasFill,      inactive: IconIdeas },
];

function Phone({ screen, dark, noTab, label }) {
  return (
    <div className="phone-root" style={{
      width: '100%', height: '100%', position:'relative',
      background: dark ? 'var(--app-bg-dark)' : 'var(--app-bg)',
      borderRadius: 24, overflow:'hidden',
    }}>
      {screen}
      {!noTab && (
        <TabBar items={TABS} current={label} onChange={()=>{}} dark={dark}/>
      )}
    </div>
  );
}

function App() {
  const [theme, setTheme] = uSA('light'); // light | dark
  const [accent, setAccent] = uSA('blue');

  const ACCENTS = {
    blue:   { c:'#3B82F6', s:'rgba(59,130,246,0.12)',  ss:'rgba(59,130,246,0.28)' },
    indigo: { c:'#5E5CE6', s:'rgba(94,92,230,0.12)',   ss:'rgba(94,92,230,0.28)' },
    violet: { c:'#8B5CF6', s:'rgba(139,92,246,0.12)',  ss:'rgba(139,92,246,0.28)' },
    emerald:{ c:'#10B981', s:'rgba(16,185,129,0.12)',  ss:'rgba(16,185,129,0.28)' },
    amber:  { c:'#F59E0B', s:'rgba(245,158,11,0.14)',  ss:'rgba(245,158,11,0.32)' },
    rose:   { c:'#F43F5E', s:'rgba(244,63,94,0.12)',   ss:'rgba(244,63,94,0.28)' },
  };

  React.useEffect(()=>{
    const a = ACCENTS[accent];
    document.documentElement.style.setProperty('--accent', a.c);
    document.documentElement.style.setProperty('--accent-soft', a.s);
    document.documentElement.style.setProperty('--accent-soft-strong', a.ss);
  }, [accent]);

  React.useEffect(()=>{
    const r = document.documentElement;
    if (theme === 'dark') {
      r.style.setProperty('--app-bg', '#000');
      r.style.setProperty('--surface-1', '#1C1C1E');
      r.style.setProperty('--surface-ink', '#0A0A0C');
      r.style.setProperty('--fill-1', 'rgba(120,120,128,0.24)');
      r.style.setProperty('--fill-2', 'rgba(120,120,128,0.36)');
      r.style.setProperty('--text-1', '#FFFFFF');
      r.style.setProperty('--text-2', 'rgba(235,235,245,0.78)');
      r.style.setProperty('--text-3', 'rgba(235,235,245,0.48)');
      r.style.setProperty('--separator', 'rgba(84,84,88,0.36)');
      r.style.setProperty('--separator-strong', 'rgba(84,84,88,0.65)');
      r.style.setProperty('--hairline', 'rgba(255,255,255,0.08)');
      r.style.setProperty('--hairline-top', 'rgba(255,255,255,0.07)');
      r.style.setProperty('--hairline-bot', 'rgba(0,0,0,0.4)');
      r.style.setProperty('--glass', 'rgba(28,30,35,0.66)');
      r.style.setProperty('--shadow-a1', '0.2');
      r.style.setProperty('--shadow-a2', '0.3');
    } else {
      r.style.setProperty('--app-bg', '#F2F2F7');
      r.style.setProperty('--surface-1', '#FFFFFF');
      r.style.setProperty('--surface-ink', '#111318');
      r.style.setProperty('--fill-1', 'rgba(120,120,128,0.10)');
      r.style.setProperty('--fill-2', 'rgba(120,120,128,0.14)');
      r.style.setProperty('--text-1', '#0A0D14');
      r.style.setProperty('--text-2', '#3A3D46');
      r.style.setProperty('--text-3', '#8A8D96');
      r.style.setProperty('--separator', 'rgba(60,60,67,0.10)');
      r.style.setProperty('--separator-strong', 'rgba(60,60,67,0.28)');
      r.style.setProperty('--hairline', 'rgba(60,60,67,0.12)');
      r.style.setProperty('--hairline-top', 'rgba(255,255,255,0.7)');
      r.style.setProperty('--hairline-bot', 'rgba(0,0,0,0.04)');
      r.style.setProperty('--glass', 'rgba(255,255,255,0.72)');
      r.style.setProperty('--shadow-a1', '0.04');
      r.style.setProperty('--shadow-a2', '0.05');
    }
  }, [theme]);

  const dark = theme === 'dark';

  const PW = 320, PH = 680;

  return (
    <>
      <DesignCanvas>
        <DCSection id="auth" title="Acceso" subtitle="Onboarding · iCloud · Supabase">
          <DCArtboard id="login" label="Login — Liquid Glass" width={PW} height={PH}>
            <Phone screen={<AuthScreen/>} noTab label="auth"/>
          </DCArtboard>
        </DCSection>

        <DCSection id="hoy" title="Hoy" subtitle="Dashboard · Tareas · Hábitos · Mental · Cierre">
          <DCArtboard id="hoy" label="Hoy — Dashboard" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><HoyScreen/></PhoneShell>} dark={dark} label="hoy"/>
          </DCArtboard>
        </DCSection>

        <DCSection id="vistas" title="Vistas de ejecución" subtitle="Semanal · Mensual · Calendario · 12 Semanas">
          <DCArtboard id="semanal" label="Semanal" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><SemanalScreen/></PhoneShell>} dark={dark} label="semanal"/>
          </DCArtboard>
          <DCArtboard id="mensual" label="Mensual" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><MensualScreen/></PhoneShell>} dark={dark} label="mensual"/>
          </DCArtboard>
          <DCArtboard id="calendario" label="Calendario" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><CalendarioScreen/></PhoneShell>} dark={dark} label="calendario"/>
          </DCArtboard>
          <DCArtboard id="doce" label="12 Semanas" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><DoceScreen/></PhoneShell>} dark={dark} label="doce"/>
          </DCArtboard>
        </DCSection>

        <DCSection id="extras" title="Complementos" subtitle="Ideas + Ajustes">
          <DCArtboard id="ideas" label="Ideas" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><IdeasScreen/></PhoneShell>} dark={dark} label="ideas"/>
          </DCArtboard>
          <DCArtboard id="ajustes" label="Ajustes" width={PW} height={PH}>
            <Phone screen={<PhoneShell dark={dark}><AjustesScreen/></PhoneShell>} dark={dark} label="ajustes"/>
          </DCArtboard>
        </DCSection>

        <DCPostIt x={60} y={20} w={280}>
          <strong>ZUPPEJ — rediseño iOS</strong><br/>
          App nativa iOS con estética Liquid Glass, tipografía SF Rounded para títulos, e iconografía bespoke.
          La paleta se adapta al acento del usuario (Ajustes). Score por cálculo de hábitos (40%), tareas top 3 (30%) y control mental (30%).
        </DCPostIt>
        <DCPostIt x={60} y={PH + 120} w={260}>
          <strong>Sistema de color</strong><br/>
          Verde = 8-10, Ámbar = 6-8, Rojo &lt; 6. Tintas suaves sobre superficies blancas, manteniendo contraste WCAG AA en texto.
        </DCPostIt>
      </DesignCanvas>

      <TweaksBridge accent={accent} setAccent={setAccent} theme={theme} setTheme={setTheme}/>
    </>
  );
}

function TweaksBridge({ accent, setAccent, theme, setTheme }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Tema">
        <TweakRadio options={[
          { value:'light', label:'Claro' },
          { value:'dark', label:'Oscuro' },
        ]} value={theme} onChange={setTheme}/>
      </TweakSection>
      <TweakSection label="Color de acento">
        <TweakRadio options={[
          { value:'blue', label:'Azul' },
          { value:'indigo', label:'Índigo' },
          { value:'violet', label:'Violeta' },
          { value:'emerald', label:'Esmeralda' },
          { value:'amber', label:'Ámbar' },
          { value:'rose', label:'Rosa' },
        ]} value={accent} onChange={setAccent}/>
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
