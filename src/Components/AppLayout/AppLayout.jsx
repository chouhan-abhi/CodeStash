import React, { useContext, useState } from 'react';
import './AppLayout.css';
import CodeEditor from '../CodeEditor/CodeEditor';
import ConsoleOutput from '../OutputViewer/OutputViewer';
import CodeRunner from '../CodeEditor/CodeRunner';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <div className="editor-panel">
                <CodeEditor />
            </div>

            <div className="output-panel">
                <CodeRunner />
                <ConsoleOutput />
            </div>
        </div>
    );
};

export default AppLayout;
