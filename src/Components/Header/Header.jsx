import React, { useContext, useState } from 'react';
import './Header.css';
import { CirclePlus, CircleX, Settings } from 'lucide-react';
import { AppContext } from '../../App';
import { ThemeContext } from '../../Providers/ThemeContext';

const availableFonts = ['Monospace', 'Fira Code', 'JetBrains Mono', 'Courier New'];

const Header = () => {
    const { appState, updateAppState } = useContext(AppContext);
    const { theme, updateTheme } = useContext(ThemeContext);

    const { tabs, activeTabId, font = 'Monospace' } = appState;
    const [showSettings, setShowSettings] = useState(false);

    const handleAddTab = () => {
        const id = `tab-${Date.now()}`;
        const newTab = {
            id,
            name: `Tab ${Object.keys(tabs).length + 1}`,
            code: ''
        };
        updateAppState(prev => ({
            ...prev,
            tabs: { ...prev.tabs, [id]: newTab },
            activeTabId: id
        }));
    };

    const handleRemoveTab = (tabId) => {
        updateAppState(prev => {
            const { [tabId]: _, ...remaining } = prev.tabs;
            const remainingIds = Object.keys(remaining);
            const newActiveId = prev.activeTabId === tabId ? remainingIds[0] || null : prev.activeTabId;
            return {
                ...prev,
                tabs: remaining,
                activeTabId: newActiveId
            };
        });
    };

    const handleTabClick = (tabId) => {
        updateAppState(prev => ({
            ...prev,
            activeTabId: tabId
        }));
    };

    const handleFontChange = (e) => {
        const selectedFont = e.target.value;
        updateAppState(prev => ({
            ...prev,
            font: selectedFont
        }));
    };

    const handleClearAppData = () => {
        if (window.confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="header">
            <div className="header-left">
                <span className="header-title">CodeStash</span>
                <div className="tab-container">
                    <ul>
                        {tabs && Object.values(tabs).map((tab) => (
                            <li
                                key={tab.id}
                                className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.name}
                                <button
                                    className="remove-tab-btn"
                                    aria-label={`Close ${tab.name}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveTab(tab.id);
                                    }}
                                >
                                    <CircleX width={14} />
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                className="add-tab-btn"
                                aria-label="Add Tab"
                                onClick={handleAddTab}
                            >
                                <CirclePlus width={16} />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="header-right">
                <button
                    className="settings-btn"
                    aria-label="Settings"
                    onClick={() => setShowSettings(prev => !prev)}
                >
                    <Settings width={16} />
                </button>

                {showSettings && (
                    <div className="settings-card">
                        <h4>Theme</h4>
                        <select
                            value={theme}
                            onChange={(e) => updateTheme(e.target.value)}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>

                        <h4>Editor Font</h4>
                        <select
                            value={font}
                            onChange={handleFontChange}
                        >
                            {availableFonts.map((fontOption) => (
                                <option key={fontOption} value={fontOption}>
                                    {fontOption}
                                </option>
                            ))}
                        </select>

                        <hr />

                        <button
                            className="clear-app-btn"
                            onClick={handleClearAppData}
                        >
                            Clear App Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
