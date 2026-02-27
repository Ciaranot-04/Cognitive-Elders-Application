/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles2 from '../puzzles/puzzles2.json';

//our function component for this page, the logical stuff
export default function puz2() {
  //pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const besttime = params.besttime as string;
  const carriedtime = Number(params.time);
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

  //get a random puzzle from the selection available in puzzles2.JSON
  const [puzzlelog] = React.useState(() => {
    //return a map of all puzzles
    return puzzles2.patterns.map(puz => ({
      id: puz.id,
      answer: puz.answer,
      layout: puz.layout,
    }));
  });
  //generates the random number and chooses based on the id
  const [userspuzzle] = React.useState(() => {
    const i = Math.floor(Math.random() * puzzlelog.length);
    return puzzlelog[i];
  });

  //create a count down
  const [countdown, setCountdown] = React.useState(3);
  //function to start the colour sequence, set out of bounds for now
  const [index, setIndex] = React.useState(-1);
  //(ChatGPT suggested and helped with the idea of phases)
  const [phase, setPhase] = React.useState<'countdown' | 'show' | 'answer'>('countdown');

  //store the layout and answer
  const layout = userspuzzle.layout;
  const answer = userspuzzle.answer;

  //here we set up our timer, it is the next page so it starts at the time frm the previous page, it increments every second
  const [time, settime] = React.useState(carriedtime); React.useEffect(() => {setInterval(() => {settime(prev => prev + 1);},1000);return () => clearInterval(time);
  }, []);

  //perform countdown when the page loads
  React.useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      //once done we enter the sequence phase
      setPhase('show');
      setIndex(0);
      return;
    }
    //the timing intervals for the changing of the tiles
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  //makes answer tiles show once the sequence is done
  React.useEffect(() => {
    if (phase !== 'show') return;
    if (index >= layout.length) {
      setPhase('answer');
      return;
    }
    //rest the countdown timer
    const t = setTimeout(() => setIndex(i => i + 1), 1500);
    return () => clearTimeout(t);
  }, [index, phase]);

  //handle answers
  function answered(colour: string) {
    //if correct go to next puzzle screen
    if (colour === answer) {
      router.push({ pathname: "/puzzlescreen3", params: { time: time, uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize }});
    } else {
      //if wrong redo the sequence again
      Alert.alert("Incorrect, Try again.");
      setIndex(-1);
      setPhase('countdown');
      setCountdown(3);
    }
  }
  //start and end tile black
  const colour = index === -1 ? 'black' : (index < layout.length ? layout[index] : 'black');

  return (
    //the visual components
    <View style={styles.maincontainer}>
      <View style={[styles.subcontainer, { marginTop: 20 }]}>
        <Text style={styles.logotext}>Squares</Text>
      </View>

      <View style={styles.sub2container}>
        <Text style={styles.text}>{phase === 'countdown' ? countdown : "Memorise"}</Text>
        <View style={[styles.tile, { backgroundColor: colour }]} />
      </View>

      <View style={styles.sub3container}>
        <Text style={styles.logotext}>{time}</Text>
        <Text style={styles.text}>Memorise the colour that appears the most!</Text>
        {phase === 'answer' && (
          <View style={styles.row}>
            {["red", "green", "blue", "orange", "yellow"].map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => answered(color)}
                style={[styles.answer, { backgroundColor: color}]}
              />
            ))}
          </View>
        )}
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
    marginTop: 100,
    marginBottom: 30,
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub3container:{
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tile:{
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  text:{
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 20,
    textShadowColor:'rgba(0,0,0,0.8)',
    textShadowOffset:{ width:1,height:1},
    textAlign: 'center',
  },
  row:{
    flexDirection: 'row', 
    marginTop: 20, 
    justifyContent: 'space-around', 
    width: '90%',
  },
  answer:{
    width: 60,
    height: 60,
    borderRadius: 10,
  }
});
