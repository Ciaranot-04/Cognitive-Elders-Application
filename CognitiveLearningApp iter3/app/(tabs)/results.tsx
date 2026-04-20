/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
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

  const lang = 100;
  const memory = 100;
  const numeracy = 100;
  const visual = 100;
  const logic = 100;

  const dataforchart = {
    labels: ["Logic", "Numeracy", "Memory", "Language", "Visual"],
    datasets: [
      { data: [logic, numeracy, memory, lang, visual] },
    ],
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

  function nextDifficulty(current: string, score: number) {
    const levels = ["easy", "medium", "hard"];
    const currentIndex = levels.indexOf(current);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    if (score >= 80) {
      return levels[Math.min(safeIndex + 1, levels.length - 1)];
    }

    if (score <= 40) {
      return levels[Math.max(safeIndex - 1, 0)];
    }

    return levels[safeIndex];
  }

  function timecalc(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const calculation = secs < 10 ? `0${secs}` : secs;
    return `${mins}:${calculation}`;
  }

  const finishedtime = timecalc(carriedtime);

  async function updateUserDifficulties() {
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log("User not found");
        return;
      }

      const userData = userSnap.data();

      const currentDifficulties = userData.difficulties || {
        logic: "easy",
        numeracy: "easy",
        memory: "easy",
        language: "easy",
        visual: "easy",
      };

      const updatedDifficulties = {
        logic: nextDifficulty(currentDifficulties.logic, logic),
        numeracy: nextDifficulty(currentDifficulties.numeracy, numeracy),
        memory: nextDifficulty(currentDifficulties.memory, memory),
        language: nextDifficulty(currentDifficulties.language, lang),
        visual: nextDifficulty(currentDifficulties.visual, visual),
      };

      await updateDoc(userRef, {
        difficulties: updatedDifficulties,
      });
    } catch (error) {
      console.error("Error updating difficulties: ", error);
    }
  }

  async function updateBestTime() {
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log("User not found");
        return;
      }

      const userData = userSnap.data();
      const currentbest = userData.besttime;

      if (currentbest === undefined || currentbest === null) {
        await updateDoc(userRef, {
          besttime: carriedtime,
        });
        console.log("Best time created:", carriedtime);
        return;
      }

      if (carriedtime < Number(currentbest)) {
        await updateDoc(userRef, {
          besttime: carriedtime,
        });
        console.log(carriedtime);
      } else {
        console.log(currentbest);
      }
    } catch (error) {
      console.error("Error updating best time:", error);
    }
  }
  async function userdaylog() {
    try {
      const today = new Date();
      const todays = today.toISOString().split("T")[0];
      const perf = collection(db, "Users", uid, "performances");
      await addDoc(perf, { date: todays, Time: finishedtime, uid, lang, memory, visual, logic, numeracy,
      });
    } catch (error) {
      console.error("Error saving daily log: ", error);
    }
  }

  React.useEffect(() => {
    async function savedata() {
      if (uid) {
        await userdaylog();
        await updateUserDifficulties();
        await updateBestTime();
      }
    }
    savedata();
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
        <Text style={[styles.logotext, { marginTop: 20, fontSize: 26 + textsizenumber }]}>Shapes</Text>
      </View>
      <View style={[styles.sub2container, { overflow: "hidden" }]}>
        <Text style={[styles.logotext, { marginBottom: 10, paddingTop: 30 }]}>Your Scores Today</Text>
        <Text style={[styles.buttont, { marginBottom: 20, alignSelf: "center" }]}>Completion Time: {finishedtime}</Text>
        <BarChart
          data={dataforchart}
          width={370}
          height={350}
          yAxisLabel=""
          showValuesOnTopOfBars={true}
          fromZero={true}
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: "#171f59",
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
              <Text style={[styles.iconLabel, { fontSize: 11 }]}>
                {dataforchart.labels[index]}
              </Text>
              {iconsetter(score)}
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/home", params: { time: time, uid: uid, email: email, textsize: textsize } }) } style={styles.playbutton}>
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
    marginTop: 0,
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