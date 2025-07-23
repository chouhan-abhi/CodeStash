import React, { useContext, useState, useEffect } from 'react';
import './AppLayout.css';
import CodeEditor from '../CodeEditor/CodeEditor';
import ConsoleOutput from '../OutputViewer/OutputViewer';
import CodeRunner from '../CodeEditor/CodeRunner';
import { AppContext } from '../../App';
import { PencilLine, Loader } from 'lucide-react';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <div className="output-panel">
                <Description />
                <h3>Console</h3>
                <ConsoleOutput />
                <CodeRunner />
            </div>
            <div className="editor-panel">
                <CodeEditor />
            </div>
        </div>
    );
};

const Description = () => {
    const { appState, updateAppState } = useContext(AppContext);
    const { tabs, activeTabId } = appState;
    const activeTab = tabs[activeTabId];
    const initialDesc = activeTab?.description || '';

    const [desc, setDesc] = useState(initialDesc);
    const [status, setStatus] = useState('Saved');

    // Update local state when tab changes
    useEffect(() => {
        setDesc(activeTab?.description || '');
        setStatus('Saved');
    }, [activeTabId]);

    // Debounced auto-save effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateAppState(prev => ({
                ...prev,
                tabs: {
                    ...prev.tabs,
                    [activeTabId]: {
                        ...prev.tabs[activeTabId],
                        description: desc,
                    },
                },
            }));
            setStatus('Saved');
        }, 600);

        setStatus('isLoading');

        return () => clearTimeout(timeout);
    }, [desc, activeTabId, updateAppState]);

    return (
        <div className="description-panel">
            <div >
                <h3>{desc ? 'Note' : 'Add Note'}
                    {status === 'isLoading' ? <Loader size={16} /> : <PencilLine size={16} />}
                </h3>
            </div>

            <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Got a Note! Add it here."
            />
        </div>
    );
};

export default AppLayout;

