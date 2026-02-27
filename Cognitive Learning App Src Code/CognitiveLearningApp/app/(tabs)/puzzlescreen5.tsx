/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles5.json';

//our function component for this page, the logical stuff
export default function puz5() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const carriedtime = Number(params.time);
  const besttime = params.besttime as string;
  const email = params.email as string;
  let textsize = params.textsize as string;

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

  //generate random puzzle from puzzles5.json
  const [pattern] = React.useState(() => {
      const layouts = puzzles.patterns;
      const i = Math.floor(Math.random() * layouts.length);
      return layouts[i];
  });

  //here we continue up our timer, it is the next page so it starts at the time frm the previous page, it increments every second
  const [time, settime] = React.useState(carriedtime); React.useEffect(() => {setInterval(() => {settime(prev => prev + 1);},1000);return () => clearInterval(time);
    }, []);

  //similarly to previous screen, we take the right colour and wrong colour
  const [answer] = React.useState(pattern.answer);
  const [wrong1] = React.useState(pattern.wrong1);
  const [wrong2] = React.useState(pattern.wrong2);
  const [wrong3] = React.useState(pattern.wrong3);
  //options array for the answer panel
  const options = [wrong3, answer, wrong1, wrong2];

  //grid setup
  const [gridsaved] = React.useState<string[]>(pattern.layout);
  const gridrows = [];

  //loop to draw pattern to the screen
  for (let i = 0; i < gridsaved.length; i++) {
  const colour = gridsaved[i];
  gridrows.push(
      <TouchableOpacity
      key={i}
      style={[styles.square, { backgroundColor: colour }]}
      />
  );
  }
  const grid = (
  <View style={styles.row}>
      {gridrows}
  </View>

  );
  function ansr(value: String) {
      if (value === answer) {
          router.push({ pathname: "/puzzlescreen6", params: {time: time,  uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }});
      } else {
          Alert.alert("Incorrect, Try again.");
      }
  }
  //the visual components
  return (
    <View style={styles.maincontainer}>
        <View style={[styles.subcontainer,{marginTop:20}]}>
            <Text style={styles.logotext}>Squares</Text>
        </View>
        <View style={styles.sub2container}>
            {grid}
        </View>
        <View style={styles.sub3container}>
            <Text style={styles.logotext}>{time}s</Text>
            <Text style={styles.text}>Which colour is missing?</Text>
            <View style={styles.ansrow1}>
                {/* Answer tiles */}
                <TouchableOpacity key={'1'} style={[styles.anssquare, {backgroundColor: options[0]}]} onPress={() => ansr(options[0])}>
                </TouchableOpacity>
                <TouchableOpacity key={'2'} style={[styles.anssquare, {backgroundColor: options[1]}]} onPress={() => ansr(options[1])}>
                </TouchableOpacity>
            </View>
            <View style={styles.ansrow2}>
              {/* Answer tiles */}
                <TouchableOpacity key={'3'} style={[styles.anssquare,{backgroundColor: options[2]}]} onPress={() => ansr(options[2])}>
                </TouchableOpacity>
                <TouchableOpacity key={'4'} style={[styles.anssquare,{backgroundColor: options[3]}]} onPress={() => ansr(options[3])}>
                </TouchableOpacity>
            </View>
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
    marginTop: 120,
    marginLeft: 37,
    flex: 5,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  row: {
    flexDirection: "row",
  },
  sub3container:{
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  square: {
    width: 27,
    height: 27,
    margin: 4,
    borderRadius: 10,
  },
  anssquare: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
  },
  ansrow1:{
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  ansrow2:{
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 40,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    textAlign: 'center',
  }
});