import {View,Text,Pressable} from 'react-native';
import {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WellLogForms=({navigation})=>
{
    const [user,setUser]=useState('');
    const [pass,setPass]=useState('');

    

    useEffect(()=>{getData()},[])


    const getData=async ()=>
    {
        try{
            await AsyncStorage.getItem('Username').then(
                value=>{
                    if(value!=null)
                    {
                        setUser(value);
                    }
                }
            )
            await AsyncStorage.getItem('Password').then(
                value=>
                {
                    if(value!=null)
                    {
                        setPass(value);
                    }
                }
            )
        }
        catch(error)
        {
            console.log(error);
        }
    }

    const Logout=()=>
    {
        navigation.navigate('UserLogin');
    }

    return(
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'white',fontSize:24,marginBottom:80}}>{user}</Text>
            <Text style={{color:'white',fontSize:24}}>{pass}</Text>
            <Pressable
      onPress={Logout}
      style={({pressed})=>({backgroundColor:pressed? '#3a365d':'#1b0eaf'})}
      >
        <View style={{
  
    height:45,
    width:100,
    justifyContent:'center',
    alignItems:'center',
  }}>
        <Text style={{color:'white'}}>Logout</Text>
        </View>
      </Pressable>
        </View>
    )
}



export default WellLogForms;