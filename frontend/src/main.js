import './features/verification/result.css';
import './style.css';
import './shared/ui/feedback.css';
import { verificationView } from './features/verification/view';
import { initVerification } from './features/verification/controller';

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-logo" aria-hidden="true"><span>VD</span></div>
        <div class="brand-title">
          <strong>Verification Desk</strong><small>Desktop demo</small>
        </div>
      </div>
      <span class="environment"><span class="environment-dot"></span> Modo demo</span>
    </header>
    <section class="hero">
      <div class="hero-inner">
        <span class="eyebrow">EJERCICIO DEMOSTRATIVO</span>
        <h1>Consulta de códigos ficticios</h1>
        <p>Una experiencia sencilla para usuarios no técnicos.</p>
      </div>
      <div class="hero-decoration"></div>
    </section>
    <main class="content">${verificationView()}</main>
    <footer><span>Verification Desk</span><span>Datos sintéticos · Sin servicios reales</span></footer>
  </div>
`;
initVerification();
