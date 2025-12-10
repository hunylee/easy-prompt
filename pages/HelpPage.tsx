import React from 'react';
import { ChevronLeft, Mic, Volume2, Sparkles, HelpCircle, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { clsx } from 'clsx';

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const { activeSystem } = useTheme();
  const isIOS = activeSystem === 'ios';

  return (
    <div className={clsx("flex flex-col h-full", isIOS ? "bg-gray-50/50" : "bg-white")}>
      <header className={clsx(
        "flex items-center px-4 py-3",
        isIOS ? "border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10" : "bg-white shadow-sm"
      )}>
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="flex-grow text-center font-bold text-lg text-gray-900">
          도움말 / 가이드
        </span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* Intro Card */}
        <div className={clsx(
          "p-6 rounded-2xl relative overflow-hidden",
          isIOS ? "bg-white shadow-sm border border-gray-100" : "bg-surface-variant"
        )}>
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-xl"></div>
          <h2 className="text-xl font-bold mb-3 relative z-10">Easy Prompt 사용 가이드</h2>
          <p className="text-gray-600 leading-relaxed relative z-10">
            Easy Prompt는 인공지능과 더 쉽게 소통할 수 있도록 돕는 서비스입니다.
            복잡한 기술 없이도 누구나 AI의 힘을 활용할 수 있습니다.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide px-2">주요 기능</h3>

          <HelpItem
            icon={<Volume2 className="text-blue-600" />}
            title="텍스트 → 음성 (TTS)"
            description="글자를 읽기 어려우신가요? 텍스트를 입력하면 자연스러운 목소리로 읽어드립니다."
            isIOS={isIOS}
          />
          <HelpItem
            icon={<Mic className="text-red-500" />}
            title="음성 → 텍스트 (STT)"
            description="키보드 입력이 힘드신가요? 마이크에 대고 말씀하시면 글로 변환해드립니다."
            isIOS={isIOS}
          />
          <HelpItem
            icon={<Sparkles className="text-yellow-500" />}
            title="쉬운 문장 변환"
            description="AI에게 무엇을 물어볼지 막막할 때, 간단한 문장만 입력해보세요. AI가 완벽한 질문으로 다듬어줍니다."
            isIOS={isIOS}
          />
        </div>

        {/* Support Section */}
        <div className="pt-4 pb-8">
          <div className="bg-gray-900 text-white rounded-2xl p-6 text-center">
            <HelpCircle className="mx-auto mb-3 text-gray-400" size={32} />
            <h3 className="font-bold text-lg mb-2">더 궁금한 점이 있으신가요?</h3>
            <p className="text-gray-400 mb-6 text-sm">
              언제든지 저희 지원팀에게 문의해주세요.
            </p>
            <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center hover:bg-gray-100 transition-colors">
              <Mail size={16} className="mr-2" />
              문의하기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

interface HelpItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isIOS: boolean;
}

const HelpItem: React.FC<HelpItemProps> = ({ icon, title, description, isIOS }) => (
  <div className={clsx(
    "p-4 rounded-xl flex items-start space-x-4 transition-all duration-300",
    isIOS ? "bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]" : "bg-white elevation-1 border border-transparent"
  )}>
    <div className="p-3 bg-gray-50 rounded-xl shrink-0">
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default HelpPage;
