(function () {
  'use strict';

  function showFatalError(error) {
    var existing = document.getElementById('dc-runtime-error');
    if (existing) existing.remove();

    var panel = document.createElement('div');
    panel.id = 'dc-runtime-error';
    panel.style.cssText = [
      'max-width:760px',
      'margin:40px auto',
      'padding:24px',
      'border:1px solid rgba(239,68,68,.65)',
      'border-radius:14px',
      'background:#11131a',
      'color:#fff',
      'font:14px/1.55 Arial,sans-serif',
      'box-shadow:0 18px 60px rgba(0,0,0,.55)'
    ].join(';');

    var title = document.createElement('div');
    title.textContent = 'Fantasy MMadness prototype could not start';
    title.style.cssText = 'font-size:20px;font-weight:800;color:#ef4444;margin-bottom:10px';

    var message = document.createElement('pre');
    message.textContent = error && (error.stack || error.message) ? (error.stack || error.message) : String(error);
    message.style.cssText = 'margin:0;white-space:pre-wrap;word-break:break-word;color:#f5c2c7';

    panel.appendChild(title);
    panel.appendChild(message);
    document.body.appendChild(panel);
  }

  function installPreviewStyles() {
    var style = document.createElement('style');
    style.textContent = [
      'html,body{min-height:100%;}',
      'body{overflow:auto;background:radial-gradient(circle at 50% 5%,#181b26 0,#090a0f 38%,#05060a 75%);}',
      'x-dc{display:none!important;}',
      '#dc-preview-stage{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:24px;}',
      '#dc-preview-shell{position:relative;width:393px;height:852px;flex:0 0 393px;overflow:hidden;background:#05060a;border-radius:44px;border:8px solid #17181d;box-shadow:0 30px 90px rgba(0,0,0,.72),0 0 0 1px rgba(255,255,255,.08);}',
      '#dc-preview-root{width:100%;height:100%;overflow:hidden;background:#05060a;}',
      '#dc-device-island{position:absolute;z-index:1000;top:10px;left:50%;transform:translateX(-50%);width:116px;height:30px;border-radius:999px;background:#020204;box-shadow:inset 0 0 0 1px rgba(255,255,255,.035);pointer-events:none;}',
      '@media(max-width:440px){#dc-preview-stage{padding:0;justify-content:flex-start;}#dc-preview-shell{width:100vw;min-width:100vw;flex-basis:100vw;border:0;border-radius:0;box-shadow:none;}#dc-device-island{top:8px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function start() {
    try {
      if (!window.React || !window.ReactDOM) {
        throw new Error('Local React runtime files are missing or failed to load.');
      }

      // The bundled local React build is intentionally small. This shim provides
      // the only newer API used by the exported prototype.
      if (!window.React.Fragment) {
        window.React.Fragment = function FragmentShim(props) {
          return props.children || null;
        };
      }

      class DCLogic extends window.React.Component {
        render() {
          if (typeof this.renderVals !== 'function') return null;
          var values = this.renderVals();
          return values && Object.prototype.hasOwnProperty.call(values, 'screen')
            ? values.screen
            : values;
        }
      }
      window.DCLogic = DCLogic;

      var sourceNode = document.querySelector('script[data-dc-script]');
      if (!sourceNode) throw new Error('Prototype component source was not found.');

      var source = sourceNode.textContent || '';
      var Component = new Function(
        'React',
        'DCLogic',
        source + '\nreturn Component;'
      )(window.React, DCLogic);

      var props = {};
      var propsRaw = sourceNode.getAttribute('data-props');
      if (propsRaw) {
        try { props = JSON.parse(propsRaw); } catch (_) { props = {}; }
      }

      installPreviewStyles();

      var stage = document.createElement('main');
      stage.id = 'dc-preview-stage';

      var shell = document.createElement('section');
      shell.id = 'dc-preview-shell';
      shell.setAttribute('aria-label', 'Fantasy MMadness mobile app prototype');

      var root = document.createElement('div');
      root.id = 'dc-preview-root';

      var island = document.createElement('div');
      island.id = 'dc-device-island';
      island.setAttribute('aria-hidden', 'true');

      shell.appendChild(root);
      shell.appendChild(island);
      stage.appendChild(shell);
      document.body.appendChild(stage);

      window.ReactDOM.render(window.React.createElement(Component, props), root);
    } catch (error) {
      console.error('[Fantasy MMadness runtime]', error);
      showFatalError(error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
