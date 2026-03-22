/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//NOTE: ChatGPT helped with the fact I should use try and catch section in database prompt sections

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from "firebase/firestore";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from "./config";

//our function component for this page, the logical stuff
export default function Settings() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const besttime = params.besttime as string;
  const email = params.email as string;
  let textsize = params.textsize as string;

  //default variable setups and text scaleability section
  let textsizenumber = 0;
  let largesel = "";
  let smallsel = "";
  let defaultsel = "";

  //highlight larger if selected
  if(textsize=="Larger"){
    textsizenumber = 5;
    largesel = '#008521';
    defaultsel = '#393b42';
    smallsel = '#393b42';
  }

  //highlight smaller if selected
  if(textsize=="Smaller"){
    textsizenumber = -5;
    smallsel = '#008521';
    largesel = '#393b42';
    defaultsel = '#393b42';
  }

  //highlight default if selected
  if(textsize=="Default"){
    textsizenumber = 0;
    defaultsel = '#008521';
    largesel = '#393b42';
    smallsel = '#393b42';
  }

  //function to submit smaller as selected size to the database and refresh the page
  async function updatetextsmaller(uid: string) {
    textsize = "Smaller";
    try {
      const conn = doc(db, "Users", uid);
      await updateDoc(conn, {textsize:textsize});
    } 
    catch (error) {
    }
    //refresh page
    router.push({ pathname: "/settings", params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})
  }

  //function to submit default as selected size to the database and refresh the page
  async function updatetextdefault(uid: string) {
    textsize = "Default";
    try {
      const conn = doc(db, "Users", uid);
      await updateDoc(conn, {textsize:textsize});
    } 
    catch (error) {
    }
    //refresh the page
    router.push({ pathname: "/settings", params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})
  }

  //function to submit larger as selected size to the database and refresh the page
  async function updatetextlarger(uid: string) {
    textsize = "Larger";
    try {
      const conn = doc(db, "Users", uid);
      await updateDoc(conn, {textsize:textsize});
    } 
    catch (error) {
    }
    //refresh the page
    router.push({ pathname: "/settings", params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})
  }
  return (
    //the visual components
    <View style={styles.maincontainer}>
      {/* header section */}
        <View style={styles.subcontainer}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/home", params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})}><Ionicons name="arrow-back-circle-outline" size={40} color="#ffffff" /></TouchableOpacity>
            <Text style={styles.logotext}>Squares</Text>
        </View>
        {/* body section, buttons for choosing text size, each button runs their corresponding function */}
        <View style={styles.sub2container}>
            <Text style={styles.logotext} >Settings</Text>
            <Text style={styles.subtitle}>here you can choose your prefered text size.</Text>
            <TouchableOpacity style={styles.row}>
              <Text style={[styles.selected,{backgroundColor:smallsel}]} onPress={() => updatetextsmaller(uid)}>Smaller</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={[styles.selected,{backgroundColor:defaultsel}]} onPress={() => updatetextdefault(uid)}>Default</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={[styles.selected,{backgroundColor:largesel}]} onPress={() => updatetextlarger(uid)}>Larger</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}
//Styles section for classes to style elements
const styles = StyleSheet.create({
  logotext:{
    fontSize: 26,
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
  maincontainer:{
    flex: 1,
    backgroundColor: '#759eff',
    justifyContent: 'center',
    padding: 20,
  },
  subcontainer:{
    paddingTop:40,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sub2container:{
    flex: 9,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  selected:{
    padding:15,
    paddingLeft:100,
    paddingRight:100,
    borderRadius:20,
    alignItems:'center',
    justifyContent: 'center',
    color:"white",
    marginBottom:20,
    shadowOpacity: 0.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
  },
  row:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  }
});