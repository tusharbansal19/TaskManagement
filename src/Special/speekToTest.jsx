import { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export default function SpeechToTextAndTextToSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("en-US"); // Default to English
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            text += event.results[i][0].transcript + " ";
          }
        }
        setTranscript((prev) => prev + text);
      };

      recognitionRef.current = recognition;
    }
  }, [language]); // Reinitialize when language changes

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!isListening) {
      recognitionRef.current.lang = language; // Set language dynamically
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
    setIsListening(!isListening);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(transcript || "कृपया कुछ बोलें" || "Please speak something.");
      utterance.lang = language; // Set language dynamically
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const clearText = () => {
    setTranscript("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      {/* Language Selector */}
      <select
        className="p-2 border border-gray-400 rounded-md"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en-US">English</option>
        <option value="hi-IN">हिन्दी (Hindi)</option>
      </select>

      {/* Speech-to-Text Section */}
      <div className="flex flex-col items-center space-y-4">
        <button
          className="p-4 bg-red-500 text-white rounded-full shadow-lg text-xl flex items-center justify-center hover:bg-red-600 transition"
          onClick={toggleListening}
        >
          {isListening ? <FaMicrophone size={30} /> : <FaMicrophoneSlash size={30} />}
        </button>
        <p className="mt-4 text-lg p-2 border border-gray-300 rounded-md w-full max-w-md min-h-[50px] text-center">
          {transcript || (language === "hi-IN" ? "कृपया बोलें..." : "Start speaking...")}
        </p>
        {/* Clear Button */}
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          onClick={clearText}
          disabled={!transcript} // Disable if transcript is empty
        >
          {language === "hi-IN" ? "साफ करें" : "Clear"}
        </button>
      </div>

      {/* Text-to-Speech Section */}
      <div className="flex flex-col items-center space-y-4">
        <button
          className="p-4 bg-blue-500 text-white rounded-full shadow-lg text-xl flex items-center justify-center hover:bg-blue-600 transition"
          onClick={toggleSpeech}
          disabled={!transcript} // Disable if no text to speak
        >
          {isSpeaking ? <FaVolumeUp size={30} /> : <FaVolumeMute size={30} />}
        </button>
        <p className="text-lg mt-4">
          {isSpeaking
            ? language === "hi-IN"
              ? "अब बोल रहा है..."
              : "Now speaking..."
            : language === "hi-IN"
            ? "टेक्स्ट को सुनने के लिए बटन दबाएं"
            : "Press to hear the text"}
        </p>
      </div>
    </div>
  );
}
                   