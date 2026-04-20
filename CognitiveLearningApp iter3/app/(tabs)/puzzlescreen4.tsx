/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles4.json';

//our function component for this page, the logical stuff
export default function puz4() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const [presses, setPresses] = React.useState(1);
  const email = params.email as string;
  const carriedtime = Number(params.time);
  const besttime = params.besttime as string;
  let textsize = params.textsize as string;
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  let puz4score = 0;
  const defaultdiff = {
    logic: "easy",
    numeracy: "easy",
    memory: "easy",
    language: "easy",
    visual: "easy",
  };
  const difficulties = params.difficulties ? JSON.parse(params.difficulties as string) : defaultdiff;
  const difficulty = difficulties.language || "easy";


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
  //generate random puzzle
  const [pattern] = React.useState(() => {
      const filteredpatterns = puzzles.patterns.filter((pattern) => pattern.difficulty === difficulty);
      const puzzlepool = filteredpatterns.length > 0 ? filteredpatterns : puzzles.patterns;
      const i = Math.floor(Math.random() * puzzlepool.length);
      return puzzlepool[i];
  });

  //here we set up our timer, it is the next page so it starts at the time frm the previous page, it increments every second
  const [time, settime] = React.useState(carriedtime); React.useEffect(() => {const timer = setInterval(() => {settime(prev => prev + 1);},1000);return () => clearInterval(timer);
    }, []);

  //note down the variables from the puzzles4.json, we take the answer, incorrect, pattern
  const [answer] = React.useState(pattern.answer);
  const [col] = React.useState(pattern.col);
  const [wrong1] = React.useState(pattern.wrong1);
  const [wrong2] = React.useState(pattern.wrong2);
  const [wrong3] = React.useState(pattern.wrong3);
  const [wrong4] = React.useState(pattern.wrong4);
  const [wrong5] = React.useState(pattern.wrong5);
  const options = [wrong3, wrong1, answer, wrong2, wrong4, wrong5];

  //grid setup
  const [gridsaved, gridsetter] = React.useState<string[][]>(pattern.layout);
  const grid = [];
  //put the pattern on the screen, similar loop to the previous screen
  for(let i=0;i<gridsaved.length;i++){
      const row = gridsaved[i];
      const gridrows = [];
      for(let j=0; j<row.length;j++) {
      const colour = row[j];
      gridrows.push(
      <TouchableOpacity key={j} style={[styles.square,{backgroundColor:colour}]}/>);
      }
      grid.push(
      <View key={i} style={styles.row}>
          {gridrows}
      </View>
      );
  }
  function answers(value: number) {
      setPresses(prev => prev + 1);
      //if right move next
      if (value === answer) {
          if(presses==1){
              puz4score = 100;
            }
            else if(presses==2){
              puz4score = 80;
            }
            else if(presses==3){
              puz4score = 60;
            }
            else if(presses==4){
              puz4score = 20;
            }
            else{
              puz4score = 0;
            }
            Puzzlescores[3] = puz4score;
          router.push({ pathname: "/puzzlescreen5", params: { difficulties: JSON.stringify(difficulties), puzzleScores: JSON.stringify(Puzzlescores), time: time, uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }});
      } else {
        //wrong notice
        Alert.alert("Incorrect, Try again.");
      }
  }
  return (
    //the visual components
    <View style={styles.maincontainer}>
        <View style={[styles.subcontainer,{marginTop:20}]}>
            <Text style={styles.logotext}>Shapes</Text>
        </View>
        <View style={styles.sub2container}>
            {grid}
        </View>
        <View style={styles.sub3container}>
            <Text style={styles.logotext}>{time}s</Text>
            <Text style={styles.text}>How many lighter tiles are there?</Text>
            <View style={styles.ansrow1}>
                <TouchableOpacity key={'1'} style={[styles.anssquare, { backgroundColor: '#273d85' }]} onPress={() => answers(options[0])}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {options[0]}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity key={'2'} style={[styles.anssquare, { backgroundColor: '#273d85' }]} onPress={() => answers(options[1])}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {options[1]}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity key={'3'} style={[styles.anssquare, { backgroundColor: '#273d85' }]} onPress={() => answers(options[2])}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {options[2]}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.ansrow2}>
                <TouchableOpacity key={'4'} style={[styles.anssquare, { backgroundColor: '#273d85' }]} onPress={() => answers(options[3])}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {options[3]}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity key={'5'} style={[styles.anssquare, { backgroundColor: '#273d85' }]} onPress={() => answers(options[4])}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {options[4]}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity key={'6'} style={[styles.anssquare, { backgroundColor: '#273d85' }]} onPress={() => answers(options[5])}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                        {options[5]}
                    </Text>
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
    marginLeft: 7,
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