import * as React from "react";
// import LinearGradient from "react-native-linear-gradient";
import { View, Text, StyleSheet, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import ClipLoader from "react-spinners/ClipLoader";

const SERVER_URL = "http://23.119.122.47:5000/analyze_audio";

const gradientColor = {
  starting: ["#73bbff", "#04203b"],
  happy: ["#FFFFB7", "#F2B005"],
  love: ["pink", "#a60707"],
  sad: ["#b79af5", "#020126"],
  angry: ["red", "black"],
};

export default function MoodScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [emotion, setEmotion] = React.useState("starting");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [playlist, setPlaylist] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

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
    setLoading(true);

    let localUri = recording.getURI();
    let filename = localUri.split("/").pop();
    console.log(filename);

    let formData = new FormData();
    formData.append("recording", { uri: localUri, name: filename });

    setRecordings(updatedRecordings);
    fetch(SERVER_URL, {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEmotion(data["emotion"]);
      });

    setLoading(false);

    console.log(emotion);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getPlaylist() {
    fetch("http://23.119.122.47:5000/happydist")
      .then((response) => response.json())
      .then((data) => {
        setPlaylist(data);
        for (var c = 1; c < data.length + 1; c++) {
          playlist[c - 1]["key"] = c.toString();
        }
      });
  }
  return (
    // <View style={styles.container}>
    //   <Text style={styles.text}>Say something and get your music taste</Text>
    //   <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
    //     <View>
    //       {recording ? (
    //         <Ionicons color={"tomato"} size={100} name="mic" />
    //       ) : (
    //         <Ionicons color={"gray"} size={100} name="mic-outline" />
    //       )}
    //     </View>
    //   </TouchableOpacity>
    //   <View style={{ alignItems: "center" }}>
    //     {emotion != "" ? (
    //       <Text style={styles.text}>I think you are {emotion}</Text>
    //     ) : (
    //       <Text></Text>
    //     )}
    //     {recordings.length > 1 ? (
    //       <TouchableOpacity onPress={() => {}}>
    //         <View style={styles.buttonContainer}>
    //           <Text style={styles.buttonText}>personalized playlist</Text>
    //         </View>
    //       </TouchableOpacity>
    //     ) : (
    //       <Text></Text>
    //     )}
    //   </View>
    // </View>
    <LinearGradient colors={gradientColor[emotion]} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Tell me how you feel</Text>
      </View>
      <View style={styles.recordButtonContainer}>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <View>
            {recording ? (
              <Ionicons color={"tomato"} size={100} name="mic" />
            ) : (
              <Ionicons color={"white"} size={100} name="mic-outline" />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.emotionContainer}>
        {recording != "" && emotion != "starting" ? (
          <View>
            <Text style={styles.emotionText}>
              My analysis shows you are feeling {emotion}
            </Text>
            {/* <FlatList
              data={info}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <View></View>}
            /> */}
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  recordButtonContainer: {
    alignItems: "center",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
  },
  recordButton: {
    backgroundColor: "#04203b",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emotionContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emotionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 100,
    marginHorizontal: 50,
    textAlign: "center",
  },
  // container: {
  //   flex: 1,
  //   justifyContent: "space-evenly",
  //   alignItems: "center",
  // },
  // text: {
  //   color: "black",
  // },
  // buttonContainer: {
  //   backgroundColor: "tomato",
  //   padding: 10,
  //   borderRadius: 5,
  // },
  // buttonText: {
  //   color: "#fff",
  //   textAlign: "center",
  // },
});
