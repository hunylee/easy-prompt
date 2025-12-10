import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mic, Sparkles, Copy, Check } from 'lucide-react';
import { generateEasyPrompt } from '../services/geminiService';
import { useTheme } from '../contexts/ThemeContext';
import { clsx } from 'clsx';

interface EasyPromptPageProps {
  onBack: () => void;
}

const EasyPromptPage: React.FC<EasyPromptPageProps> = ({ onBack }) => {
  const { activeSystem } = useTheme();
  const isIOS = activeSystem === 'ios';

  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // Don't log warning if not supported, just disable button logic
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript.trim();
          }
        }
        if (finalTranscript) {
          setUserInput(prev => (prev ? prev + ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error(`Speech recognition error: ${event.error}`);
        setError(`음성 인식 오류: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleConvert = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');

    // Smooth transition
    try {
      const result = await generateEasyPrompt(userInput);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setGeneratedPrompt(result);
      }
    } catch (e) {
      setError("An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={clsx(
      "flex flex-col h-full",
      isIOS ? "bg-gray-50/50" : "bg-white"
    )}>
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
          쉬운 문장 변환
        </span>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* Input Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
            입력 (Input)
          </label>
          <div className="relative group">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="예: 강아지가 우주에서 춤추는 그림 그려줘..."
              className={clsx(
                "w-full h-40 p-4 pr-12 text-base leading-relaxed rounded-2xl resize-none transition-all outline-none",
                isIOS
                  ? "bg-white border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm"
                  : "bg-gray-50 border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              )}
            />
            {/* Mic Button inside Textarea */}
            <button
              onClick={toggleListening}
              className={clsx(
                "absolute right-3 bottom-3 p-2 rounded-full transition-all shadow-sm",
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-red-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
              )}
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

        {/* Action Button (Centered) */}
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            disabled={isLoading || !userInput.trim()}
            className={clsx(
              "flex items-center space-x-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95",
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:-translate-y-0.5"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>변환 중...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} className="text-yellow-300" />
                <span>프롬프트 변환</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        {(generatedPrompt || error) && (
          <div className="space-y-3 pb-8 animate-fade-in-up">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                결과 (Result)
              </label>
              {generatedPrompt && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-xs font-medium text-blue-600 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? "복사됨" : "복사하기"}</span>
                </button>
              )}
            </div>

            <div className={clsx(
              "w-full min-h-[160px] p-5 rounded-2xl relative",
              error ? "bg-red-50 border border-red-200" : (isIOS ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100" : "bg-surface elevation-2 border border-blue-100")
            )}>
              {error ? (
                <p className="text-red-600 font-medium">{error}</p>
              ) : (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {generatedPrompt}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EasyPromptPage;
