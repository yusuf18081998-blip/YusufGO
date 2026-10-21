import React, { useState } from 'react';
import { GoPrepVoiceChatView } from './components/GoPrepVoiceChatView';

export default function App() {
  const [uzbekMode, setUzbekMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen w-full bg-[#160b12] text-slate-100 font-sans selection:bg-rose-500 selection:text-white flex flex-col justify-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <GoPrepVoiceChatView
          uzbekMode={uzbekMode}
          onToggleUzbek={() => setUzbekMode(!uzbekMode)}
        />
      </div>
    </div>
  );
}
