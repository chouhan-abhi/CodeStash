// components/CodeEditor.jsx
import { useContext, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { AppContext } from '../../App';
import { ThemeContext } from '../../Providers/ThemeContext';

const CodeEditor = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);
  console.log(theme);

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
      theme={theme !== 'light' ? "vs-dark" : 'light'}
      onChange={(value) => handleChange(value)}
      options={{
        minimap: {
          enabled: appState.isMinmapEnabled,
        },
        fontSize: 14,
        cursorStyle: "block",
        wordWrap: "on",
      }}
    />
  );
};

export default CodeEditor;
