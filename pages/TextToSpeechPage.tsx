import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Volume2, Globe, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { clsx } from 'clsx';

interface TextToSpeechPageProps {
  onBack: () => void;
}

const TextToSpeechPage: React.FC<TextToSpeechPageProps> = ({ onBack }) => {
  const { activeSystem } = useTheme();
  const isIOS = activeSystem === 'ios';

  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  const [selectedLang, setSelectedLang] = useState('ko-KR');
  const [selectedGender, setSelectedGender] = useState('female');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const femaleKeywords = ['female', 'woman', 'girl', '여성', '女性'];
  const maleKeywords = ['male', 'man', 'boy', '남성', '男性'];

  const filteredVoices = useMemo(() => {
    const langFiltered = voices.filter(voice => voice.lang === selectedLang);
    if (langFiltered.length === 0) return [];

    const genderFiltered = langFiltered.filter(voice => {
      const nameLower = voice.name.toLowerCase();
      const keywords = selectedGender === 'female' ? femaleKeywords : maleKeywords;
      return keywords.some(kw => nameLower.includes(kw));
    });

    const voicesToShow = genderFiltered.length > 0 ? genderFiltered : langFiltered;

    return voicesToShow.slice(0, 5); // Show top 5 instead of 2 for more options
  }, [voices, selectedLang, selectedGender, femaleKeywords, maleKeywords]);

  useEffect(() => {
    if (filteredVoices.length > 0) {
      if (!filteredVoices.find(v => v.name === selectedVoiceName)) {
        setSelectedVoiceName(filteredVoices[0].name);
      }
    } else {
      setSelectedVoiceName('');
    }
  }, [filteredVoices, selectedVoiceName]);


  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (text.trim() === '' || !selectedVoiceName) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.name === selectedVoiceName);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={clsx("flex flex-col h-full", isIOS ? "bg-gray-50/50" : "bg-white")}>
      {/* Header */}
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
          텍스트 → 음성
        </span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* Helper Badge */}
        <div className="flex justify-center">
          <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            AI Voice Generation
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하면 음성으로 읽어드립니다..."
          className={clsx(
            "w-full h-48 p-5 text-base leading-relaxed rounded-2xl resize-none transition-all outline-none",
            isIOS
              ? "bg-white border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm"
              : "bg-gray-50 border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          )}
        />

        {/* Settings Card */}
        <div className={clsx(
          "p-5 rounded-2xl space-y-4",
          isIOS ? "bg-white shadow-sm border border-gray-100" : "bg-surface-variant border border-gray-200"
        )}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="mr-1.5 text-gray-400" />
                언어
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="ko-KR">한국어</option>
                <option value="ja-JP">日本語</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="mr-1.5 text-gray-400" />
                성별
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="female">여성</option>
                <option value="male">남성</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">목소리 선택</label>
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
              disabled={filteredVoices.length === 0}
            >
              {filteredVoices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
            {filteredVoices.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                해당 언어/성별의 목소리가 이 기기에 없습니다.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Floating Action Buffer */}
      <div className="p-4 bg-transparent">
        <button
          onClick={handleSpeak}
          disabled={!text.trim() || !selectedVoiceName}
          className={clsx(
            "w-full flex items-center justify-center py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-all",
            isSpeaking
              ? "bg-red-500 animate-pulse shadow-red-200"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          )}
        >
          <Volume2 size={24} className={clsx("mr-2", isSpeaking && "animate-bounce")} />
          {isSpeaking ? '멈추기' : '읽어주기'}
        </button>
      </div>
    </div>
  );
};

export default TextToSpeechPage;