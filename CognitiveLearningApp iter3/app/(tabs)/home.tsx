/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from "react-native-calendars";
import { db } from "./config";

export default function Home() {
  const params = useLocalSearchParams();
  const uid = params.uid as string;
  const email = params.email as string;
  let textsize = params.textsize as string;
  const [selectedDate, setSelectedDate] = React.useState("");
  const [name, setname] = React.useState("");
  const [difficulties, setdiff] = React.useState({
    logic: "easy",
    numeracy: "easy",
    memory: "easy",
    language: "easy",
    visual: "easy",
  });

  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setname(userData.FirstName);

        const defaultdiff = {
          logic: "easy",
          numeracy: "easy",
          memory: "easy",
          language: "easy",
          visual: "easy",
        };

        if (!userData.difficulties) {
          await updateDoc(userRef, {
            difficulties: defaultdiff
          });
          setdiff(defaultdiff);
        } else {
          setdiff(userData.difficulties);
        }
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.log("Error getting user data:", error);
    }
  };
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
    router.push({pathname: "/barchart", params: {date: day.dateString, uid: uid, email: email,textsize: textsize}});
  }

  return (
    <View style={styles.maincontainer}>
        <View style={styles.sub1container}>
            <Text style={[styles.logotext,{marginTop:20,fontSize: 26+textsizenumber}]}>Shapes</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "/account", params: { uid: uid, email: email, textsize: textsize }})}>
                <View style={[styles.iconstextcontainer,{marginLeft: 140,marginTop:20}]}>
                <Ionicons name="people-circle-outline" size={40} color="#ffffff" />
                <Text style={[styles.icontext,{color:"#ffffff",fontSize: 12+textsizenumber}]}>Account</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={styles.sub2container}>
            <Text style={[styles.logotext,{marginTop:10,marginBottom:10,color:"#3a4c87",fontSize: 22+textsizenumber}]}>{name}'s Performance Overview</Text>
            <View style={{ padding: 15,height: 320,overflow: "hidden", alignItems: "center"}}>
              <Calendar style={{ width: 320,overflow: "hidden"}} onDayPress={dateselected} showSixWeeks={true} theme={{ calendarBackground: "#ffffff", textSectionTitleColor: "#2b3760", selectedDayBackgroundColor: "#3665ff", selectedDayTextColor: "#ffffff", todayTextColor: "#0fc625", dayTextColor: "#27272e", textDisabledColor: "#c0c0c0", arrowColor: "#607bd2", monthTextColor: "#3756c6", textMonthFontWeight: "bold", textDayFontWeight: "500", textMonthFontSize: 18, textDayFontSize: 14, }} hideExtraDays={false} markedDates={{[selectedDate]: { selected: true, selectedColor: "blue"}}} />
            </View>
            <Text style={[styles.logotext,{marginTop:130,marginBottom:30,fontSize: 26+textsizenumber}]}>Start Puzzle Track</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "/puzzlescreen", params: { uid: uid, email: email, textsize: textsize, difficulties: JSON.stringify(difficulties) }})} style={[styles.playbutton,{marginBottom:80}]}><Text style={[styles.buttont,{fontSize:20+textsizenumber}]}>Begin</Text></TouchableOpacity>
        </View>
    </View>
  );
}

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
    marginTop:20
  },
  sub3container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom:80
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