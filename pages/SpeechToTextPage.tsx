import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, RefreshCw, Languages } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { clsx } from 'clsx';

interface SpeechToTextPageProps {
  onBack: () => void;
}

const SpeechToTextPage: React.FC<SpeechToTextPageProps> = ({ onBack }) => {
  const { activeSystem } = useTheme();
  const isIOS = activeSystem === 'ios';

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [lang, setLang] = useState('ko-KR');
  const finalTranscriptRef = useRef('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = lang; // initial
    } else {
      setError('음성 인식이 지원되지 않는 브라우저입니다.');
    }
  }, []); // Only init once, we update lang separately

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const handleResult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    const handleError = (event: any) => {
      // Ignore 'no-speech' error to keep UI clean, but handle others
      if (event.error !== 'no-speech') {
        setError(`오류 발생: ${event.error}`);
        setIsListening(false);
      }
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);

    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', handleEnd);
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Clear previous and start new
      finalTranscriptRef.current = '';
      setTranscript('');
      setError('');
      recognitionRef.current.lang = lang;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setError('마이크 권한을 확인해주세요.');
        setIsListening(false);
      }
    }
  };

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
          음성 → 텍스트
        </span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 px-4 py-6 flex flex-col space-y-4 overflow-hidden">

        {/* Language Selector */}
        <div className="flex justify-center mb-2">
          <div className="bg-white rounded-full p-1 pl-4 pr-1 shadow-sm border border-gray-200 flex items-center">
            <Languages size={16} className="text-gray-400 mr-2" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              disabled={isListening}
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none mr-2 disabled:text-gray-400"
            >
              <option value="ko-KR">한국어</option>
              <option value="ja-JP">日本語</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
        </div>

        {/* Display Area */}
        <div className={clsx(
          "flex-grow w-full p-6 rounded-3xl overflow-y-auto relative transition-colors duration-500",
          isIOS
            ? "bg-white shadow-sm border border-gray-100"
            : "bg-surface elevation-1 border border-indigo-50",
          isListening && "border-indigo-300 ring-4 ring-indigo-50/50"
        )}>
          {transcript ? (
            <p className="text-xl leading-loose font-medium text-gray-800 whitespace-pre-wrap animate-fade-in">
              {transcript}
            </p>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <Mic size={48} className="mb-4" strokeWidth={1.5} />
              <p>버튼을 누르고 말씀을 시작하세요</p>
            </div>
          )}

          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}
        </div>
      </div>

      {/* Control Area */}
      <div className="p-6 bg-transparent flex justify-center pb-8">
        <button
          onClick={toggleListening}
          className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse ring-8 ring-red-100"
              : "bg-gradient-to-tr from-indigo-500 to-purple-600 ring-8 ring-indigo-50 hover:scale-105"
          )}
        >
          {isListening ? (
            <RefreshCw size={32} className="text-white animate-spin-slow" />
          ) : (
            <Mic size={32} className="text-white" />
          )}
        </button>
      </div>

    </div>
  );
};

export default SpeechToTextPage;
