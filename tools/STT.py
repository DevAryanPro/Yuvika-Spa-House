# First install required packages:
# pip install SpeechRecognition pyaudio

import speech_recognition as sr

def speech_to_text():
    # Initialize recognizer
    recognizer = sr.Recognizer()
    
    try:
        # Use microphone as audio source
        with sr.Microphone() as source:
            print("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            print("Listening... Speak now!")
            
            # Capture the audio
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            print("Processing audio...")
            
            # Try using Google Speech Recognition
            text = recognizer.recognize_google(audio, language='en-US')
            return text
            
    except sr.WaitTimeoutError:
        return "Error: Listening timed out while waiting for speech"
    except sr.UnknownValueError:
        return "Error: Could not understand audio"
    except sr.RequestError as e:
        return f"Error: Could not request results; {e}"
    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    result = speech_to_text()
    print("\nConversion Result:")
    print(result)