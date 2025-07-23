import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import '../AppLayout/AppLayout.css';
import { Play, Trash } from 'lucide-react';

const CodeRunner = () => {
  const iframeRef = useRef(null);
  const { appState, updateAppState } = useContext(AppContext);
  const { tabs, activeTabId } = appState;
  const [execTime, setExecTime] = useState(null);

  const code = tabs?.[activeTabId]?.code || '';
  const activeTab = tabs[activeTabId];

  const runCodeInIframe = () => {
    const escapedCode = code.replace(/<\/script>/g, '<\\/script>'); // Prevent script tag breaking

    const sandboxHtml = `
<!DOCTYPE html>
<html>
  <head>
    <script>
      (function () {
        const logs = [];
        const originalLog = console.log;
        const originalError = console.error;

        // Custom stringify function
        function stringifyArg(arg) {
          if (arg instanceof Error) {
            return arg.name + ": " + arg.message + "\\n" + arg.stack;
          }
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return "[Unserializable object]";
            }
          }
          return String(arg);
        }

        console.log = function (...args) {
          const message = args.map(stringifyArg).join(' ');
          logs.push({ type: 'log', message });
          originalLog.apply(console, args);
        };

        console.error = function (...args) {
          const message = args.map(stringifyArg).join(' ');
          logs.push({ type: 'error', message });
          originalError.apply(console, args);
        };

        window.onerror = function (message, source, lineno, colno, error) {
          const errorMessage = error && error.stack
            ? error.stack
            : "Uncaught: " + message + " at " + source + ":" + lineno + ":" + colno;

          logs.push({ type: 'error', message: errorMessage });
          sendLogs(performance.now() - start);
          return true;
        };

        function sendLogs(execTime) {
          parent.postMessage({ source: 'iframe-console-log', logs, execTime }, '*');
        }

        const start = performance.now();
        try {
          new Function(\`${escapedCode}\`)();
          const end = performance.now();
          sendLogs(end - start);
        } catch (err) {
          const end = performance.now();
          logs.push({
            type: 'error',
            message: err.stack || ("Caught: " + err.message),
          });
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
      setExecTime(null); // reset time
    }
  };


  useEffect(() => {
    const listener = (event) => {
      if (event.data?.source === 'iframe-console-log') {
        updateAppState((prev) => ({
          ...prev,
          tabs: {
            ...prev.tabs,
            [activeTabId]: {
              ...prev.tabs[activeTabId],
              logs: event.data.logs || [],
            },
          },
        }));
        setExecTime(event.data.execTime?.toFixed(2) || null);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [activeTabId, updateAppState]);

  const clearOutput = () => {
    if (!activeTab) return;
    updateAppState(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [activeTabId]: {
          ...prev.tabs[activeTabId],
          logs: [],
        },
      },
    }));
    setExecTime(null);
  };

  return (
    <div>
      <div className='output-toolbar-container'>
        <div className='toolbar-actions'>
          {execTime !== null && (
            <span className='output-btn time-keeper'>
              {execTime} ms
            </span>
          )}
          <button onClick={runCodeInIframe} className="output-btn" title='Execute code written in code editor'>
            Run <Play height={12} width={12} strokeWidth={3} />
          </button>
          <button className="output-btn" onClick={clearOutput} title="Clear console">
            Clear <Trash height={12} width={14} strokeWidth={3} />
          </button>
        </div>
      </div>


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
