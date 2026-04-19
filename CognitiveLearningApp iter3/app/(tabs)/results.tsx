/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection } from "firebase/firestore";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db } from "./config";

export default function results() {
  const params = useLocalSearchParams();
  const uid = params.uid as string;
  const email = params.email as string;
  let Puzzlescores = params.puzzleScores ? JSON.parse(params.puzzleScores as string) : new Array(8).fill(0);
  const carriedtime = Number(params.time);
  const time = carriedtime;
  let textsize = params.textsize as string;
  const lang = (Puzzlescores[6] + Puzzlescores[7]) / 2;
  const memory = Puzzlescores[1];
  const numeracy = (Puzzlescores[3] + Puzzlescores[5]) / 2;
  const visual = (Puzzlescores[0] + Puzzlescores[5]) / 2;
  const logic = (Puzzlescores[2] + Puzzlescores[4]) / 2;
  const dataforchart = { labels: ["Logic", "Numeracy", "Memory", "Language", "Visual"],
    datasets: [ { data: [logic, numeracy, memory, lang, visual], },],
  };
  let textsizenumber = 0;
  if (textsize == "Larger") {
    textsizenumber = 5;
  }
  if (textsize == "Default") {
    textsizenumber = 0;
  }
  if (textsize == "Smaller") {
    textsizenumber = -5;
  }


  async function userdaylog() {
  try {
    const today = new Date();
    const todays = today.toISOString().split("T")[0];

    const perf = collection(db, "Users", uid, "performances");
    await addDoc(perf, { date: todays, uid, lang, memory, visual, logic, numeracy, });
  } catch (error) {
    console.error("Error: ", error);
  }
}

React.useEffect(() => {
  if (uid) {
    userdaylog();
  }
}, []);


  function iconsetter(score: number) {
    if (score <= 40) {
      return <Ionicons name="arrow-down-circle" size={28} color="#cc0000" />;
    }
    if (score >= 80) {
      return <Ionicons name="arrow-up-circle" size={28} color="#00cc44" />;
    }
    return <Ionicons name="ellipse" size={20} color="#626060" />;
  }

return (
    <View style={styles.maincontainer}>
      <View style={styles.sub1container}>
        <Text style={[styles.logotext, { marginTop: 20, fontSize: 26 + textsizenumber }]}>Squares</Text>
      </View>
      <View style={styles.sub2container}>
        <Text style={[styles.logotext, { marginBottom: 20 }]}>Your Performance Scores Today</Text>
        <BarChart
          data={dataforchart}
          width={370}
          height={290}
          fromZero={true}
          yAxisLabel=""
          yAxisSuffix=""
          segments={5}
          showValuesOnTopOfBars={true}
          chartConfig={{
            backgroundGradientFrom: "#5f82ff",
            backgroundGradientTo: "#5f82ff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              stroke: "rgba(0, 0, 0, 0.2)",
            },
          }}
          style={styles.chart}
        />
        <View style={styles.irow}>
          {dataforchart.datasets[0].data.map((score, index) => (
            <View key={index} style={styles.ibox}>
              <Text style={[styles.iconLabel, { fontSize: 11}]}>
                {dataforchart.labels[index]}
              </Text>
              {iconsetter(score)}
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => router.push({ pathname: "/home", params: { time: time, uid: uid, email: email, textsize: textsize } }) } style={styles.playbutton} >
          <Text style={styles.buttont}>Return Home</Text>
        </TouchableOpacity>
        <View style={styles.bottomdesc}>
          <View style={styles.bottompiece}>
            <Ionicons name="arrow-up-circle" size={24} color="#00cc44" />
            <Text style={styles.bottext}>Difficulty will scale up</Text>
          </View>
          <View style={styles.bottompiece}>
            <Ionicons name="arrow-down-circle" size={24} color="#cc0000" />
            <Text style={styles.bottext}>Difficulty will scale down</Text>
          </View>
          <View style={styles.bottompiece}>
            <Ionicons name="ellipse" size={24} color="#626060" />
            <Text style={styles.bottext}>Difficulty will stay the same</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  logotext: {
    fontSize: 26,
    color: '#ffffff',
    fontFamily: 'verdana',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    fontWeight: 'bold',
    textShadowRadius: 4,
    textAlign: 'center',
  },
  playbutton: {
    backgroundColor: '#273d85',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowOpacity: 0.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
  },
  buttont: {
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    fontSize: 20,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'verdana',
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textAlign: 'center',
  },
  maincontainer: {
    flex: 1,
    backgroundColor: '#759eff',
    padding: 20,
  },
  sub1container: {
    paddingTop: 40,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sub2container: {
    flex: 8,
    justifyContent: 'center',
    padding: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  irow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  bottompiece: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  bottext: {
    color: 'white',
    fontFamily: 'verdana',
    marginLeft: 6,
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
  },
  ibox: {
    flex: 1,
    alignItems: 'center',
  },
  iconLabel: {
    color: 'white',
    fontFamily: 'verdana',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottomdesc: {
    alignItems: 'center',
    marginTop: 5,
  },
});