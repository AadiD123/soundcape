import * as React from "react";
// import LinearGradient from "react-native-linear-gradient";
import { View, Text, StyleSheet, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { TouchableOpacity } from "react-native-gesture-handler";

const SERVER_URL = "23.119.122.47:5000";

export default function MoodScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync({
          android: {
            extension: ".mp4",
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          },
          ios: {
            extension: ".wav",
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          },
        });

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    let localUri = recording.getURI();
    let filename = localUri.split("/").pop();
    console.log(filename);

    let formData = new FormData();
    formData.append("recording", { uri: localUri, name: filename });

    setRecordings(updatedRecordings);
    fetch("http://23.119.122.47:5000/analyze_audio", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          {/* Send to server */}
          {/* <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button> */}
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text>Say something and get your music taste</Text>
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
        <View>
          {recording ? (
            <Ionicons size={50} name="mic" />
          ) : (
            <Ionicons size={50} name="mic-outline" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "linear-gradient(to right, #ffa600, #ff0000)",
  },
});
