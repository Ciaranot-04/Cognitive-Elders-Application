/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, updateDoc } from "firebase/firestore";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from "./config";

//our function component for this page, the logical stuff
export default function results() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.time as string;
  const uid = params.uid as string;
  const email = params.email as string;
  const besttime = params.besttime as string;
  const carriedtime = Number(params.time);
  let textsize = params.textsize as string;
  let bestTimeN = Number(params.besttime);
  const todayTimeN = Number(params.time);

  //text size segment, how we decide the scaleability of the text
  let textsizenumber = 0;
  if(textsize=="Larger"){
    textsizenumber = 5;
  }
  if(textsize=="Default"){
    textsizenumber = 0;
  }
  if(textsize=="Smaller"){
    textsizenumber = -5;
  }

  //the final time variable no conter here as the puzzle track is done
  const time = carriedtime;
  if (todayTimeN > bestTimeN) {
  bestTimeN = todayTimeN;
}

  //(ChatGPT helped here with this function)
  async function updatetime(uid: string, today: Number, best:Number) {
    try {
      //connect to the database via the uid weve been tracking
      const conn = doc(db, "Users", uid);
      //submit an update to the db
      await updateDoc(conn, {todaystime: today, besttime:best});
    } 
    catch (error) {
    }
  }
  //run the function
  updatetime(uid, todayTimeN,bestTimeN);
  return (
    //the visual components
    <View style={styles.maincontainer}>
        <View style={styles.sub1container}>
          <Text style={[styles.logotext,{marginTop:20,fontSize: 26+textsizenumber}]}>Squares</Text>
            <TouchableOpacity onPress={() => router.push('/account')}>
                <View style={[styles.iconstextcontainer,{marginLeft: 140,marginTop:20}]}>
                <Ionicons name="people-circle-outline" size={40} color="#ffffff" />
                <Text style={[styles.icontext,{color:"#ffffff"}]}>Account</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={styles.sub2container}>
            <Text style={[styles.subtitle,{color:"#069003",fontSize: 18+textsizenumber}]}>Best Time: {besttime}s </Text>
            <Text style={[styles.logotext,{marginBottom:30}]}>Time: {todaytime}s</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "/homegrey", params: {time: time,  uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }})} style={styles.playbutton}><Text style={styles.buttont}>Return Home</Text></TouchableOpacity>
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
    fontSize:20,
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
    fontSize: 12,
    fontFamily: 'verdana',
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    fontWeight: 'bold',
    textShadowRadius:4,
    textAlign:'center',
  },
});