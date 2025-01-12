import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";

const SentenceDisplay = ({ sentence, getSentence, readSentence }) => (
  <View style={styles.sentenceContainer}>
    <Text id="sentence" style={styles.sentence}>
      {sentence || 'Cliquez sur "Obtenir une phrase" pour commencer'}
    </Text>
    <Button title="Obtenir une phrase" onPress={getSentence} />
    <Button title="Écouter la phrase" onPress={readSentence} />
  </View>
);

const RecordButton = ({ onRecognizedText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const micScale = useRef(new Animated.Value(1)).current; // Déplacer micScale ici
  let recognition;

  if (!("webkitSpeechRecognition" in window)) {
    alert("Désolé, votre navigateur ne supporte pas l'API Web Speech.");
  } else {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      const audioText = event.results[0][0].transcript.trim().toLowerCase();
      onRecognizedText(audioText);
      getFeedback(audioText);
    };

    recognition.onerror = function (event) {
      alert("Erreur lors de la reconnaissance vocale : " + event.error);
    };
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    recognition.stop();
    setIsRecording(false);
  };

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const getFeedback = async (recognizedText) => {
    try {
      const response = await axios.post("http://localhost:5003/feedback", {
        recognized_text: recognizedText,
        reference_phrase: document.getElementById("sentence").innerText,
      });
      console.log("Feedback:", response.data);
    } catch (error) {
      console.error("Error getting feedback:", error);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.recordButtonContainer}>
      <TouchableOpacity
        style={styles.microphoneButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Animated.View
          style={[
            styles.outerCircle,
            { transform: [{ scale: micScale }] },
            { backgroundColor: isRecording ? "#00FF00" : "#FF8C00" }, // Change color when recording
          ]}
        >
          <Icon name="microphone-alt" size={80} color="#FFFAF0" />
        </Animated.View>
      </TouchableOpacity>
      <Button
        title="Réécouter l'enregistrement"
        onPress={playAudio}
        disabled={!audioURL}
      />
    </View>
  );
};

const FeedbackDisplay = ({ recognizedText }) => {
  const [feedback, setFeedback] = useState([]);
  const [match, setMatch] = useState(false);
  const [score, setScore] = useState(0);

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .toLowerCase();
  };

  const compareText = async () => {
    try {
      const response = await axios.post("http://localhost:5003/feedback", {
        recognized_text: normalizeText(recognizedText),
        reference_phrase: normalizeText(
          document.getElementById("sentence").innerText
        ),
      });
      const feedbackArray = response.data.feedback.map((word) => ({
        text: word.text,
        correct: word.correct,
      }));
      setFeedback(feedbackArray);
      setMatch(response.data.match);
      calculateScore(feedbackArray);
    } catch (error) {
      console.error("Error comparing text:", error);
    }
  };

  const calculateScore = (feedbackArray) => {
    const correctWords = feedbackArray.filter((word) => word.correct).length;
    setScore(correctWords);
  };

  useEffect(() => {
    if (recognizedText) {
      compareText();
    }
  }, [recognizedText]);

  return (
    <View style={styles.feedbackContainer}>
      <Text style={styles.recognizedText}>Phrase prononcée: {recognizedText}</Text>
      <Text style={styles.feedbackText}>
        {feedback.map((word, index) => (
          <Text
            key={index}
            style={{ color: word.correct ? "green" : "red" }}
          >
            {word.text}{" "}
          </Text>
        ))}
      </Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
};

const Feed = () => {
  const [sentence, setSentence] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const micScale = useRef(new Animated.Value(1)).current;

  const startPulsating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulsating();
  }, []);

  const getSentence = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_sentence");
      setSentence(response.data.sentence);
    } catch (error) {
      console.error("Error fetching sentence:", error);
    }
  };

  const readSentence = () => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "fr-FR";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://marketplace.canva.com/EAF6DEqEaro/1/0/900w/canva-orange-white-cartoon-illustrative-funny-cat-phone-wallpaper-W05PU8BDltw.jpg",
        }}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.content}>
          <RecordButton onRecognizedText={setRecognizedText} />
          <SentenceDisplay
            sentence={sentence}
            getSentence={getSentence}
            readSentence={readSentence}
          />
          <FeedbackDisplay recognizedText={recognizedText} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 100,
  },
  microphoneButton: {
    marginBottom: 50,
  },
  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8C00",
  },
  sentenceContainer: {
    alignItems: "center",
    margin: 20,
  },
  sentence: {
    fontSize: 18,
    marginBottom: 10,
  },
  recordButtonContainer: {
    alignItems: "center",
  },
  feedbackContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  recognizedText: {
    fontSize: 16,
    color: "blue",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: "black",
  },
  scoreText: {
    fontSize: 18,
    color: "green",
    marginTop: 10,
  },
});

export default Feed;
