import React, { useContext } from 'react';
import { AppContext } from '../../App';
import '../AppLayout/AppLayout.css';
import { TicketX, ChevronRight } from 'lucide-react';

const ConsoleOutput = () => {
  const { appState } = useContext(AppContext);
  const { activeTabId, tabs } = appState;

  const activeTab = tabs[activeTabId];

  return (
    <div className="console-output">
      {activeTab?.logs?.length ? (
        activeTab.logs.map((entry, idx) => {
          const message =
            typeof entry.message === 'string'
              ? entry.message
              : JSON.stringify(entry.message, null, 2);
          return <div className={`log ${entry.type}`}> <ChevronRight color="#ff6b6b" size={14} /> {message}</div>;
        })
      ) : (
        <div className="empty-state">
          <TicketX size={72} />
          Nothing to print
        </div>
      )}
    </div>
  );
};

export default ConsoleOutput;
