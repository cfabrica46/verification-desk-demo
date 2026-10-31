
export function feedbackTemplate() {
    return `
    <div
      id="verification-feedback"
      class="result feedback"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      hidden
    >
      <div class="result-top">
        <span id="feedback-title" class="demo-tag"></span>
        <span id="feedback-icon" class="result-check"></span>
      </div>

      <p id="feedback-message" class="result-caption"></p>

      <div id="feedback-actions"
        class="feedback-actions" hidden>
        <button id="feedback-retry"
          class="feedback-retry" type="button">
          ↻ Volver a intentar
        </button>
      </div>
    </div>
  `;
}

const variants = {
    loading: { icon: '◌', label: 'Consultando' },
    success: { icon: '✓', label: 'Correcto' },
    error: { icon: '!', label: 'Error' },
    empty: { icon: 'i', label: 'Sin resultados' },
};

export function showFeedback(
    type,
    title,
    message,
    { retryable = false } = {}
) {
    const container = document.querySelector(
        '#verification-feedback'
    );

    const variant = variants[type] || variants.error;

    container.dataset.state = type;
    container.setAttribute(
        'role',
        type === 'error' ? 'alert' : 'status'
    );
    container.setAttribute(
        'aria-busy',
        String(type === 'loading')
    );

    document.querySelector('#feedback-title').textContent =
        title || variant.label;

    document.querySelector('#feedback-icon').textContent =
        variant.icon;

    document.querySelector('#feedback-message').textContent =
        message;

    document.querySelector('#feedback-actions').hidden =
        !retryable;

    container.hidden = false;
}

export function hideFeedback() {
    const container = document.querySelector(
        '#verification-feedback'
    );

    container.hidden = true;
    container.setAttribute('aria-busy', 'false');

    document.querySelector('#feedback-actions').hidden = true;
}
