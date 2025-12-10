import React, { createContext, useContext, useState, useEffect } from 'react';

type DesignSystem = 'ios' | 'android' | 'auto';

interface ThemeContextType {
    system: DesignSystem;
    setSystem: (system: DesignSystem) => void;
    activeSystem: 'ios' | 'android'; // The resolved system
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [system, setSystem] = useState<DesignSystem>('auto');
    const [activeSystem, setActiveSystem] = useState<'ios' | 'android'>('android');

    useEffect(() => {
        if (system === 'auto') {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            setActiveSystem(isIOS ? 'ios' : 'android');
        } else {
            setActiveSystem(system);
        }
    }, [system]);

    return (
        <ThemeContext.Provider value={{ system, setSystem, activeSystem }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
