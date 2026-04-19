/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db } from "./config";

// Component
export default function Account() {

  const params = useLocalSearchParams();
  const uid = params.uid as string;
  const email = params.email as string;
  const selectedDate = params.date as string;
  const [userName, setUserName] = useState<string>("");
  let textsize = params.textsize as string;

  const [performance, setPerformance] = useState<{ [key: string]: number } | null>(null);
  const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    async function fetchPerformance() {
          try {
            // Fetch user document to get their name
            const userDocRef = collection(db, "Users");
            const userSnapshot = await getDocs(query(userDocRef, where("uid", "==", uid)));

            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              setUserName(userData.FirstName); // store name in state
            } else {
              setUserName(""); // fallback if no name
            }

            // Fetch performance
            const perfCollection = collection(db, "Users", uid, "performances");
            const q = query(perfCollection, where("date", "==", selectedDate));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
              const docData = snapshot.docs[0].data();
              setPerformance({
                lang: Math.min(docData.lang || 0, 100),
                memory: Math.min(docData.memory || 0, 100),
                visual: Math.min(docData.visual || 0, 100),
                numeracy: Math.min(docData.numeracy || 0, 100),
                logic: Math.min(docData.logic || 0, 100),
              });
            } else {
              setPerformance(null);
            }
          } catch (error) {
            console.error("Error fetching performance:", error);
          }
        }

    fetchPerformance();
  }, [uid, selectedDate]);

  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.maincontainer}>
      <View style={styles.subcontainer}>
        <TouchableOpacity onPress={() => router.push({ pathname: "/home", params: { date: selectedDate, uid, email, textsize } })}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.logotext}>Squares</Text>
      </View>

      <View style={styles.sub2container}>
        <Text style={styles.logotext}>Scored Performance for {formatDate(selectedDate)}</Text>

        {performance ? (
          <BarChart
            data={{labels: Object.keys(performance),datasets: [{ data: Object.values(performance) as number[] }],}}
            width={screenWidth}
            height={350}
            yAxisLabel=""
            showValuesOnTopOfBars={true}
            fromZero={true}
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: "#307ced",
              backgroundGradientTo: "#307ced",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16,},
              propsForLabels: { fontSize: 12 },
            }}
            verticalLabelRotation={0}
            style={{ marginVertical: 10,borderRadius: 20}}
            segments={10}
          />
        ) : (
          <Text style={styles.subtitle}>No performance data for this date.</Text>
        )}
      </View>
    </View>
  );
}

// Styles
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
    marginBottom: 40,
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
    flex: 1,
    marginTop:30,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sub2container: {
    flex: 9,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});