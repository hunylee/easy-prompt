import React from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../contexts/ThemeContext';

interface FeatureCardProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, label, description, onClick, variant = 'secondary' }) => {
    const { activeSystem } = useTheme();
    const isIOS = activeSystem === 'ios';

    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full text-left group relative overflow-hidden transition-all duration-300",
                isIOS
                    ? "bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] active:scale-98 active:bg-gray-50 mb-4"
                    : "bg-surface rounded-2xl p-4 shadow-sm elevation-1 active:bg-surface-variant mb-3 border border-gray-100",
                variant === 'primary' && isIOS && "ring-2 ring-blue-100 bg-blue-50/30"
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className={clsx(
                        "p-3 rounded-2xl flex items-center justify-center transition-colors",
                        isIOS ? "bg-gray-50 text-blue-600" : "bg-purple-100 text-purple-700",
                        variant === 'primary' && (isIOS ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-purple-600 text-white")
                    )}>
                        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
                    </div>
                    <div className="flex-1">
                        <h3 className={clsx(
                            "font-bold text-lg mb-1",
                            isIOS ? "text-gray-900" : "text-gray-800"
                        )}>
                            {label}
                        </h3>
                        <p className={clsx(
                            "text-sm leading-relaxed",
                            isIOS ? "text-gray-500" : "text-gray-600"
                        )}>
                            {description}
                        </p>
                    </div>
                </div>
                <div className={clsx(
                    "text-gray-300 group-hover:text-gray-400 transition-colors self-center",
                    isIOS ? "opacity-100" : "opacity-0"
                )}>
                    <ChevronRight size={20} />
                </div>
            </div>
        </button>
    );
};

export default FeatureCard;
