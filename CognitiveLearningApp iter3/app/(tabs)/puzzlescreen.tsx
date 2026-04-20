/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 20/04/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles.json';

//our function component for this page, the logical stuff
export default function puz1() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  //if for some reason no difficulty is set
  const defaultdiff = {
    logic: "easy",
    numeracy: "easy",
    memory: "easy",
    language: "easy",
    visual: "easy",
  };
  const difficulties = params.difficulties ? JSON.parse(params.difficulties as string) : defaultdiff;
  const uid = params.uid as string;
  const email = params.email as string;
  let textsize = params.textsize as string;
  const difficulty = difficulties.visual || "easy";
  let puz1score = 0;
  let puzzleScores = [0,0,0,0,0,0,0,0];

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

  //square size adjust so fit on screen
  let squaresize = 0;
  if(difficulty=="easy"){
    squaresize = 50;
  }
  if(difficulty=="medium"){
    squaresize = 45;
  }
  if(difficulty=="hard"){
    squaresize = 45;
  }

  //added time due to difficulty
  let extratime = 0;
  if(difficulty=="easy"){
    extratime = 0;
  }
  if(difficulty=="medium"){
    extratime = 8;
  }
  if(difficulty=="hard"){
    extratime = 15;
  }

  //here we set up our timer, it is the first page so it starts at 0, it increments every second
  const [time, settime] = React.useState(0); React.useEffect(() => {const timer = setInterval(() => {settime(prev => prev + 1);},1000);return () => clearInterval(timer);
    }, []);
  const [pagetime, settimep] = React.useState(0); React.useEffect(() => {const pagetimer = setInterval(() => {settimep(prev => prev + 1);},1000);return () => clearInterval(pagetimer);
    }, []);

  //here we select a pattern from the JSON file puzzles.json
  const [pattern] = React.useState(() => {
    const patterns = puzzles.patterns;

    let start = 0;
    let end = 10;

    if(difficulty=="medium"){
      start = 10;
      end = 20;
    }
    if(difficulty=="hard"){
      start = 20;
      end = 30;
    }

    const i = Math.floor(Math.random() * (end - start)) + start;
    return patterns[i];
  });

  //grid variables setup using use states
  const [gridsaved, gridsetter] = React.useState<string[][]>(
    pattern.layout.map(row => [...row])
  );
  const [remaining, setcolours] = React.useState<string[]>(gridsaved.flat());
  const grid = [];
  //set up the variables and their set functions using use states
  const [first, setf] = React.useState<string | null>(null);
  const [second, sets] = React.useState<string | null>(null);
  const [frowcol, setrowcol] = React.useState<[number, number] | null>(null);

  //once all squares have been matched, redirect the user to the next puzzle screen
  React.useEffect(() => {
        if (remaining.length === 0) {
          if (pagetime >= 75 + extratime){
              puz1score = 0;
          } 
          else if (pagetime >= 60 + extratime){
              puz1score = 5;
          } 
          else if (pagetime >= 45 + extratime){
              puz1score = 20;
          } 
          else if (pagetime >= 30 + extratime){
              puz1score = 40;
          } 
          else if (pagetime >= 20 + extratime){
              puz1score = 60;
          } 
          else if (pagetime >= 10 + extratime){
              puz1score = 80;
          } 
          else {
              puz1score = 100;
          }
          puzzleScores[0] = puz1score;
          router.push({ pathname: "/puzzlescreen2", params: { uid: uid, email: email, textsize: textsize, difficulties: JSON.stringify(difficulties), time: time, puzzleScores: JSON.stringify(puzzleScores) }});
        }
      },[remaining]);

  //the function to check when a tile is pressed, we see if its the first tile, if so remember that, if its the second one, compare them
  function ispressed(row: number, col: number, colour: string) {
    //this is to avoid taps of the invisible tiles
    if(!remaining.includes(colour)){return};
    //if its the first touch
    if(!first) {
      //remember the colour
      setf(colour);
      //remember its coords in the array
      setrowcol([row, col]);
    } 
    //if its the second touch
    else if(!second) {
      //set the second colour
      sets(colour);
      //get the position of the first tile
      const [frow, fcol] = frowcol!;
      //if they do not match reset
      if(first !== colour) {
        setf(null);
        sets(null);
        return;
      }
      //if its the same tile
      if((frow===row)&&(fcol===col)){
        setf(null);
        sets(null);
        return;
      }
      //otherwise its a match so we set them transparent
      gridsetter(l => {
      const newg = l.map(row => [...row]);
      newg[frow][fcol] = "transparent";
      newg[row][col] = "transparent";
      return newg;
      });
      //we remove the colours from the remaining array
      setcolours(l => {
        const remaining2 = [...l];
        remaining2.splice(remaining2.indexOf(colour), 1);
        remaining2.splice(remaining2.indexOf(colour), 1);
        return remaining2;
      });
      //full reset of variables
      setrowcol(null);
      setf(null);
      sets(null);
    }
  }
  //for loop to draw the tiles to the screen
  for(let i=0;i<gridsaved.length;i++){
    // get the current row from the grid array
    const row = gridsaved[i];
    const gridrows = [];
    for(let j=0; j<row.length;j++) {
      //loop through all colours in the row and assign them a tile
      const colour = row[j];
      gridrows.push(
      <TouchableOpacity key={`${i}-${j}`} style={[styles.square,{backgroundColor:colour,width:squaresize,height:squaresize}]} onPress={() => ispressed(i,j,colour)}/>);
    }
    //display it on the screen
    grid.push(
    <View key={i} style={styles.col}>
      {gridrows}
    </View>
  );
  }
  return (
    //the visual components
    <View style={styles.maincontainer}>
        <View style={[styles.subcontainer,{marginTop:20}]}>
            <Text style={styles.logotext}>Shapes</Text>
        </View>
        <View style={styles.sub2container}>
          <Text style={styles.text}>Select the colours that Match!</Text>
          <View style={styles.row}>{grid}</View>
        </View>
        <View style={styles.sub3container}>
            <Text style={styles.logotext}>{time}s</Text>
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
    marginTop: 80,
    flex: 5,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  row: {
    justifyContent: 'center',
    flexDirection: "row",
  },
  col: {
    justifyContent: 'center',
    flexDirection: "column",
  },
  sub3container:{
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  square: {
    width: 50,
    height: 50,
    margin: 4,
    borderRadius: 10,
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