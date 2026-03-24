/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles3.json';

//our function component for this page, the logical stuff
export default function puz3() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  const email = params.email as string;
  const besttime = params.besttime as string;
  const carriedtime = Number(params.time);
  let textsize = params.textsize as string;
  const [presses, setPresses] = React.useState(1);
  let puz3score = 0;

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

  //generate a random pattern for the puzzle from puzzles3.json
    const [pattern] = React.useState(() => {
        const layouts = puzzles.patterns;
        const i = Math.floor(Math.random() * layouts.length);
        return layouts[i];
    });

    //here we set up our timer, it is the next page so it starts at the time frm the previous page, it increments every second
    const [time, settime] = React.useState(carriedtime); React.useEffect(() => {setInterval(() => {settime(prev => prev + 1);},1000);return () => clearInterval(time);
      }, []);

    //get the right answers tiles coords in the array
    const [answeri] = React.useState<number>(pattern.answeri);
    const [answerj] = React.useState<number>(pattern.answerj);

    //grid setup ChatGPT helped here
    const [gridsaved] = React.useState<string[][]>(pattern.layout);
    const grid = [];
    const [, setsel] = React.useState<[number, number] | null>(null);


    //check the tile they pressed to see if it is correct
    function ispressed(row: number, col: number, colour: string) {
        setPresses(prev => prev + 1);
      //get array position
        setsel([row, col]);
        //if equal to the answer i and j pos, move to next puzzle
        if (row === answeri && col === answerj) {
            if(presses==1){
              puz3score = 100;
            }
            else if(presses==2){
              puz3score = 80;
            }
            else if(presses==3){
              puz3score = 60;
            }
            else if(presses==4){
              puz3score = 20;
            }
            else{
              puz3score = 0;
            }
            Puzzlescores[2] = puz3score;
            router.push({ pathname: "/puzzlescreen4", params: { puzzleScores: JSON.stringify(Puzzlescores), time: time, uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }});
        } 
        else {
            //otherwise rest
            setsel(null);
        }
  }
  //for loop to draw out the grid, similar to the one used in puzzle screen 1
  for(let i=0;i<gridsaved.length;i++){
    const row = gridsaved[i];
    const gridrows = [];
    for(let j=0; j<row.length;j++) {
      const colour = row[j];
      gridrows.push(
        //each tile when pressed runs the compare
      <TouchableOpacity key={`${i}-${j}`} style={[styles.square,{backgroundColor:colour}]} onPress={() => ispressed(i,j,colour)}/>);
    }
    grid.push(
    <View key={i} style={styles.row}>
      {gridrows}
    </View>
  );
  }
  return (
    //the visual components
    <View style={styles.maincontainer}>
        <View style={[styles.subcontainer,{marginTop:20}]}>
            <Text style={styles.logotext}>Squares</Text>
        </View>
        <View style={styles.sub2container}>
            {grid}
        </View>
        <View style={styles.sub3container}>
            <Text style={styles.text}>Find the odd one out!</Text>
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
    marginTop: 180,
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: "column",
  },
  sub3container:{
    flex: 6,
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