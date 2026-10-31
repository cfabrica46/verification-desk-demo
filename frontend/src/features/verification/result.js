
import {
    ClipboardSetText
} from '../../../wailsjs/runtime/runtime';

export function verificationResultTemplate() {
    return `
    <section id="verification-result"
      class="code-card"
      aria-label="Resultado de verificación"
      hidden>

      <div class="code-card-header">
        <span class="code-card-icon">✓</span>
        <div>
          <h3>Código de verificación</h3>
          <p>Resultado de la consulta</p>
        </div>
      </div>

      <div class="code-display">
        <span class="code-label">
          TU CÓDIGO DE VERIFICACIÓN
        </span>

        <strong id="verification-code" class="code-value">
          ------
        </strong>

        <button id="copy-code"
          type="button"
          class="copy-code-button">
          Copiar código
        </button>

        <p id="copy-status"
          class="copy-status"
          role="status"
          aria-live="polite"></p>
      </div>

      <p class="code-notice">
        Este código es ficticio y no autentica ninguna operación real.
      </p>
    </section>
  `;
}

export function initVerificationResult() {
    const container = document.querySelector(
        '#verification-result'
    );
    const codeElement = document.querySelector(
        '#verification-code'
    );
    const copyButton = document.querySelector('#copy-code');
    const copyStatus = document.querySelector('#copy-status');

    let currentCode = '';
    let version = 0;

    function hide() {
        version++;
        currentCode = '';
        container.hidden = true;
        codeElement.textContent = '------';
        copyStatus.textContent = '';
        copyButton.disabled = false;
        copyButton.textContent = 'Copiar código';
    }

    function show(code) {
        if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
            throw new Error('Formato de código no válido');
        }

        hide();

        currentCode = code;
        codeElement.textContent = code;
        container.hidden = false;
    }

    copyButton.addEventListener('click', async () => {
        if (!currentCode) return;

        const currentVersion = version;
        const codeToCopy = currentCode;

        copyButton.disabled = true;
        copyStatus.textContent = '';

        try {
            const copied = await ClipboardSetText(codeToCopy);

            if (!copied) {
                throw new Error('No se pudo copiar');
            }

            if (currentVersion !== version) return;

            copyButton.textContent = '✓ Copiado';
            copyStatus.textContent = 'Código copiado correctamente.';

        } catch {
            if (currentVersion !== version) return;

            copyStatus.textContent =
                'No se pudo copiar. Selecciona el código manualmente.';

        } finally {
            if (currentVersion === version) {
                copyButton.disabled = false;
            }
        }
    });

    return { show, hide };
}
