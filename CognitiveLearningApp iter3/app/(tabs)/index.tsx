/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//NOTE: ChatGPT helped with the fact I should use try and catch section in database prompt sections

//import important and used modules
import { router } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from "./config";

//our function component for this page, the logical stuff
export default function Login() {
  //default set our variable constants using react states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  //get auth to the database
  const auth = getAuth();

  //ran when log in button pressed
  const logintesting = async () => {
    try {
      if (!email || !password) {
        alert("Please enter your email and password");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      const uid = userCredential.user.uid;

      const loginq = query(collection(db, "Users"), where("UID", "==", uid));
      const logcheck = await getDocs(loginq);

      if (logcheck.empty) {
        alert("No matching user record found.");
        return;
      }

      const userData = logcheck.docs[0].data();
      const acctype = userData.acctype;
      const textsize = userData.textsize ?? "Default";

      if (acctype === "Elderly") {
        router.push({ pathname: "/home", params: { uid, email, textsize } });
      } 
      else if (acctype === "Care") {
        router.push({ pathname: "/memberhub", params: { uid, email, textsize } });
      } 
      else {
        alert("Account log in error.");
      }
    } catch (error: any) {
      console.log("Login error:", error);
      alert("Email or Password is incorrect");
    }
};


  
  return (
    //the visual components
    <View style={styles.maincontainer}>
      {/* top section */}
      <Text style={styles.logotext}>Shapes</Text>
      <Text style={styles.subtitle}>Shape your mind, Shape your health.</Text>
      {/* updates email and password as they are typed */}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}/>
      <TextInput style={styles.input}placeholder="Password"value={password}onChangeText={setPassword}secureTextEntry/>
      {/*runs the login test query to the database*/}
      <TouchableOpacity style={styles.loginbutton} onPress={logintesting}><Text style={styles.buttont}>Log In</Text></TouchableOpacity>
      {/* signup redirect section */}
      <View style={styles.signupcontainer}>
        <Text style={styles.signup}>New to Shapes?</Text>
        <TouchableOpacity><Text style={styles.signuplinked} onPress={() => router.push('/signup')}>Sign Up Here!</Text></TouchableOpacity>
      </View>
    </View>
  );
}
//Styles section for classes to style elements
const styles = StyleSheet.create({
  logotext:{
    fontSize: 36,
    color: '#ffffff',
    fontFamily: 'verdana',
    marginBottom:20,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    fontWeight: 'bold',
    textShadowRadius:4,
    textAlign:'center',
  },
  subtitle:{
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 40,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    textAlign: 'center',
  },
  input:{
    backgroundColor: '#576d9f',
    color:'#ffffff',
    fontFamily:'verdana',
    padding:15,
    borderRadius:20,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    marginBottom:25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
  },
  loginbutton:{
    backgroundColor: '#5bd66d',
    padding: 15,
    borderRadius: 20,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    alignItems: 'center',
    shadowColor: '#163a10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    marginBottom:19,
  },
  buttont:{
    fontWeight: 'bold',
    fontFamily: 'verdana',
    color: 'white',
    fontSize: 20,
  },
  maincontainer:{
    flex: 1,
    backgroundColor: '#759eff',
    justifyContent: 'center',
    padding: 20,
  },
  signupcontainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signup:{
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    color: '#ffffff',
    paddingLeft: 15,
  },
  signuplinked:{
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    color: '#09ff00',
    paddingRight: 15,
  },
});