import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity, Text, StyleSheet ,Image, Alert } from 'react-native';

const LogoutButton = ({onPress}) => {
  return (
    <View >
    <TouchableOpacity onPress={()=>
    {
      Alert.alert('Message','Do you want to Logout?',
    [{text:'LOGOUT',onPress:onPress},
    {text:'CANCEL'}
  ])}} 
    style={styles.button}
    >
        <View style={{height:40,width:100,flexDirection:'row',marginRight:10,justifyContent:'center',alignItems:'center',borderRadius:2}}>
  
      <Image source={require('../assets/userLog2.png')} style={styles.img}/>

      </View>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
 img:{
  height:35,
  width:35,
  borderRadius:40,
 }
});

export default LogoutButton;
