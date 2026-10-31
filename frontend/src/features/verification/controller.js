
import {
    GetVerificationCode
} from '../../../wailsjs/go/main/App';

import {
    showFeedback,
    hideFeedback
} from '../../shared/ui/feedback';

import { initVerificationResult } from './result';
import { presentVerification } from './presentation.mjs';

export function initVerification() {
    const input = document.querySelector('#operation');
    const form = document.querySelector('#verification-form');
    const button = document.querySelector('#search-button');
    const buttonText = button.querySelector('[data-submit-text]');
    const retryButton = document.querySelector('#feedback-retry');
    const clearButton = document.querySelector('#clear-operation');

    const result = initVerificationResult();

    let requestId = 0;

    function setLoading(loading) {
        button.disabled = loading || !input.value.trim();
        buttonText.textContent = loading
            ? 'Consultando...'
            : 'Obtener código';

        retryButton.disabled = loading;
    }

    function reset() {
        requestId++;
        setLoading(false);
        hideFeedback();
        result.hide();

        clearButton.hidden = !input.value.trim();
    }

    input.addEventListener('input', reset);

    clearButton.addEventListener('click', () => {
        input.value = '';
        reset();
        input.focus();
    });

    async function consult() {
        const value = input.value.trim();
        if (!value) return;

        const currentRequest = ++requestId;

        setLoading(true);
        result.hide();

        showFeedback(
            'loading',
            'Consultando referencia',
            'Consultando datos sintéticos locales.'
        );

        try {
            const response = await GetVerificationCode(value);

            // No mostrar respuestas de consultas anteriores.
            if (currentRequest !== requestId) return;

            const presentation = presentVerification(response);

            if (presentation.code) {
                result.show(presentation.code);
            }

            showFeedback(
                presentation.type,
                presentation.title,
                presentation.message,
                { retryable: presentation.retryable }
            );

        } catch {
            if (currentRequest !== requestId) return;

            result.hide();

            showFeedback(
                'error',
                'Ocurrió un problema inesperado',
                'No pudimos completar la consulta. ' +
                'Inténtalo nuevamente.',
                { retryable: true }
            );

        } finally {
            if (currentRequest === requestId) {
                setLoading(false);
            }
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        consult();
    });

    retryButton.addEventListener('click', consult);
}
