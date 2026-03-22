/*
Student Name: Ciaran O' Toole
Student ID: C00297672
Date: 27/02/2026
*/

//NOTE THIS PAGE IS NOT USED RIGHT NOW

//import important and used modules
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//our function component for this page, the logical stuff
export default function Account() {
  
  return (
    //the visual components
    <View style={styles.maincontainer}>
        <View style={styles.subcontainer}>
            <TouchableOpacity onPress={() => router.push('/home')}><Ionicons name="arrow-back-circle-outline" size={40} color="#ffffff" /></TouchableOpacity>
            <Text style={styles.logotext}>Squares</Text>
        </View>
        <View style={styles.sub2container}>
            <Text style={styles.logotext}>Squares</Text>
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
    flex: 0.5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sub2container:{
    flex: 9,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});