/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 20/04/2026
*/

//import important and used modules
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles8.json';

export default function puz2() {
  //all passed params become constants
  const params = useLocalSearchParams();
  const uid = params.uid as string;
  const email = params.email as string;
  const carriedtime = Number(params.time);
  let textsize = params.textsize as string;
  //puzzle score array tracking
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  let puz8scores = 0;
  //if for some reason no difficulty is set
  const defaultdiff = {
    logic: "easy",
    numeracy: "easy",
    memory: "easy",
    language: "easy",
    visual: "easy",
  };
  const difficulties = params.difficulties ? JSON.parse(params.difficulties as string) : defaultdiff;
  const difficulty = difficulties.language || "easy";

  //choose the puzzle once so incase of refresh it doesn't change
  const [selectedp] = React.useState(() => {
    const filtered = puzzles.patterns.filter((pattern) => pattern.difficulty === difficulty);
    const puzzlepool = filtered.length > 0 ? filtered : puzzles.patterns;
    //select random puzzle
    const randomi = Math.floor(Math.random() * puzzlepool.length);
    return puzzlepool[randomi];
  });

  //components pulled from the json file
  const [sentence] = React.useState(selectedp.sentence);
  const [correctanswer] = React.useState(selectedp.answer);
  const [options] = React.useState<string[]>(selectedp.options);
  const [attempts, setattempts] = React.useState(1);
  const [message, setmessage] = React.useState('');

  //text size scaling
  let textsizenumber = 0;
  if (textsize == "Larger") {
    textsizenumber = 5;
  }
  if (textsize == "Smaller") {
    textsizenumber = -5;
  }
  if (textsize == "Default") {
    textsizenumber = 0;
  }

  //keep the timer running from its last left off number
  const [time, settime] = React.useState(carriedtime);
  React.useEffect(() => { const timer = setInterval(() => { settime((prev) => prev + 1);}, 1000);
    return () => clearInterval(timer);
  }, []);

  //answer submission handler
  const submit = (selectedOption: string) => {
    if (selectedOption.toLowerCase() === correctanswer.toLowerCase()) {
      setmessage('Correct!');
      //check the attempt count
      if (attempts >= 7) {
        puz8scores = 0;
      } 
      else if (attempts >= 6) {
        puz8scores = 5;
      } 
      else if (attempts >= 5) {
        puz8scores = 20;
      } 
      else if (attempts >= 4) {
        puz8scores = 40;
      } 
      else if (attempts >= 3) {
        puz8scores = 60;
      } 
      else if (attempts >= 2) {
        puz8scores = 80;
      } 
      else {
        puz8scores = 100;
      }
      //save score
      Puzzlescores[7] = puz8scores;
      //redirect to next page
      router.push({
        pathname: "/puzzlescreen3",
        params: { time: time, puzzleScores: JSON.stringify(Puzzlescores), uid: uid, email: email, textsize: textsize, difficulties: JSON.stringify(difficulties)}
      });
    } 
    else {
      //notify it is wrong and increment attempts
      setmessage('Wrong answer, try again.');
      setattempts((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.subcontainer, { marginTop: 20 }]}>
        <Text style={styles.logotext}>Shapes</Text>
      </View>
      {/* choose option */}
      <View style={styles.sub2container}>
        <Text style={[styles.subtitle, { fontSize: 18 + textsizenumber, marginBottom: 25  }]}>Pick the correct word</Text>
        <View style={[styles.puzzlesec,{marginBottom:20}]}>
          <Text style={[styles.questionText, { fontSize: 24 + textsizenumber }]}>{sentence}</Text>
          {options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton} onPress={() => submit(option)}>
              <Text style={[styles.optionText, { fontSize: 18 + textsizenumber }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.sub3container}>
        {/* notification message */}
        <Text style={[styles.text, { fontSize: 18 + textsizenumber }]}>{message}</Text>
        {/*display time */}
        <Text style={[styles.logotext, { fontSize: 24 + textsizenumber }]}>{time}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logotext: {
    fontSize: 26,
    color: '#ffffff',
    fontFamily: 'verdana',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    fontWeight: 'bold',
    textShadowRadius: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textAlign: 'center',
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#759cf6',
    justifyContent: 'center',
    padding: 20,
  },
  subcontainer: {
    paddingTop: 40,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sub2container: {
    flex: 3,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub3container: {
    flex: 4,
    marginTop: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
  },
  puzzlesec: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    minHeight: 550,
    backgroundColor: '#5b84e6',
    borderRadius: 16,
    marginBottom:40
  },
  questionText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  optionButton: {
    width: '80%',
    backgroundColor: '#405ba5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'verdana',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginBottom: 20,
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textAlign: 'center',
  },
});