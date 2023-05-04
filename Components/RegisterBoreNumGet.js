import React from 'react';
import {View,Text,Modal,InputText} from 'react-native';
import {useState} from 'react-native';

const RegisterBoreNumGet=()=>
{
    const [boreNumber,setBoreNumber]=useState('');

    const BoreNumber=(e)=>
    {
        setBoreNumber(e);
    }
    return(
        <Modal visible={props.visible}
        transparent
        animationType='slide'
        >
            <View style={styles.user}>
     <Text></Text> 
      <View style={styles.Field}>
      <Text style={{fontSize:20,}}> Please Entered RegisteBoreNumber </Text>
      <Text></Text>
      <Text></Text> 
      <View style={styles.Input}>
      <TextInput placeholder="RegisterBore Number" placeholderTextColor='grey' style={styles.InputText} onChangeText={BoreNumber}/>
      </View>
      <Text></Text>
      <Pressable
      onPress={Validate}
      style={({pressed})=>({backgroundColor:pressed? '#3a365d':'#1b0eaf'})}
      >
        <View style={styles.button}>
        <Text style={{color:'white'}}>Submit</Text>
        </View>
      </Pressable>
      </View>
        <Warning visible={warningVis} change={WarningMessage}/>
    </View>
        </Modal>
    )
}

export default RegisterBoreNumGet;