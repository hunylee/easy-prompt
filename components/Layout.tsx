import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Page } from '../types';
import { Home, MessageSquare, Mic, Volume2, HelpCircle, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
    currentPage: Page;
    setPage: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setPage }) => {
    const { activeSystem } = useTheme();

    const isIOS = activeSystem === 'ios';

    return (
        <div className={clsx(
            "min-h-screen w-full flex flex-col",
            isIOS ? "bg-gray-50 text-black font-ios" : "bg-white text-gray-900 font-android"
        )}>
            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto pb-20">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className={clsx(
                "fixed bottom-0 left-0 right-0 border-t flex justify-around items-center z-50 transition-all duration-300",
                isIOS ? "h-[83px] bg-white/80 backdrop-blur-md border-gray-200 pb-5"
                    : "h-[80px] bg-white border-gray-100"
            )}>
                <NavButton
                    active={currentPage === Page.Home}
                    onClick={() => setPage(Page.Home)}
                    icon={<Home size={24} />}
                    label="홈"
                    isIOS={isIOS}
                />
                <NavButton
                    active={currentPage === Page.TextToSpeech}
                    onClick={() => setPage(Page.TextToSpeech)}
                    icon={<Volume2 size={24} />}
                    label="TTS"
                    isIOS={isIOS}
                />
                <NavButton
                    active={currentPage === Page.SpeechToText}
                    onClick={() => setPage(Page.SpeechToText)}
                    icon={<Mic size={24} />}
                    label="STT"
                    isIOS={isIOS}
                />
                <NavButton
                    active={currentPage === Page.EasyPrompt}
                    onClick={() => setPage(Page.EasyPrompt)}
                    icon={<MessageSquare size={24} />}
                    label="변환"
                    isIOS={isIOS}
                />
                <NavButton
                    active={currentPage === Page.Help}
                    onClick={() => setPage(Page.Help)}
                    icon={<HelpCircle size={24} />}
                    label="도움말"
                    isIOS={isIOS}
                />
            </nav>
        </div>
    );
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    isIOS: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, isIOS }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex flex-col items-center justify-center w-full h-full active:scale-95 transition-transform",
            active ? (isIOS ? "text-blue-500" : "text-purple-600") : "text-gray-400"
        )}
    >
        <div className={clsx(
            "mb-1 rounded-full px-4 py-1",
            active && !isIOS && "bg-purple-50"
        )}>
            {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);
