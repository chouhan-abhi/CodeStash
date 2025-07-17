// src/Components/AppLayout/ConsoleOutput.jsx
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import '../AppLayout/AppLayout.css'; // Assuming styles are in the same directory

const ConsoleOutput = () => {
  const { appState } = useContext(AppContext);
  const { activeTabId, tabs } = appState;

  const tab = tabs[activeTabId];
  const logs = tab?.logs || [];

  return (
    <div className="console-output">
      {logs.length === 0 && <pre>// Run code to see output here</pre>}
      {logs.map((log, index) => (
        <pre key={index}>{log}</pre>
      ))}
    </div>
  );
};

export default ConsoleOutput;
