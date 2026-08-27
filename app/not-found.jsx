'use client';
export default function NotFound() {
  return (
    <main className="page" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', textAlign: 'center' }}>
      <p className="hud-txt gold">ERROR 404 · WRONG COORDINATE</p>
      <h1 className="giant md"><span>NOTHING</span><span className="shock">HERE.</span></h1>
      <p className="dist-sub">this part of the gift doesn&apos;t exist. or was never built. suspicious either way.</p>
      <a className="fbtn" href="/">BACK TO START →</a>
    </main>
  );
}
