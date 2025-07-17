// components/CodeEditor.jsx
import { useContext, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { AppContext } from '../../App';

const CodeEditor = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const { activeTabId, tabs } = appState;
  const tab = tabs[activeTabId];

  const handleChange = updatedCode => {
    updateAppState(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [activeTabId]: {
          ...prev.tabs[activeTabId],
          code: updatedCode
        }
      }
    }));
  };

  return (
    <Editor
      height="100%"
      language="javascript"
      value={tab?.code}
      theme="vs-dark"
      onChange={(value) => handleChange(value)}
    />
  );
};

export default CodeEditor;
