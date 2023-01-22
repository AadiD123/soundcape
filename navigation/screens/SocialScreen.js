import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Linking } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SocialScreen() {
  const [info, setInfo] = useState([]);

  const gradientColor = {
    starting: ["#73bbff", "#73bbff"],
    happy: ["#FFFFB7", "#FFFFB7"],
    love: ["pink", "#pink"],
    sad: ["#b79af5", "#b79af5"],
    angry: ["red", "red"],
  };
  const SERVER_URL = "http://23.119.122.47:5000/";

  const refesh = () => {
    fetch(SERVER_URL + "get_feed")
      .then((response) => response.json())
      .then((data) => {
        setInfo(data);
        for (var c = 1; c < data.length + 1; c++) {
          info[c - 1]["key"] = c.toString();
        }
      });
  };
  // const data = [
  //   {
  //     key: "1",
  //     username: "username",
  //     mood: "sad",
  //     compatability: 0.9,
  //     spotify: "",
  //   },
  //   {
  //     key: "2",
  //     username: "username",
  //     mood: "happy",
  //     compatability: 0.9,
  //     spotify: "",
  //   },
  //   {
  //     key: "3",
  //     username: "username",
  //     mood: "sad",
  //     compatability: 0.9,
  //     spotify: "",
  //   },
  //   {
  //     key: "4",
  //     username: "username",
  //     mood: "angry",
  //     compatability: 0.9,
  //     spotify: "",
  //   },
  //   {
  //     key: "5",
  //     username: "username",
  //     mood: "angry",
  //     compatability: 0.9,
  //     spotify: "",
  //   },
  // ];

  console.log(info);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Discover</Text>
        <TouchableOpacity onPress={refesh}>
          <Text>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={info}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={gradientColor[item.mood]}
              style={{
                height: 150,
                alignItems: "center",
                justifyContent: "space-evenly",
                width: 300,
                marginVertical: 15,
                padding: 25,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {/* <View
                    style={{
                      backgroundColor: "#73bbff",
                      height: 25,
                      width: 25,
                      borderRadius: 25,
                      marginHorizontal: 20,
                    }}
                  /> */}
                  <View>
                    <Text style={{ fontSize: 18 }}>{item.username}</Text>
                    <Text style={{ fontSize: 15 }}>{item.mood}</Text>
                  </View>
                </View>

                <Text style={{ marginRight: 20 }}>{item.compatibility}</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    Linking.canOpenURL(item.spotify).then((supported) => {
                      if (supported) {
                        Linking.openURL(item.spotify);
                      } else {
                        console.log(
                          "Don't know how to open URI: " + this.props.url
                        );
                      }
                    });
                  }}
                >
                  <Text>Playlist</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  listContainer: {
    height: 620,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  button: {
    padding: 8,
    borderRadius: 10,
    margin: 10,
    width: "90%",
    elevation: 5,
    borderColor: "black",
    alignItems: "center",
    backgroundColor: "white",
  },
});
