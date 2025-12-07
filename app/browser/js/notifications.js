import $ from 'jquery';

/**
 * Simple toast notification system (replaces ohSnap)
 * Provides modern, accessible toast notifications
 * @class ToastNotification
 */
export class ToastNotification {
  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('info', 'success', 'error')
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  static show(message, type = 'info', duration = 3000) {
    // Ensure messages container exists
    if ($('#messages').length === 0) {
      $('body').append('<div id="messages" role="region" aria-live="polite" aria-atomic="true"></div>');
    }

    const toast = $(`
      <div class="toast-notification toast-${type}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-message">${message}</div>
      </div>
    `);

    $('#messages').append(toast);

    // Trigger animation
    setTimeout(() => toast.addClass('show'), 10);

    // Auto-dismiss
    setTimeout(() => {
      toast.removeClass('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }

  /**
   * Show success notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds
   */
  static success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  /**
   * Show error notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds
   */
  static error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  /**
   * Show info notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds
   */
  static info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

