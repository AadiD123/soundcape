import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SocialScreen() {
  const gradientColor = {
    starting: ["#73bbff", "#73bbff"],
    happy: ["#FFFFB7", "#FFFFB7"],
    love: ["pink", "#pink"],
    sad: ["#b79af5", "#b79af5"],
    angry: ["red", "red"],
  };
  const SERVER_URL = "http://23.119.122.47:5000/";

  useEffect(() => {
    fetch(SERVER_URL + "get_feed")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  const data = [
    {
      key: "1",
      username: "username",
      mood: "sad",
      compatability: 0.9,
      spotify: "",
    },
    {
      key: "2",
      username: "username",
      mood: "happy",
      compatability: 0.9,
      spotify: "",
    },
    {
      key: "3",
      username: "username",
      mood: "sad",
      compatability: 0.9,
      spotify: "",
    },
    {
      key: "4",
      username: "username",
      mood: "angry",
      compatability: 0.9,
      spotify: "",
    },
    {
      key: "5",
      username: "username",
      mood: "angry",
      compatability: 0.9,
      spotify: "",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Discover</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
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

                <Text style={{ marginRight: 20 }}>{item.compatability}</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.button} onPress={() => {}}>
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
