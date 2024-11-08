import React, { useState, useEffect } from 'react';
import { SpeechConfig, AudioConfig, SpeechSynthesizer, SpeechSynthesisResultReason } from 'microsoft-cognitiveservices-speech-sdk';
function TextToSpeech () {
  const [textInput, setTextInput] = useState('');
  const [ttsOutput, setTtsOutput] = useState('Click the Speak button to generate audio');
  const [speechSynthesizer, setSpeechSynthesizer] = useState(null);

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSpeakClick = () => {
    const speechConfig = SpeechConfig.fromSubscription('<subscription-key>', '<region>');
    speechConfig.speechSynthesisLanguage = 'en-US';
    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    setSpeechSynthesizer(synthesizer);

    synthesizer.synthesizing = (_, { resultReason, audioData }) => {
      if (resultReason === SpeechSynthesisResultReason.SynthesizingAudio) {
        const audioUrl = URL.createObjectURL(new Blob([audioData], { type: 'audio/wav' }));
        setTtsOutput(audioUrl);
      } else if (resultReason === SpeechSynthesisResultReason.Canceled) {
        console.log('Speech synthesis canceled:', synthesizer.cancellationDetails.errorDetails);
      } else {
        console.log('Unexpected speech synthesis result:', resultReason);
      }
    };

    synthesizer.speakTextAsync(textInput);
  };

  useEffect(() => {
    return () => {
      if (speechSynthesizer !== null) {
        speechSynthesizer.close();
      }
    };
  }, [speechSynthesizer]);

  return (
    <div>
      <div>
        <label htmlFor="textInput">Text input:</label>
        <input type="text" id="textInput" value={textInput} onChange={handleTextInputChange} />
      </div>
      <div>
        <button onClick={handleSpeakClick}>Speak</button>
      </div>
      <div>
        <label htmlFor="ttsOutput">Text-to-speech output:</label>
        <audio id="ttsOutput" controls src={ttsOutput}></audio>
      </div>
    </div>
  );
};

export default TextToSpeech