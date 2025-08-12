/**
 * iStampit Embed Widget v1
 * Drop-in verification widget for third-party sites
 *
 * Usage:
 * <script src="https://istampit.io/widget/v1.js" async></script>
 * <div data-istampit-verify data-mode="inline" data-theme="light" data-src="https://istampit.io/verify?embed=1"></div>
 */

(function () {
  'use strict';

  const WIDGET_ATTR = 'data-istampit-verify';
  const DEFAULT_SRC = '/verify';

  function buildIframe(src, theme, origin) {
    const url = new URL(src, window.location.origin);
    url.searchParams.set('embed', '1');
    if (theme) url.searchParams.set('theme', theme);
    if (origin) url.searchParams.set('origin', origin);

    const iframe = document.createElement('iframe');
    iframe.src = url.toString();
    iframe.title = 'Verify with iStampit';
    iframe.allow = 'clipboard-read; clipboard-write';
    iframe.style.cssText = 'border:0;width:100%;min-height:420px;border-radius:8px;';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    iframe.dataset.istampit = 'frame';

    return iframe;
  }

  function mountInline(el) {
    const src = el.getAttribute('data-src') || DEFAULT_SRC;
    const theme = el.getAttribute('data-theme') || 'light';
    const origin = el.getAttribute('data-origin') || window.location.origin;

    const iframe = buildIframe(src, theme, origin);
    el.innerHTML = '';
    el.appendChild(iframe);

    // Add loading state
    el.style.position = 'relative';
    const loader = document.createElement('div');
    loader.innerHTML = '⏳ Loading verification widget...';
    loader.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#666;font-size:14px;';
    el.appendChild(loader);

    iframe.onload = () => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    };
  }

  function openModal(el) {
    const src = el.getAttribute('data-src') || DEFAULT_SRC;
    const theme = el.getAttribute('data-theme') || 'light';
    const origin = el.getAttribute('data-origin') || window.location.origin;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:rgba(0,0,0,0.6)',
      'z-index:99998',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'backdrop-filter:blur(2px)'
    ].join(';');

    overlay.addEventListener('click', closeModal);
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Create panel
    const panel = document.createElement('div');
    panel.style.cssText = [
      'position:relative',
      'width:min(900px,92vw)',
      'height:min(720px,86vh)',
      'background:white',
      'border-radius:12px',
      'box-shadow:0 20px 40px rgba(0,0,0,0.3)',
      'overflow:hidden',
      'display:flex',
      'flex-direction:column'
    ].join(';');

    panel.addEventListener('click', e => e.stopPropagation());

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = [
      'position:absolute',
      'right:12px',
      'top:8px',
      'width:32px',
      'height:32px',
      'font-size:24px',
      'line-height:1',
      'border:0',
      'background:rgba(0,0,0,0.1)',
      'border-radius:50%',
      'cursor:pointer',
      'z-index:1',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'color:#666'
    ].join(';');

    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(0,0,0,0.2)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(0,0,0,0.1)';
    });

    // Create iframe
    const iframe = buildIframe(src, theme, origin);
    iframe.style.height = '100%';
    iframe.style.flex = '1';

    function closeModal() {
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }
    }

    // Assemble modal
    panel.appendChild(closeBtn);
    panel.appendChild(iframe);
    overlay.appendChild(panel);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);

    // Focus management
    closeBtn.focus();
  }

  // Auto-mount all widget placeholders
  function init() {
    document.querySelectorAll('[' + WIDGET_ATTR + ']').forEach(el => {
      if (el.dataset.istampitMounted) return; // Prevent double-mounting
      el.dataset.istampitMounted = 'true';

      const mode = el.getAttribute('data-mode') || 'inline';

      if (mode === 'inline') {
        mountInline(el);
      } else if (mode === 'modal') {
        // Render default button if no content
        if (!el.querySelector('button')) {
          const btn = document.createElement('button');
          btn.textContent = 'Verify with iStampit';
          btn.style.cssText = [
            'padding:0.75rem 1.5rem',
            'background:#2563eb',
            'color:white',
            'border:0',
            'border-radius:6px',
            'font-weight:500',
            'cursor:pointer',
            'transition:background 0.2s'
          ].join(';');

          btn.addEventListener('mouseenter', () => {
            btn.style.background = '#1d4ed8';
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.background = '#2563eb';
          });

          el.appendChild(btn);
        }

        el.addEventListener('click', () => openModal(el));
      }
    });
  }

  // Handle messages from embedded iframes
  window.addEventListener('message', (ev) => {
    try {
      const data = ev.data || {};

      if (data.type === 'istampit:verify:result') {
        // Bubble as custom event for easy listening
        const evt = new CustomEvent('istampit-verified', {
          detail: {
            status: data.status,
            txid: data.txid,
            blockHeight: data.blockHeight,
            hash: data.hash
          }
        });
        window.dispatchEvent(evt);

      } else if (data.type === 'istampit:ui:height') {
        // Auto-resize iframe to content height
        document.querySelectorAll('iframe[data-istampit="frame"]').forEach(frame => {
          if (frame.contentWindow === ev.source && data.height) {
            const newHeight = Math.max(420, Number(data.height));
            frame.style.height = newHeight + 'px';
          }
        });
      }
    } catch (err) {
      console.warn('iStampit widget: Failed to process message', err);
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.iStampitVerify = {
    mount: init,
    version: 'v1.0.0',

    // Programmatic widget creation
    create: function(container, options = {}) {
      const el = typeof container === 'string'
        ? document.querySelector(container)
        : container;

      if (!el) {
        console.error('iStampit: Container not found');
        return;
      }

      el.setAttribute(WIDGET_ATTR, '');
      el.setAttribute('data-mode', options.mode || 'inline');
      el.setAttribute('data-theme', options.theme || 'light');
      if (options.src) el.setAttribute('data-src', options.src);

      init();
    }
  };

  console.log('iStampit Embed Widget v1.0.0 loaded');
})();
