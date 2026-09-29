// Black Coffee Gdańsk teaser — builds on animations-v3.jsx globals
const { CompositionStage, useComposition, Shot, Easing, animate, clamp } = window;

const GOLD = '#C8A462', CREAM = '#F2EEE7', INK = '#0B0B0B';
const FONT = "'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif";

const MOTION = {
  enter: (start, dur = 0.8) => (T) => animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeOutCubic })(T),
  drift: (start, end, from, to) => (T) => animate({ from, to, start, end, ease: Easing.linear })(T),
  pop: (start, dur = 0.6) => (T) => animate({ from: 0.92, to: 1, start, end: start + dur, ease: Easing.easeOutBack })(T),
};

function Photo({ src, from, to, pos, zoomFrom, zoomTo, dim = 0.45, fadeOut = true, panX = 0 }) {
  const { T } = useComposition();
  const scale = MOTION.drift(from, to, zoomFrom, zoomTo)(T);
  const x = MOTION.drift(from, to, 0, panX)(T);
  const fadeIn = MOTION.enter(from, 0.5)(T);
  const out = fadeOut ? 1 - MOTION.enter(to - 0.5, 0.5)(T) : 1;
  return (
    <Shot from={from} to={to}>
      <div style={{ position: 'absolute', inset: 0, opacity: fadeIn * out }}>
        <img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `translateX(${x}px) scale(${scale})`, transformOrigin: pos }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(11,11,11,${Math.min(0.9, dim + 0.4)}) 0%, rgba(11,11,11,${dim * 0.3}) 28%, rgba(11,11,11,${dim * 0.3}) 50%, rgba(11,11,11,${Math.min(0.92, dim + 0.35)}) 100%)` }} />
      </div>
    </Shot>
  );
}

function Kicker({ text, at, until, y = 96, x = 96, align = 'left' }) {
  const { T } = useComposition();
  const e = MOTION.enter(at, 0.7)(T);
  const out = 1 - MOTION.enter(until - 0.4, 0.4)(T);
  return (
    <Shot from={at} to={until}>
      <div style={{ position: 'absolute', left: align === 'left' ? x : 0, right: align === 'left' ? 'auto' : x, top: y, fontFamily: FONT, fontSize: 26, fontWeight: 700, letterSpacing: '0.34em', textTransform: 'uppercase', color: GOLD, opacity: e * out, transform: `translateY(${(1 - e) * 20}px)`, textShadow: '0 2px 8px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,.9)' }}>{text}</div>
    </Shot>
  );
}

function Word({ text, at, until, size, color = CREAM, style }) {
  const { T } = useComposition();
  const e = MOTION.enter(at, 0.9)(T);
  const out = 1 - MOTION.enter(until - 0.45, 0.45)(T);
  return (
    <Shot from={at} to={until}>
      <div style={{ position: 'absolute', fontFamily: FONT, fontSize: size, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em', textTransform: 'uppercase', fontStretch: '78%', color, opacity: e * out, transform: `translateY(${(1 - e) * 60}px)`, textShadow: '0 6px 60px rgba(0,0,0,.7)', whiteSpace: 'nowrap', ...style }}>{text}</div>
    </Shot>
  );
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  const C = CUES;
  const END = authoredTotal;
  const logoIn = MOTION.enter(C.Logo + 0.05, 0.7)(T);
  const logoScale = MOTION.pop(C.Logo + 0.05, 0.9)(T);
  const logoDrift = MOTION.drift(C.Logo, C.Arena, 1.0, 1.06)(T);
  const logoOut = 1 - MOTION.enter(C.Arena - 0.4, 0.4)(T);
  const ctaIn = MOTION.enter(C.Tickets + 0.2, 0.8)(T);
  const ctaHold = 1 - MOTION.enter(END - 0.6, 0.6)(T);
  const grainShift = (T * 37) % 100;
  return (
    <div style={{ position: 'absolute', inset: 0, background: INK, overflow: 'hidden', color: CREAM }}>
      {/* Opening: press photo, artist visible mid-frame, text top-left */}
      <Photo src="img/bc_7_web.png" from={C.Opening} to={C.Name} pos="50% 58%" zoomFrom={1.12} zoomTo={1.0} dim={0.3} />
      <Kicker text="Pierwszy raz w Polsce · First time in Poland" at={C.Opening + 0.4} until={C.Name} />
      <Word text="Grammy" at={C.Opening + 0.9} until={C.Name} size={150} style={{ left: 96, top: 150 }} />
      <Word text="Award Winner" at={C.Opening + 1.1} until={C.Name} size={150} color={GOLD} style={{ left: 96, top: 285 }} />

      {/* Name: BLACK top-left, COFFEE bottom-right, framing the face */}
      <Photo src="img/01_okladka_black_coffee.jpg" from={C.Name} to={C.Logo} pos="50% 30%" zoomFrom={1.0} zoomTo={1.1} dim={0.3} />
      <Kicker text="Coachella · Tomorrowland · Hï Ibiza · Cercle" at={C.Name + 0.3} until={C.Logo} />
      <Word text="Black" at={C.Name + 0.5} until={C.Logo} size={300} style={{ left: 96, top: 170 }} />
      <Word text="Coffee" at={C.Name + 0.75} until={C.Logo} size={300} style={{ right: 96, bottom: 110 }} />

      {/* Logo */}
      <Shot from={C.Logo} to={C.Arena}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: logoIn * logoOut }}>
          <img src="img/bc-logo-light.png" style={{ width: 1100, transform: `scale(${logoScale * logoDrift})` }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: FONT, fontSize: 26, letterSpacing: '0.34em', textTransform: 'uppercase', color: GOLD, opacity: logoIn * logoOut }}>House · Afro House · Indoor</div>
      </Shot>

      {/* Arena + Tickets — one continuous crowd shot */}
      <Photo src="img/03_tlum_black_coffee.jpg" from={C.Arena} to={END + 0.01} pos="50% 60%" zoomFrom={1.0} zoomTo={1.3} dim={0.5} />
      <Kicker text="Hala Olivia · Gdańsk · Indoor · 7 000" at={C.Arena + 0.3} until={C.Tickets} />
      <Word text="02.10" at={C.Arena + 0.5} until={C.Tickets} size={300} style={{ left: 96, bottom: 340 }} />
      <Word text="2026" at={C.Arena + 0.75} until={C.Tickets} size={300} color={GOLD} style={{ left: 96, bottom: 110 }} />

      <Shot from={C.Tickets} to={END + 0.01}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, opacity: ctaIn * ctaHold, transform: `translateY(${(1 - ctaIn) * 30}px)` }}>
          <div style={{ fontFamily: FONT, fontSize: 30, letterSpacing: '0.34em', textTransform: 'uppercase', color: GOLD, textShadow: '0 2px 20px rgba(0,0,0,.9)' }}>Black Coffee · Gdańsk · 02.10.2026</div>
          <div style={{ fontFamily: FONT, fontSize: 150, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase', fontStretch: '78%', textAlign: 'center', textShadow: '0 6px 60px rgba(0,0,0,.8)' }}>Everyone will talk<br />about it tomorrow.</div>
          <div style={{ marginTop: 10, padding: '26px 56px', background: GOLD, color: INK, fontFamily: FONT, fontSize: 28, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Be there tonight · Bilety: eBilet</div>
        </div>
      </Shot>

      <div style={{ position: 'absolute', inset: 40, border: '1px solid rgba(242,238,231,0.14)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 3px)', backgroundPosition: `0 ${grainShift}px` }} />
    </div>
  );
}

function Teaser() {
  return (
    <CompositionStage width={1920} height={1080} bg={INK} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
      <Piece />
    </CompositionStage>
  );
}
window.BCTeaser = Teaser;
