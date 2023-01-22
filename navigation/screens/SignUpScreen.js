import { StackActions } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const SERVER_URL = "http://23.119.122.47:5000/";

  const handleSignUp = async () => {
    // Prepare the data for the POST request
    const data = {
      username: username,
      password: password,
    };

    // Make the POST request to the authentication server
    try {
      const response = await fetch(SERVER_URL + "sign_up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log(json);
      if (json === "user_login" || json === "user_created") {
        // Handle successful sign up
        Linking.canOpenURL(SERVER_URL + "callback").then((supported) => {
          if (supported) {
            Linking.openURL(SERVER_URL + "callback");
          } else {
            console.log("Don't know how to open URI: " + this.props.url);
          }
        });
        navigation.dispatch(StackActions.replace("Main"));
      } else {
        // Handle sign up error
        console.log(json.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome!</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Login/Create Account</Text>
      </TouchableOpacity>
      {/* 
      <Text>Or</Text>

      <TouchableOpacity style={styles.buttonL} onPress={handleSignUp}>
        <Text style={styles.buttonTextL}>Login</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  welcome: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 25,
  },
  textInput: {
    height: 50,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    elevation: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EEEFF3",
    borderColor: "transparent",
  },
  button: {
    height: 37,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "90%",
    elevation: 5,
  },
  buttonL: {
    height: 37,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "90%",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  buttonTextL: {
    color: "black",
    textAlign: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default SignUpScreen;
