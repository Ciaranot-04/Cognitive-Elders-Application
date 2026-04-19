/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles8.json';

export default function puz8() {
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const email = params.email as string;
  const besttime = params.besttime as string;
  const carriedtime = Number(params.time);

  const [selectedp] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * puzzles.patterns.length);
    return puzzles.patterns[randomIndex];
  });

  const [sentence] = React.useState(selectedp.sentence);
  const [correctanswer] = React.useState(selectedp.answer);
  const [options] = React.useState<string[]>(selectedp.options);

  let textsize = params.textsize as string;
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  let puz8scores = 0;

  const [attempts, setattempts] = React.useState(1);
  const [message, setmessage] = React.useState('');

  // text size logic
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

  // timer
  const [time, settime] = React.useState(carriedtime);
  React.useEffect(() => {
    const timer = setInterval(() => {
      settime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const submit = (selectedOption: string) => {
    if (selectedOption.toLowerCase() === correctanswer.toLowerCase()) {
      setmessage('Correct!');

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
      Puzzlescores[7] = puz8scores;
      router.push({
        pathname: "/puzzlescreen3",
        params: { time: time, puzzleScores: JSON.stringify(Puzzlescores), uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize}
      });
    } 
    else {
      setmessage('Wrong answer, try again.');
      setattempts((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.subcontainer, { marginTop: 20 }]}>
        <Text style={styles.logotext}>Squares</Text>
      </View>

      <View style={styles.sub2container}>
        <Text style={[styles.subtitle, { fontSize: 18 + textsizenumber, marginBottom: 25  }]}>Pick the correct word</Text>
        <View style={styles.puzzlesec}>
          <Text style={[styles.questionText, { fontSize: 24 + textsizenumber }]}>
            {sentence}
          </Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => submit(option)}
            >
              <Text style={[styles.optionText, { fontSize: 18 + textsizenumber }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.sub3container}>
        <Text style={[styles.text, { fontSize: 18 + textsizenumber }]}>
          {message}
        </Text>
        <Text style={[styles.logotext, { fontSize: 24 + textsizenumber }]}>
          {time}s
        </Text>
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
    backgroundColor: '#5b84e6',
    borderRadius: 16,
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