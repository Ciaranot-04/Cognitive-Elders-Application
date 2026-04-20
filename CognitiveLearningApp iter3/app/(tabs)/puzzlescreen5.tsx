/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 20/04/2026
*/

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
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
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  let puz5score = 0;
  //if for some reason no difficulty is set
  const defaultdiff = {
    logic: "easy",
    numeracy: "easy",
    memory: "easy",
    language: "easy",
    visual: "easy",
  };
  const difficulties = params.difficulties ? JSON.parse(params.difficulties as string) : defaultdiff;
  const difficulty = difficulties.logic || "easy";
  const [presses, setPresses] = React.useState(1);

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
      const filteredpatterns = puzzles.patterns.filter((pattern) => pattern.difficulty === difficulty);
      const puzzlepool = filteredpatterns.length > 0 ? filteredpatterns : puzzles.patterns;
      const i = Math.floor(Math.random() * puzzlepool.length);
      return puzzlepool[i];
  });

  //here we continue up our timer, it is the next page so it starts at the time frm the previous page, it increments every second
  const [time, settime] = React.useState(carriedtime); React.useEffect(() => {const timer = setInterval(() => {settime(prev => prev + 1);},1000);return () => clearInterval(timer);
    }, []);

  //similarly to previous screen, we take the right colour and wrong colour
  const [answer] = React.useState(pattern.answer);
  const [answershape] = React.useState(pattern.answershape);
  const [wrongs] = React.useState<string[]>(pattern.wrongs);
  const [wrongsshapes] = React.useState<string[]>(pattern.wrongsshapes);
  const [hinttext] = React.useState(pattern.hinttext);
  const options = [
    { colour: wrongs[0], shape: wrongsshapes[0] },
    { colour: answer, shape: answershape },
    { colour: wrongs[1], shape: wrongsshapes[1] },
    { colour: wrongs[2], shape: wrongsshapes[2] }
  ];

  //grid setup
  const [gridsaved] = React.useState<string[]>(pattern.layout);
  const [shapessaved] = React.useState<string[]>(pattern.shapes);
  const gridrows = [];

  //loop to draw pattern to the screen
  for (let i = 0; i < gridsaved.length; i++) {
    const colour = gridsaved[i];
    const shape = shapessaved[i];
    gridrows.push(
      <TouchableOpacity
        key={i}
        style={styles.square}
      >
        {colour !== "transparent" && (
          <Ionicons
            name={shape as any}
            size={26}
            color={colour}
          />
        )}
      </TouchableOpacity>
    );
  }
  const grid = (
  <View style={styles.row}>
      {gridrows}
  </View>

  );
  function ansr(value: string, shape: string) {
      setPresses(prev => prev + 1);
      if (value === answer && shape === answershape) {
          if(presses==1){
            puz5score = 100;
          }
          else if(presses==2){
            puz5score = 80;
          }
          else if(presses==3){
            puz5score = 60;
          }
          else if(presses==4){
            puz5score = 20;
          }
          else{
            puz5score = 0;
          }
          Puzzlescores[4] = puz5score;
          router.push({ pathname: "/puzzlescreen6", params: {time: time, puzzleScores: JSON.stringify(Puzzlescores), uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize, difficulties: JSON.stringify(difficulties) }});
      } else {
          Alert.alert("Incorrect, Try again.");
      }
  }
  //the visual components
  return (
    <View style={styles.maincontainer}>
        <View style={[styles.subcontainer,{marginTop:20}]}>
            <Text style={styles.logotext}>Shapes</Text>
        </View>
        <View style={styles.sub2container}>
          <View style={styles.backdrop}>{grid}</View>
        </View>
        <View style={styles.sub3container}>
            <Text style={styles.logotext}>{time}s</Text>
            <Text style={[styles.text,{paddingBottom:5}]}>{hinttext}</Text>
            <View style={styles.ansrow1}>
                {/* Answer tiles */}
                <TouchableOpacity key={'1'} style={styles.anssquare} onPress={() => ansr(options[0].colour, options[0].shape)}>
                  <Ionicons name={options[0].shape as any} size={34} color={options[0].colour} />
                </TouchableOpacity>
                <TouchableOpacity key={'2'} style={styles.anssquare} onPress={() => ansr(options[1].colour, options[1].shape)}>
                  <Ionicons name={options[1].shape as any} size={34} color={options[1].colour} />
                </TouchableOpacity>
            </View>
            <View style={styles.ansrow2}>
              {/* Answer tiles */}
                <TouchableOpacity key={'3'} style={styles.anssquare} onPress={() => ansr(options[2].colour, options[2].shape)}>
                  <Ionicons name={options[2].shape as any} size={34} color={options[2].colour} />
                </TouchableOpacity>
                <TouchableOpacity key={'4'} style={styles.anssquare} onPress={() => ansr(options[3].colour, options[3].shape)}>
                  <Ionicons name={options[3].shape as any} size={34} color={options[3].colour} />
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
  backdrop:{
    borderRadius:25,
    backgroundColor:"#3c5290",
    justifyContent:"space-evenly",
    marginRight:30,
    paddingLeft:8,
    paddingTop:10,
    paddingBottom:10,
    padding:1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  anssquare: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#273d85',
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