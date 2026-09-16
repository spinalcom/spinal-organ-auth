const POPUP_EVENT_NAME = "app:show-popup";
const CONFIRM_EVENT_NAME = "app:show-confirm";

export function showPopup(message, options = {}) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent(POPUP_EVENT_NAME, {
            detail: {
                message,
                color: options.color || "error",
                timeout: options.timeout || 4000,
            },
        })
    );
}

export function askConfirmation(message, options = {}) {
    if (typeof window === "undefined") return Promise.resolve(false);

    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent(CONFIRM_EVENT_NAME, {
                detail: {
                    message,
                    title: options.title || "Confirmation",
                    confirmText: options.confirmText || "Confirmer",
                    cancelText: options.cancelText || "Annuler",
                    resolve,
                },
            })
        );
    });
}

export { POPUP_EVENT_NAME, CONFIRM_EVENT_NAME };
