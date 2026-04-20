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
      //if one of the fields is not entered
      if (!email || !password) {
        alert("Please enter your email and password");
        return;
      }
      //otherwise we run a query to the database to see if the email and password exists
      const user = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      //we then get the uid from that user
      const uid = user.user.uid;
      //test they are hooked to that UID
      const loginq = query(collection(db, "Users"), where("UID", "==", uid));
      const logcheck = await getDocs(loginq);

      //if it returns not empty here we pull the needed fields we want to forward to the home page
      if (!logcheck.empty) {
        // get the users data fields
        const user = logcheck.docs[0].data();
        // create constants of said data
        const besttime = user.besttime;
        const todaytime = user.todaystime;
        const textsize = user.textsize;
        //redirect to home page
        router.push({
          pathname: "/home",
          params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }
        });
      }

    } 
    //catch errors
    catch (error: any) 
    {
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