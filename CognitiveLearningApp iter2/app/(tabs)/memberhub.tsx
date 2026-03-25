/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from "react-native-calendars";
import { db } from "./config";

//our function component for this page, the logical stuff
export default function memHome() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const uid = params.uid as string;
  const email = params.email as string;
  let textsize = params.textsize as string;
  const [selectedDate, setSelectedDate] = React.useState("");
  let [linkeduser, setlinkeduser] = React.useState("");
  const [linkCode, setLinkCode] = React.useState("");

  React.useEffect(() => {
    getLinkedUser();
  }, []);

  const getLinkedUser = async () => {
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const linked = (userSnap.data().sharevia ?? "").trim();
        setlinkeduser(linked);
      } else {
        setlinkeduser("");
      }
    } catch (error) {
      console.log("Error getting linked user:", error);
      setlinkeduser("");
    }
  };

  const findacc = async () => {
    try {
      const cleanedCode = linkCode.trim();

      if (cleanedCode === "") {
        console.log("No code entered");
        return;
      }

      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("uniquecode", "==", cleanedCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No user found with that code");
        return;
      }

      const matchedUserDoc = querySnapshot.docs[0];
      const matchedUid = matchedUserDoc.id;

      const currentUserRef = doc(db, "Users", uid);
      await updateDoc(currentUserRef, {
        sharevia: matchedUid
      });

      alert("Linked successfully.");
      setlinkeduser(matchedUid);
      setLinkCode("");
    } catch (error) {
      console.log("Error linking account:", error);
    }
  };

  //text size segment, how we decide the scaleability of the text
  let textsizenumber = 0;
  if(textsize=="Larger"){
    textsizenumber = 5;
  }
  if(textsize=="Smaller"){
    textsizenumber = -5;
  }
  if(textsize=="Default"){
    textsizenumber = 0;
  }

  function dateselected(day: DateData){
    console.log(day.dateString); 
    setSelectedDate(day.dateString);
    router.push({
      pathname: "/membar",
      params: {
        date: day.dateString,
        uid: linkeduser,
        email: email,
        textsize: textsize,
        link: linkeduser
      }
    });
  }

  return (
    //the visual components
    <View style={styles.maincontainer}>
        {/*Top bar segment container*/}
        <View style={styles.sub1container}>
            <Text style={[styles.logotext,{marginTop:20,fontSize: 26+textsizenumber}]}>Squares</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "/memacc", params: { uid: uid, email: email, textsize: textsize }})}>
                <View style={[styles.iconstextcontainer,{marginLeft: 140,marginTop:20}]}>
                <Ionicons name="people-circle-outline" size={40} color="#ffffff" />
                <Text style={[styles.icontext,{color:"#ffffff",fontSize: 12+textsizenumber}]}>Account</Text>
                </View>
            </TouchableOpacity>
        </View>

        {/*mid section container*/}
        <View style={styles.sub2container}>
            <Text style={[styles.logotext,{marginTop:10,marginBottom:10,color:"#3a4c87",fontSize: 22+textsizenumber}]}>
              Performance Overview
            </Text>

            {linkeduser.trim() !== "" ? (
              <View style={{ padding: 15, height: 320, overflow: "hidden", alignItems: "center" }}>
                <Calendar
                  style={{ width: 320 }}
                  onDayPress={dateselected}
                  showSixWeeks={true}
                  hideExtraDays={false}
                  markedDates={{
                    [selectedDate]: { selected: true, selectedColor: "blue" }
                  }}
                />
              </View>
            ) : (
              <View style={styles.linkbox}>
                <Text style={[styles.subtitle, { fontSize: 18 + textsizenumber, color: "#3a4c87" }]}>
                  Link to a user
                </Text>

                <TextInput
                  style={[styles.input, { fontSize: 16 + textsizenumber }]}
                  placeholder="Enter link code"
                  placeholderTextColor="#777"
                  value={linkCode}
                  onChangeText={setLinkCode}
                />

                <TouchableOpacity style={styles.linkButton} onPress={findacc}>
                  <Text style={[styles.buttont, { fontSize: 18 + textsizenumber }]}>
                    Link Account
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
    </View>
  );
}

//Styles section for classes to style elements
const styles = StyleSheet.create({
  logotext:{
    color: '#ffffff',
    fontFamily: 'verdana',
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    fontWeight: 'bold',
    textShadowRadius:4,
    textAlign:'center',
  },
  playbutton:{
    backgroundColor:'#273d85',
    padding:15,
    borderRadius:20,
    alignItems:'center',
    marginBottom:20,
    shadowOpacity: 0.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
  },
  linkButton:{
    backgroundColor:'#273d85',
    padding:15,
    borderRadius:20,
    alignItems:'center',
    marginTop:10,
    width:220,
    shadowOpacity: 0.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
  },
  buttont:{
    fontWeight:'bold',
    color:'white',
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
  },
  subtitle:{
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 20,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    textAlign: 'center',
  },
  input:{
    backgroundColor:'white',
    width:260,
    padding:15,
    borderRadius:15,
    textAlign:'center',
    marginBottom:10,
  },
  linkbox:{
    height:320,
    justifyContent:'center',
    alignItems:'center',
    padding:15,
  },
  maincontainer:{
    flex:1,
    backgroundColor:'#759eff',
    padding:20,
  },
  sub1container:{
    paddingTop:40,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sub2container:{
    flex: 8,
    justifyContent: 'center',
    padding: 20,
  },
  sub3container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  iconstextcontainer:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icontext:{
    fontFamily: 'verdana',
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    fontWeight: 'bold',
    textShadowRadius:4,
    textAlign:'center',
  },
});