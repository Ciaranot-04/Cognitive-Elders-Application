/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from './config';

//our function component for this page, the logical stuff
export default function Details() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const uid = params.uid as string;
  const email = params.email as string;
  const acc = params.acctype as string;

  //use states here so we can set their default and also update them in the ui section
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  //default setup for variables
  const bt = "0.00";
  const tt = "0.00";
  const ts = "Default";

  const data = async () => {
    //if one of these is not filled in
    if (!firstName || !lastName || !dob) {
      //notify user
      Alert.alert('All fields are Required');
      return;
    }

    if (!uid) {
      //if a uid was not passed creating the user failed (database issue)
      Alert.alert('Failed to Create Profile, Please try again.');
      return;
    }


    const generatelinkcode = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
    };
    const usercode = generatelinkcode();
    try {
      //send this to the database creating a user of UID and give it these fields
      if(acc==="Elderly"){
        await setDoc(doc(db, 'Users', uid), {
          //trim removes unneccesary spaces at start or end of strings
          LastName: lastName.trim(),
          FirstName: firstName.trim(),
          DOB: dob.trim(),
          Email: email,
          Account_Made: new Date(),
          textsize: ts,
          UID: uid,
          acctype: acc,
          uniquecode: usercode,
        });
      }
      else{
        await setDoc(doc(db, 'Users', uid), {
          //trim removes unneccesary spaces at start or end of strings
          LastName: lastName.trim(),
          FirstName: firstName.trim(),
          DOB: dob.trim(),
          Email: email,
          Account_Made: new Date(),
          textsize: ts,
          UID: uid,
          acctype: acc,
          sharevia:"",
        });
      }
      //tell user account was created and auto forward them to the home page
      Alert.alert('Account Created Successfully');
      if(acc==="Elderly"){
        router.push({pathname: "/home", params: { uid: uid, email: email, besttime: bt, todaytime: tt, textsize: ts }});
      }
      else{
        router.push({pathname: "/memberhub", params: { uid: uid, email: email, textsize: ts }});
      }
    } catch (error: any) {
      Alert.alert('An Error occured during account creation, Please Retry.');
    }
  };

  return (
    //the visual components
    <View style={styles.mcontainer}>
      <Text style={styles.logotext}>Shapes</Text>
      <Text style={styles.subtitle}>Let's Get Started..</Text>
      {/*data fields*/}
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName}/>
      <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob}/>
      {/*Finish sign up button and creates the user by running the function*/}
      <TouchableOpacity onPress={data} style={styles.nextingbutton}>
        <Text style={styles.buttont}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}
//Styles section for classes to style elements
const styles = StyleSheet.create({
  logotext: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#576d9f',
    color: '#ffffff',
    padding: 15,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    borderRadius: 20,
    marginBottom: 28,
  },
  nextingbutton: {
    backgroundColor: '#273d85',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  buttont: {
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    fontSize: 20,
  },
  mcontainer: {
    flex: 1,
    backgroundColor: '#759eff',
    justifyContent: 'center',
    padding: 20,
  },
});
