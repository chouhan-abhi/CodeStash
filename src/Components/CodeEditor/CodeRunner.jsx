import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import '../AppLayout/AppLayout.css';

const CodeRunner = () => {
  const iframeRef = useRef(null);
  const { appState, updateAppState } = useContext(AppContext);
  const { tabs, activeTabId } = appState;
  const [execTime, setExecTime] = useState(null);

  const code = tabs?.[activeTabId]?.code || '';

  const runCodeInIframe = () => {
    const sandboxHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            (function() {
              const logs = [];
              const originalLog = console.log;
              console.log = function(...args) {
                logs.push(args.join(' '));
                originalLog.apply(console, args);
              };

              window.onerror = function(message, source, lineno, colno, error) {
                logs.push("Error: " + message);
                sendLogs();
              };

              function sendLogs(execTime) {
                parent.postMessage({ source: 'iframe-console-log', logs, execTime }, '*');
              }

              const start = performance.now();
              try {
                ${code}
                const end = performance.now();
                sendLogs(end - start);
              } catch (err) {
                const end = performance.now();
                logs.push("Error: " + err.message);
                sendLogs(end - start);
              }
            })();
          </script>
        </head>
        <body></body>
      </html>
    `;

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.srcdoc = sandboxHtml;
      setExecTime(null); // reset exec time on new run
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.data.source === 'iframe-console-log') {
        updateAppState((prev) => ({
          ...prev,
          tabs: {
            ...prev.tabs,
            [activeTabId]: {
              ...prev.tabs[activeTabId],
              logs: event.data.logs,
            },
          },
        }));
        setExecTime(event.data.execTime?.toFixed(2) || null);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [activeTabId, updateAppState]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button onClick={runCodeInIframe} className="run-btn">
        Run ▶
      </button>
      {execTime !== null && (
        <span style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
          Execution time: {execTime} ms
        </span>
      )}
      <iframe
        ref={iframeRef}
        title="sandbox"
        sandbox="allow-scripts"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CodeRunner;
