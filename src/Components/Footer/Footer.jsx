import React, { useEffect, useState } from 'react';
import { Github } from 'lucide-react';
import '../Header/Header.css';

const formatMB = (bytes) => (bytes / 1048576).toFixed(2); // bytes to MB

const Footer = () => {
    const [memoryStats, setMemoryStats] = useState({
        used: null,
        total: null,
        limit: null,
    });

    useEffect(() => {
        const updateMemory = () => {
            if (performance?.memory) {
                const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
                setMemoryStats({
                    used: formatMB(usedJSHeapSize),
                    total: formatMB(totalJSHeapSize),
                    limit: formatMB(jsHeapSizeLimit),
                });
            }
        };

        updateMemory(); // initial read
        const interval = setInterval(updateMemory, 5000); // update every 5s

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="footer">
            <div
                className="footer-content"
                onClick={() => window.open('https://github.com/chouhan-abhi', '_blank')}
                style={{ cursor: 'pointer' }}
            >

                {memoryStats.used ? (
                    <span>Memory: {memoryStats.used}MB</span>
                ) : null}
                <b>
                    <Github height={12} width={14} />
                    Dracket
                </b>
            </div>

        </footer>
    );
};

export default Footer;
