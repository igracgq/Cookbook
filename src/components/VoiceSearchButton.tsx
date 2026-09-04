import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  buttonId?: string;
}

// Typing for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  className = '',
  buttonId = 'voice_search_btn'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setToastMessage('Listening... say a recipe or ingredient');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onTranscript(transcript);
          setToastMessage(`Heard: "${transcript}"`);
          setTimeout(() => setToastMessage(null), 2500);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setToastMessage('Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          setToastMessage('No speech detected. Please try again.');
        } else {
          setToastMessage('Voice recognition encountered an issue.');
        }
        setTimeout(() => setToastMessage(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize SpeechRecognition:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onTranscript]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      setToastMessage('Voice search is not supported in this browser. Please type to search.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      setToastMessage(null);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Error starting voice recognition:', err);
        setToastMessage('Could not start voice search. Tap again.');
        setTimeout(() => setToastMessage(null), 2500);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        id={buttonId}
        type="button"
        onClick={toggleListening}
        title={isListening ? 'Stop listening' : 'Voice Search (Speak recipe or ingredient)'}
        aria-label="Voice Search"
        className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
          isListening
            ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-300'
            : 'text-[#7D6C5A] hover:text-[#261D16] hover:bg-[#EBE3D6]'
        } ${className}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute top-full mt-2 right-0 z-50 whitespace-nowrap bg-[#261D16] text-[#FAF7F2] text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl border border-[#D2C4B1]/40 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-[#D4AF37]'}`} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
