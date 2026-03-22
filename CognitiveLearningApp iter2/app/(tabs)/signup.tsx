/*
Student Name: Ciaran O" Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "./config";

//our function component for this page, the logical stuff
export default function Signup() {
  // set with usestates here as we can update these values from our inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [type, setType] = useState("Elderly");

  //this handles signup function
  //only ran when the sign up button is pressed
  const signup = async () => {
    //check if variables are still empty
    if (!email || !password || !confirm) {
      //notify user
      Alert.alert("Please fill in all fields");
      return;
    }
    //if confirm password and password dont match
    if (password !== confirm) {
      //notify user
      Alert.alert("Passwords do not match");
      return;
    }
    //(chatGPT helped with this section)
    //told me to use try and catch otherwise the program throws errors
    //helped with what to use to make a call to my database
    try {
      // create user in Firebase Auth
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const uid = user.user.uid;

      // pass uid to next screen
      router.push({pathname: "/detailspt1", params: { uid: uid, email: user.user.email, acctype: type }});
    } 
    catch (error) {
      //if error with signup notify user
      Alert.alert("Signup failed");
    }
  };

  return (
    //the visual components
    //container for whole page
    <View style={styles.mcontainer}>
      <Text style={styles.logotext}>Squares</Text>
      <Text style={styles.subtitle}>Create your Squares Account Today</Text>
      <Text style={styles.subsubtitle}>Select your Account type and fill in the fields below</Text>
      {/* on text entered the respected variables update*/}
      <View>
        <TouchableOpacity style={[ styles.inputtoggle, { backgroundColor: type === "Elderly" ? "#28447c" : "#773c3c" } ]} onPress={() => setType(type === "Elderly" ? "Care" : "Elderly")} >
          <Text style={{ color: "white" }}>{type === "Elderly" ? "Elderly Individual" : "Care Taker"}</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry/>
      {/*on click run signup function*/}
      <TouchableOpacity onPress={signup} style={styles.signupbutton}>
        <Text style={styles.buttont}>Sign Up</Text>
      </TouchableOpacity>
      {/*container for the login section so it goes horizontally*/}
      <View style={styles.logincontainer}>
        <Text style={styles.login}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.loginlinked}>Log In Here!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
//Styles section for classes to style elements
const styles = StyleSheet.create({
  logotext:{
    fontSize:36, 
    color:"#ffffff", 
    fontWeight:"bold", 
    textAlign:"center", 
    marginBottom:20,
    textShadowColor:"rgba(0,0,0,0.8)", 
    textShadowOffset:{ width:1, height:1}, 
    textShadowRadius:4,
  },
  subtitle:{
    fontSize:24, color:"#ffffff", 
    textShadowColor:"rgba(0,0,0,0.8)",
    textShadowOffset:{ width:1,height:1}, 
    textAlign:"center", 
    marginBottom:30,
  },
  subsubtitle:{
    fontSize:15, color:"#ffffff", 
    textShadowColor:"rgba(0,0,0,0.8)",
    textShadowOffset:{ width:1,height:1}, 
    textAlign:"center", 
    marginBottom:30,
  },
  input:{
    backgroundColor:"#576d9f", 
    color:"#ffffff", 
    padding:15,
    textShadowColor:"rgba(0,0,0,0.8)", 
    textShadowOffset:{ width:1,height:1},
    borderRadius:20, 
    marginBottom:28,
  },
  inputtoggle:{
    justifyContent: "center",
    alignItems: "center",
    color:"#ffffff", 
    padding:15,
    textShadowColor:"rgba(0,0,0,0.8)", 
    textShadowOffset:{ width:1,height:1},
    borderRadius:20, 
    marginBottom:28,
  },
  signupbutton:{
    backgroundColor:"#5bd66d", 
    padding:15, 
    borderRadius:20, 
    alignItems:"center",
    marginBottom:20, 
    shadowOpacity: 0.5, 
    shadowColor: "#163a10", 
    shadowOffset: { width:0, height:4 },
  },
  buttont:{
    fontWeight:"bold", 
    color:"white", 
    textShadowColor:"rgba(0,0,0,0.8)",
    textShadowOffset:{ width:1,height:1}, 
    fontSize:20,
  },
  mcontainer:{ 
    flex:1, 
    backgroundColor:"#759eff", 
    justifyContent:"center", 
    padding:20 },
  logincontainer:{ 
    flexDirection:"row", 
    justifyContent:"space-between", 
    alignItems:"center" 
  },
  login:{ 
    color:"#ffffff", 
    marginRight:5, 
    textShadowColor:"rgba(0,0,0,0.8)", 
    textShadowOffset:{ width:1,height:1} 
  },
  loginlinked:{ 
    color:"#09ff00", 
    fontWeight:"bold", 
    textShadowColor:"rgba(0,0,0,0.8)", 
    textShadowOffset:{ width:1,height:1} 
  },
});