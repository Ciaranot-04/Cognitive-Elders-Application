/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import puzzles from '../puzzles/puzzles6.json';

export default function puz6() {
  // pull and assign variables from passed router push
  const params = useLocalSearchParams();
  const todaytime = params.todaytime as string;
  const uid = params.uid as string;
  const email = params.email as string;
  const besttime = params.besttime as string;
  const carriedtime = Number(params.time);
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
  let textsize = params.textsize as string;
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  let puz6scores = 0;
  const [attempts, setattempts] = React.useState(1);

  const filteredquestions = puzzles.patterns.filter((question) => question.difficulty == difficulty && question.answer != "");
  const randomquestion = React.useMemo(() => filteredquestions[Math.floor(Math.random() * filteredquestions.length)], []);
  const equation1 = randomquestion.equation1;
  const equation2 = randomquestion.equation2;
  const correctanswer = randomquestion.answer.toLowerCase();

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
  React.useEffect(() => { const timer = setInterval(() => { settime((prev) => prev + 1); }, 1000);
    return () => clearInterval(timer); }, []);


  // answer
  const [userAnswer, setuanswer] = React.useState('');
  const [message, setmessage] = React.useState('');

  // when user clicks submit
  const submit = () => {
    if (userAnswer.trim().toLowerCase() === correctanswer) {
      setmessage('Correct!');
      if (attempts >= 7) {
        puz6scores = 0;
      } 
      else if (attempts >= 6) {
        puz6scores = 5;
      } 
      else if (attempts >= 5) {
        puz6scores = 20;
      } 
      else if (attempts >= 4) {
        puz6scores = 40;
      } 
      else if (attempts >= 3) {
        puz6scores = 60;
      } 
      else if (attempts >= 2) {
        puz6scores = 80;
      } 
      else {
        puz6scores = 100;
      }
      Puzzlescores[5] = puz6scores;
      router.push({ pathname: "/puzzlescreen7", params: { difficulties: JSON.stringify(difficulties), time: time, puzzleScores: JSON.stringify(Puzzlescores), uid: uid, email: email, besttime: besttime, todaytime: todaytime, textsize: textsize } });
    } 
    else {
      setmessage('Wrong answer, try again.');
      setattempts(prev => prev + 1);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <View style={[styles.subcontainer, { marginTop: 20 }]}>
        <Text style={styles.logotext}>Shapes</Text>
      </View>
      <View style={styles.sub2container}>
        <Text style={[styles.subtitle, { fontSize: 19 + textsizenumber, marginBottom: 25 }]}>Solve for X!</Text>
        <View style={styles.puzzlesec}>
          <Text style={[styles.subtitle, { fontSize: 18 + textsizenumber }]}>Mathematics</Text>
          <Text style={[styles.scrambled, { fontSize: 32 + textsizenumber }]}>{equation1}</Text>
          <Text style={[styles.scrambled, { fontSize: 32 + textsizenumber }]}>{equation2}</Text>
          <TextInput style={[styles.input, { fontSize: 18 + textsizenumber }]} placeholder="Type your answer" placeholderTextColor="#d9e3ff" value={userAnswer} onChangeText={setuanswer} autoCapitalize="none" />
          <TouchableOpacity style={styles.submitb} onPress={submit}>
            <Text style={[styles.submitbt, { fontSize: 18 + textsizenumber }]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sub3container}>
        <Text style={[styles.text, { fontSize: 18 + textsizenumber,marginTop:40 }]}>{message}</Text>
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
    backgroundColor: '#759eff',
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
    marginTop:180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub3container: {
    flex: 4,
    marginTop:50,
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
  scrambled: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
    letterSpacing: 2,
  },
  input: {
    width: '80%',
    backgroundColor: '#3a569c',
    color: 'white',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    textAlign: 'center',
    fontFamily: 'verdana',
  },
  submitb: {
    width: '80%',
    backgroundColor: '#314d99',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  submitbt: {
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