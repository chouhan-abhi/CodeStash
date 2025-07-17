import React, { useContext, useState } from 'react';
import './AppLayout.css';
import { AppContext } from '../../App';
import CodeEditor from '../CodeEditor/CodeEditor';
import ConsoleOutput from '../OutputViewer/OutputViewer';
import CodeRunner from '../CodeEditor/CodeRunner';

const AppLayout = () => {
    const { appState, updateAppState } = useContext(AppContext);
    const { tabs, activeTabId } = appState;

    const activeTab = tabs[activeTabId];
    const [execTime, setExecTime] = useState(null);

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

    if (!activeTab) {
        return <div className="empty-state">No tab selected</div>;
    }

    return (
        <div className="app-layout">
            <div className="editor-panel">
                <CodeEditor />
            </div>

            <div className="output-panel">
                <div className="output-header">
                    <button className="clear-output-btn " onClick={clearOutput}>
                        Clear Output
                    </button>
                    <CodeRunner />{/*  */}
                </div>
                <ConsoleOutput />
            </div>
        </div>
    );
};

export default AppLayout;
