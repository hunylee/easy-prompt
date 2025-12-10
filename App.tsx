import React, { useState } from 'react';
import { Page } from './types';
import HomePage from './pages/HomePage';
import TextToSpeechPage from './pages/TextToSpeechPage';
import SpeechToTextPage from './pages/SpeechToTextPage';
import EasyPromptPage from './pages/EasyPromptPage';
import HelpPage from './pages/HelpPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.TextToSpeech:
        return <TextToSpeechPage onBack={() => setCurrentPage(Page.Home)} />;
      case Page.SpeechToText:
        return <SpeechToTextPage onBack={() => setCurrentPage(Page.Home)} />;
      case Page.EasyPrompt:
        return <EasyPromptPage onBack={() => setCurrentPage(Page.Home)} />;
      case Page.Help:
        return <HelpPage onBack={() => setCurrentPage(Page.Home)} />;
      case Page.Home:
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <Layout currentPage={currentPage} setPage={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}
