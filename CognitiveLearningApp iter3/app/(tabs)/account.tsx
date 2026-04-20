/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//NOTE THIS PAGE IS NOT USED RIGHT NOW

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from "./config";

//our function component for this page, the logical stuff
export default function Account() {

  const params = useLocalSearchParams();
  const uid = params.uid as string;
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
    router.push({ pathname: "/account", params: { uid: uid, email: email, textsize: textsize }})
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
    router.push({ pathname: "/account", params: { uid: uid, email: email, textsize: textsize }})
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
    router.push({ pathname: "/account", params: { uid: uid, email: email, textsize: textsize }})
  }

  const [showCode, setShowCode] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [name, setname] = React.useState("");

  React.useEffect(() => {
    getUserCode();
  }, []);

  const getUserCode = async () => {
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setCode(userSnap.data().uniquecode);
        setname(userSnap.data().FirstName);
      } else {
        console.log("User not found");
      }

    } catch (error) {
      console.log("Error getting code:", error);
    }
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(code);
    alert("Code copied to clipboard!");
  };

  const deleteaccount = async () => {
    try {
      const userRef = doc(db, "Users", uid);
      await deleteDoc(userRef);

      Alert.alert("Deleted", "Account deleted successfully.");
      router.push('/');
    } catch (error) {
      console.log("Error deleting account:", error);
      Alert.alert("Error", "There was a problem deleting the account.");
    }
  };

  const del = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel"},
        { text: "Delete", style: "destructive", onPress: deleteaccount }
      ]
    );
  };

  return (
    <View style={styles.maincontainer}>

      <View style={styles.subcontainer}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/home",
              params: { uid, email, textsize } })}
        >
          <Ionicons name="arrow-back-circle-outline" size={40} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.logotext}>Shapes</Text>
      </View>
      <View style={styles.sub2container}>
        <Text style={[styles.headertxt, { marginBottom: 20, padding:10}]}>{name}'s Acount Management</Text>
        <Text style={styles.subtitle}>Choose text size.</Text>
        <TouchableOpacity style={styles.row}>
          <Text style={[styles.selected,{backgroundColor:smallsel}]} onPress={() => updatetextsmaller(uid)}>
            Smaller
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={[styles.selected,{backgroundColor:defaultsel}]} onPress={() => updatetextdefault(uid)}>
            Default
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={[styles.selected,{backgroundColor:largesel}]} onPress={() => updatetextlarger(uid)}>
            Larger
          </Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>Click To Reveal Profile Link Code</Text>
        <TouchableOpacity style={[ styles.inputtoggle, { backgroundColor: showCode ? "#25377f" : "#ffffff" }]} onPress={() => setShowCode(!showCode)}>
          <Text style={{ color: showCode ? "white" : "black", fontSize: 18 }}>
            {showCode ? code : "Link Code"}
          </Text>
        </TouchableOpacity>
        {showCode && (
          <TouchableOpacity style={[styles.inputtoggle, { backgroundColor: "#25377f" }]} onPress={copyCode} >
            <Text style={{ color: "white" }}>
              Copy to Clipboard
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.text}>ONLY SHARE WITH TRUSTED INDIVIDUALS</Text>
      </View>
      <View style={styles.bottomcontainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/')}>
          <View>
            <Text style={styles.deleteText}>Log Out</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={del}>
          <Text style={styles.deleteText}>Delete Account</Text>
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
  headertxt:{
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'verdana',
    marginBottom:20,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    fontWeight: 'bold',
    textShadowRadius:4,
    textAlign:'center',
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
  subtitle:{
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 40,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    textAlign: 'center',
  },
  bottomcontainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    marginBottom:20,
  },

  deleteButton: {
    backgroundColor: "#ff2626",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 110,
    borderRadius: 20,
    marginBottom:10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  text:{
    fontSize: 16,
    fontFamily: 'verdana',
    color: 'red',
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
    flex: 0.9,
    justifyContent: 'space-between',
    marginTop:40,
    flexDirection: 'row',
  },
  sub2container:{
    flex: 9,
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom:140,
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