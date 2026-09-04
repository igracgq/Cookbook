import React from 'react';
import { useCookbook } from '../context/CookbookContext';
import { BellRing, Play, Pause, X, Timer as TimerIcon } from 'lucide-react';

export const GlobalTimerBar: React.FC = () => {
  const {
    timerSecondsRemaining,
    isTimerRunning,
    timerLabel,
    isTimerAlertTriggered,
    pauseResumeTimer,
    resetTimer,
    dismissTimerAlert
  } = useCookbook();

  if (timerSecondsRemaining <= 0 && !isTimerAlertTriggered) {
    return null;
  }

  const mins = Math.floor(timerSecondsRemaining / 60);
  const secs = timerSecondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      id="global_timer_bar"
      className={`fixed bottom-[calc(3.5rem+max(0.6rem,env(safe-area-inset-bottom)))] sm:bottom-0 inset-x-0 z-40 px-4 py-2.5 shadow-lg border-t transition-colors duration-200 ${
        isTimerAlertTriggered
          ? 'bg-[#DECFC0] border-[#B8452D] text-[#201710] animate-pulse'
          : 'bg-[#EBE3D6] border-[#D2C4B1] text-[#261D16]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-1.5 rounded-full ${
              isTimerAlertTriggered ? 'bg-[#B8452D] text-white' : 'bg-[#DECFC0] text-[#4A3B2C]'
            }`}
          >
            {isTimerAlertTriggered ? <BellRing className="w-5 h-5 animate-bounce" /> : <TimerIcon className="w-5 h-5" />}
          </div>
          <div className="truncate">
            <p className="text-xs sm:text-sm font-semibold truncate leading-tight">
              {isTimerAlertTriggered ? '⏰ Timer Finished!' : timerLabel}
            </p>
            {!isTimerAlertTriggered && (
              <p className="text-xs font-mono font-medium text-[#7D6C5A]">{formattedTime} remaining</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isTimerAlertTriggered ? (
            <button
              id="dismiss_timer_btn"
              onClick={dismissTimerAlert}
              className="px-3 py-1 bg-[#4A3B2C] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#382B1E] transition-colors"
            >
              Dismiss
            </button>
          ) : (
            <>
              <button
                id="toggle_timer_btn"
                onClick={pauseResumeTimer}
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                className="p-1.5 rounded-lg bg-[#DECFC0] text-[#4A3B2C] hover:bg-[#D2C4B1] transition-colors"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                id="cancel_timer_btn"
                onClick={resetTimer}
                title="Cancel timer"
                className="p-1.5 rounded-lg bg-[#DECFC0] text-[#7D6C5A] hover:bg-[#D2C4B1] hover:text-[#261D16] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
