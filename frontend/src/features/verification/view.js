import { feedbackTemplate } from '../../shared/ui/feedback';
import { verificationResultTemplate } from './result';

export function verificationView() {
    return `
    <section class="lookup-card">
      <div class="card-heading">
        <div class="heading-icon">
          <svg viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="10" width="16" height="11" rx="2"/>
            <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
            <path d="M12 14v3"/>
          </svg>
        </div>

        <div>
          <h2>Consultar código de demostración</h2>
          <p>Ingresa una referencia ficticia o su enlace de ejemplo.</p>
        </div>
      </div>

      <form id="verification-form">
        <label for="operation">
          Enlace o referencia de demostración
        </label>

        <div class="input-wrapper">
          <input
            id="operation"
            type="text"
            placeholder="Ejemplo: DEMO-1001"
            autocomplete="off"
            spellcheck="false"
            aria-describedby="input-help"
          />
        </div>

        <p id="input-help" class="help-text">
          Puedes introducir una referencia o pegar su URL ficticia.
          El resultado se obtiene sin conectarse a Internet.
        </p>

        <button
        id="clear-operation"
        type="button"
        class="clear-operation"
        hidden
        >
        Limpiar campo
        </button>

        <button id="search-button" type="submit" disabled>
          <span data-submit-text>Obtener código</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>

      ${feedbackTemplate()}
      ${verificationResultTemplate()}
    </section>

    <div class="assist">
      <span class="assist-icon">i</span>
      <p>
        Este es un ejercicio técnico independiente.
        No permite verificar pagos ni cuentas reales.
      </p>
    </div>
  `;
}