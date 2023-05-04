
import React, { useEffect, useRef, useState } from 'react';
import {View,Text,TextInput, Alert,Button,Image,Modal,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';


const db=SQLite.openDatabase('Uganda');
const PinAccess=({navigation})=>{

    const inputRefs = useRef([]);
    const focusPreviousField = (index) => {
        if (index > 0) {
                inputRefs.current[index - 1].focus();
        
        }
      };

      const  focusNewField = (index) => {
            inputRefs.current[index + 1].focus();
        }

  const [field1,setField1]=useState('');
  const [field2,setField2]=useState('');
  const [field3,setField3]=useState('');
  const [field4,setField4]=useState('');

  const[wronPin,setWrongPin]=useState(false);
  const [blueTick,setBlueTick]=useState(false);
//   const [field5,setField5]=useState('');
//   const [field6,setField6]=useState('');


//   const focusInput1 = (text) => {
//     inputRef1.current.focus();
    
//   };

//   const focusInput2 = (text) => {
    
//     inputRef2.current.focus();
//   };
//   const focusInput3 = (text) => {
//     setField3(text);
//     inputRef3.current.focus();
//   };

//   const focusInput4 = (text) => {
    
//     inputRef4.current.focus();
//   };
//   const focusInput5 = (text) => {
    
//     inputRef5.current.focus();
//   };
 
 
  const Validate=async ()=>
  {
    if(field1==''||field2==''||field3==''||field4=='')
    {
      Alert.alert('WARNING','Please Enter All fields');
    }
 else{
    try{
      
        const jsonValue=await AsyncStorage.getItem('Pin');
        const output=jsonValue != null ? JSON.parse(jsonValue) : null;
      if(output!=null)
      {
      
        const pin=[field1,field2,field3,field4];
        const sameValues = pin.every((element, index) => element === output[index]);
        if(sameValues)
        {
         
          navigation.navigate('Well Log Forms') ;
          setField1('');
          setField2('');
          setField3('');
          setField4('');
        }
        else{
          setWrongPin(true);
          setTimeout(()=>
          {
            setWrongPin(false);
          },2000)
          setField1('');
          setField2('');
          setField3('');
          setField4('');
        }
      }
      else{
       setNoData(true);
       setTimeout(()=>
       {
        setNoData(false);
       },1000)
      }
      }
      catch(error)
      {
        console.log(error)
      }
   
  }
   
  }
//   const update=async ()=>
//   {
//     try{
//         await AsyncStorage.removeItem('Pin');
//         navigation.navigate('PIN');
//     }
//     catch(error)
//     {
//         console.log(error)
//     }
   
//   }

  return(
    <View style={{flex:1,alignItems:'center'}}>
      
             <View>
                <View style={{flexDirection:'row',marginTop:'30%'}}>
        <Text style={{fontSize:20,fontWeight:'500',marginTop:12}}>ENTER YOUR PIN</Text>
          <Image source={require('../assets/lockIcon.png')} style={{height:50,width:50}}/>
        </View>
        <Text></Text>
      <View style={{flexDirection:'row'}}>
        
    <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput keyboardType="numeric" maxLength={1} secureTextEntry={true}
      style={[
        styles.pinInput,
        { borderRadius: field1 ? 10 : 0, backgroundColor: field1 ? '#fff' : '#ddd' },
      ]}
      value={field1}
        ref={(ref) => inputRefs.current[0] = ref}
        onKeyPress={({ nativeEvent, target }) => {
          if (nativeEvent.key === 'Backspace') {
            focusPreviousField(inputRefs.current.indexOf(target));
          }
          else
         {
            focusNewField(inputRefs.current.indexOf(target))
         }
        }}
       onChangeText={(text)=>
        {
            setField1(text);
            // if(text!='')
            // {
            //     inputRef1.current.focus();
            //     setField1(text);
            // }
            // else
            // {
            //     inputRef.current.focus();
            // }
    }}/>
    </View>
    <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric"   maxLength={1}  secureTextEntry={true}
      value={field2}
      style={[
        styles.pinInput,
        { borderRadius: field2 ? 10 : 0, backgroundColor: field2 ? '#fff' : '#ddd' },
      ]}
       ref={(ref) => inputRefs.current[1] = ref}
       onKeyPress={({ nativeEvent, target }) => {
         if (nativeEvent.key === 'Backspace') {
           focusPreviousField(inputRefs.current.indexOf(target));
         }
         else
         {
            focusNewField(inputRefs.current.indexOf(target))
         }
       }}
        onChangeText={(text)=>
            {
                setField2(text);
                // if(text!='')
                // {
                //     inputRef2.current.focus();
                //     setField2(text);
                // }
                // else
                // {
                //     inputRef1.current.focus();
                // }
        }}
      />
    </View>
    <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center',marginRight:10}} >
      <TextInput keyboardType="numeric"  maxLength={1} secureTextEntry={true}
      value={field3}
      style={[
        styles.pinInput,
        { borderRadius: field3 ? 10 : 0, backgroundColor: field3 ? '#fff' : '#ddd' },
      ]}
        ref={(ref) => inputRefs.current[2] = ref}
        onKeyPress={({ nativeEvent, target }) => {
          if (nativeEvent.key === 'Backspace') {
            focusPreviousField(inputRefs.current.indexOf(target));
          }
          else
         {
            focusNewField(inputRefs.current.indexOf(target))
         }
        }}
        onChangeText={(text)=>
            {
                setField3(text);
                // if(text!='')
                // {
                //     inputRef3.current.focus();
                //     setField3(text);
                // }
                // else
                // {
                //     inputRef2.current.focus();
                // }
        }}/>
    </View>
    <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput keyboardType="numeric"  maxLength={1} secureTextEntry={true}
      value={field4}
      style={[
        styles.pinInput,
        { borderRadius: field4 ? 10 : 0, backgroundColor: field4 ? '#fff' : '#ddd' },
      ]}
       ref={(ref) => inputRefs.current[3] = ref}
      onKeyPress={({nativeEvent,target})=>{
        if (nativeEvent.key === 'Backspace') {
            focusPreviousField(inputRefs.current.indexOf(target));
          }
          else
          {
            focusNewField(inputRefs.current.indexOf(target))
          }
      }}
      
      onChangeText={(text)=>{setField4(text);}}

      />
    </View>
    <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center',marginRight:10,display:'none'}}>
      <TextInput style={{fontSize:20}} keyboardType="numeric"  maxLength={1} secureTextEntry={true}
         ref={(ref) => inputRefs.current[4] = ref}
         onFocus={()=>Validate()}
         onKeyPress={({nativeEvent,target})=>{
            if (nativeEvent.key === 'Backspace') {
                focusPreviousField(inputRefs.current.indexOf(target));
              }
          }}
      />
    </View>
    {/* <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput style={{fontSize:20}} keyboardType="numeric" ref={inputRef4}  maxLength={1} secureTextEntry={true}
        onChangeText={(text)=>
            {
                if(text!='')
                {
                    inputRef5.current.focus();
                    setField5(text);
                }
                else
                {
                    inputRef4.current.focus();
                }
        }}
      />
    </View>
    <View style={{height:45,width:45,borderBottomWidth:1,borderBottomColor:'grey',justifyContent:'center',alignItems:'center'}}>
      <TextInput style={{fontSize:20}} keyboardType="numeric" ref={inputRef5}  maxLength={1} secureTextEntry={true}  onChangeText={(text)=>{setField6(text)}}  />
    </View> */}
    </View>
</View>

    <Text></Text>
    <Modal visible={wronPin} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/wrong1.png')} style={{height:30,width:30}}/>
            <Text
            style={{fontSize:20,color:'#fff',fontWeight:'bold'}}
            >Sorry You Entered Wrong Pin</Text>
            </View>
                  </Modal>
                  <Modal visible={blueTick} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/right.png')} style={{height:'10%',width:'10%'}}/>
            <Text
            style={{fontSize:24,color:'#fff',fontWeight:'bold'}}
            >Sucess</Text>
            </View>
                  </Modal>

    </View>
   
  )
}

const styles=StyleSheet.create({
  pinInput: {
    width: 50,
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
})
export default PinAccess;