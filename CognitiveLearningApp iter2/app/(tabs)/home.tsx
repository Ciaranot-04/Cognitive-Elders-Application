/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from "react-native-calendars";

//our function component for this page, the logical stuff
export default function Home() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const email = params.email as string;
  const besttime = params.besttime as string;
  let textsize = params.textsize as string;
  const [selectedDate, setSelectedDate] = React.useState("");
  

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
    router.push({pathname: "/barchart", params: {date: day.dateString, uid: uid, email: email,textsize: textsize}});
  }
  return (
    //the visual components
    <View style={styles.maincontainer}>
        {/*Top bar segment container*/}
        <View style={styles.sub1container}>
            <Text style={[styles.logotext,{marginTop:20,fontSize: 26+textsizenumber}]}>Squares</Text>
            <TouchableOpacity>
                <View style={[styles.iconstextcontainer,{marginLeft: 140,marginTop:20}]}>
                <Ionicons name="people-circle-outline" size={40} color="#ffffff" />
                <Text style={[styles.icontext,{color:"#ffffff",fontSize: 12+textsizenumber}]}>Account</Text>
                </View>
            </TouchableOpacity>
        </View>
        {/*mid section container*/}
        <View style={styles.sub2container}>
            <Text style={[styles.logotext,{marginTop:10,marginBottom:10,color:"#3a4c87",fontSize: 22+textsizenumber}]}>Performance Overview</Text>
            <View style={{ padding: 15,height: 320,overflow: "hidden", alignItems: "center"}}>
              <Calendar style={{ width: 320}} onDayPress={dateselected} showSixWeeks={true} hideExtraDays={false} markedDates={{[selectedDate]: { selected: true, selectedColor: "blue"}}} />
            </View>
            <Text style={[styles.logotext,{marginTop:50,marginBottom:30,fontSize: 26+textsizenumber}]}>Start Puzzle Track</Text>
            {/*starts puzzle track*/}
            <TouchableOpacity onPress={() => router.push({ pathname: "/puzzlescreen", params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})} style={[styles.playbutton]}><Text style={[styles.buttont,{fontSize:20+textsizenumber}]}>Begin</Text></TouchableOpacity>
        </View>
        {/*lower section, holds setting and log out navigations*/}
        <View style={styles.sub3container}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/settings", params: { uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})}>
                <View style={styles.iconstextcontainer}>
                <Ionicons name="settings-outline" size={40} color="#494949"/>
                <Text style={[styles.icontext,{color:"#494949",marginBottom:20,fontSize: 12+textsizenumber}]}>Settings</Text>
                </View>
            </TouchableOpacity>
            {/*navigate to index aka login screen*/}
            <TouchableOpacity onPress={() => router.push('/')}>
                <View style={[styles.iconstextcontainer]}>
                <Ionicons name="log-out-outline" size={40} color="#ff2626"/>
                <Text style={[styles.icontext,{color:"#ff2626",marginBottom:20,fontSize: 12+textsizenumber}]}>Log Out</Text>
                </View>
            </TouchableOpacity>
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