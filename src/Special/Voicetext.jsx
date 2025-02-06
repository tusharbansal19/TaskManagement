import { useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function TextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const text = "Hello! This is a text-to-speech demo in React.";

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <button
        className="p-4 bg-blue-500 text-white rounded-full shadow-lg text-xl flex items-center justify-center hover:bg-blue-600 transition"
        onClick={toggleSpeech}
      >
        {isSpeaking ? <FaVolumeUp size={30} /> : <FaVolumeMute size={30} />}
      </button>
    </div>
  );
}
