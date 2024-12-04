import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VoiceAssistant = ({ text, clear }) => {
  const [, setMessage] = useState('');
  let session = undefined;

  const handleLlmCall = async (input) => {
    try {
      // Check if session already exists, otherwise create a new one
      if (!session) {
        session = await ai.languageModel.create({
          temperature: 1,
          topK: 3,
        });
      }

      // Adding the specific role-playing context
      const context = `
        You are now playing a character in this conversation user will ask questions based on the initial text they send you they might refer the text as website but understand that they are referring to the initial text they send you for question and answer. 
        Interact with the user in a concise, straight-forward manner and answer their questions clearly respond in human way. 
        Be non-verbose. Always respond in plain text without any additional formatting.
      `;

      const fullPrompt = `${context}\nUser: ${input}`;
      const stream = session.promptStreaming(fullPrompt);

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse = chunk;
      }

      setMessage(fullResponse);
      return fullResponse;
    } catch (error) {
      console.error('AI Interaction Error:', error);
      return 'An error occurred while processing your input.';
    }
  };

  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    const speakText = (textToSpeak) => {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => {
        recognition.start(); // Start listening after AI finishes speaking
      };
      window.speechSynthesis.speak(utterance);
    };

    const processInput = async (input) => {
      try {
        const response = await handleLlmCall(input); // Process input through LLM
        speakText(response); // Speak the AI response
      } catch (error) {
        console.error('AI Processing Error:', error);
        speakText('An error occurred while processing your input.');
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      recognition.stop();
      processInput(transcript); // Send user's spoken input to LLM
    };

    recognition.onerror = (error) => {
      console.error('Speech Recognition Error:', error);
      recognition.stop();
    };

    // Initial AI invocation using the provided `text` prop
    processInput(text);

    return () => {
      recognition.abort();
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const handleClose = () => {
    window.speechSynthesis.cancel();
    clear();
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '150px',
      height: '150px',
      backgroundColor: '#222',
      borderRadius: '50%',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
    },
    button: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: '#f00',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      cursor: 'pointer',
    },
    animation: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #555, #111)',
      animation: 'ripple 1.5s infinite',
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleClose}>
        X
      </button>
      <div style={styles.animation}></div>
    </div>
  );
};

VoiceAssistant.propTypes = {
  text: PropTypes.string.isRequired,
  clear: PropTypes.func.isRequired,
};

export default VoiceAssistant;
