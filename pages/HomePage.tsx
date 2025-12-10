import React from 'react';
import { Page } from '../types';
import FeatureCard from '../components/FeatureCard';
import { Mic, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { clsx } from 'clsx';

interface HomePageProps {
  setPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  const { activeSystem } = useTheme();
  const isIOS = activeSystem === 'ios';

  return (
    <div className={clsx(
      "flex flex-col h-full",
      isIOS ? "px-5 pt-8 bg-gray-50/50" : "px-4 pt-6 bg-gray-50"
    )}>
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className={clsx(
            "tracking-tight",
            isIOS ? "text-[34px] font-bold text-gray-900" : "text-3xl font-bold text-gray-800"
          )}>
            Easy Prompt
          </h1>
          {/* Avatar / Profile placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-md border-2 border-white"></div>
        </div>
        <p className={clsx(
          "text-lg",
          isIOS ? "text-gray-500 font-medium" : "text-gray-600"
        )}>
          무엇을 도와드릴까요?
        </p>
      </header>

      {/* Main Actions */}
      <div className="flex-grow space-y-2">
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wilder mb-3 ml-1">
            Core Features
          </p>
          <FeatureCard
            icon={<Sparkles />}
            label="쉬운 문장 변환"
            description="간단한 문장을 AI가 풍부하고 정확한 프롬프트로 변환해줍니다."
            onClick={() => setPage(Page.EasyPrompt)}
            variant="primary"
          />
        </div>

        <div className="grid gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wilder mt-4 mb-1 ml-1">
            Tools
          </p>
          <FeatureCard
            icon={<Volume2 />}
            label="텍스트 → 음성"
            description="텍스트를 자연스러운 음성으로 읽어줍니다."
            onClick={() => setPage(Page.TextToSpeech)}
          />
          <FeatureCard
            icon={<Mic />}
            label="음성 → 텍스트"
            description="음성을 인식하여 텍스트로 변환합니다."
            onClick={() => setPage(Page.SpeechToText)}
          />
        </div>

        <div className="mt-6">
          <FeatureCard
            icon={<HelpCircle />}
            label="도움말 / 가이드"
            description="앱 사용법과 유용한 팁을 확인하세요."
            onClick={() => setPage(Page.Help)}
          />
        </div>
      </div>

      {/* Bottom Spacer is handled by Layout padding */}
    </div>
  );
};

export default HomePage;
