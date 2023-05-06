import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity, Text, StyleSheet ,Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LogoutButton = ({onPress}) => {
  return (
    <View >
    <TouchableOpacity onPress={()=>
    {
      Alert.alert('Message','Do you want to Logout?',
    [{text:'LOGOUT',onPress:onPress},
    {text:'CANCEL'}
  ])}} 
    >
        <View style={{height:40,width:100,flexDirection:'row',marginRight:10,justifyContent:'center',alignItems:'center',borderRadius:2}}>
             <Icon name="user-circle" size={27} color='#1e1e56'/>
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
