
import React, { useRef, useState } from 'react';
import {View,Text,TextInput, Alert,Button,Image,Modal,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const PinGeneration=({navigation})=>{
    const inputRefs = useRef([]);
    const focusPreviousField = (index) => {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      };

      const handleFirstFocus=()=>
      {
        inputRefs.current[0].focus();
      }

      const  focusNewField = (index) => {
        if (index >= 0) {
          inputRefs.current[index + 1].focus();
        }
      };

    useEffect(()=>
    {
        GetUsePin();
        handleFirstFocus()
    },[]);
  
 const GetUsePin=async ()=>
 {
    try{
        const jsonValue=await AsyncStorage.getItem('Pin');
      if(jsonValue != null)
      {
        navigation.replace('Access');
      }
      }
      catch(error)
      {
        console.log(error);
      }
 }

 const [confirmPin,setConfirmPin]=useState(false);
 const [pinCreated,setPinCreated]=useState(false)

  const [field1,setField1]=useState('');
  const [field2,setField2]=useState('');
  const [field3,setField3]=useState('');
  const [field4,setField4]=useState('');
//   const [field5,setField5]=useState('');
//   const [field6,setField6]=useState('');

  const [fieldSec1,setFieldSec1]=useState('');
  const [fieldSec2,setFieldSec2]=useState('');
  const [fieldSec3,setFieldSec3]=useState('');
  const [fieldSec4,setFieldSec4]=useState('');
//   const [fieldSec5,setFieldSec5]=useState('');
//   const [fieldSec6,setFieldSec6]=useState('');

 

//   const focusInput1 = (text) => {
//     inputRef1.current.focus();
       
//   };

 
  const CheckCreateAndConfirm =async () => 
  {
    if(field1==''||field2==''||field3==''||field4==''||fieldSec1==''||fieldSec2==''||fieldSec3==''||fieldSec4=='')
    {
      Alert.alert('WARNING','Please Enter All fields');
    }
 else
 {
    if(field1==fieldSec1&&field2==fieldSec2&&field3==fieldSec3&&field4==fieldSec4)
    {
        setPinCreated(true);
        setTimeout(()=>
        {
          setPinCreated(false)
        },1500)
        const pin=[field1,field2,field3,field4];
        try {
          const jsonValue=JSON.stringify(pin);
          await AsyncStorage.setItem('Pin',jsonValue);
        } catch (error) 
        {
          console.log(error);
        }
        setField1('');
        setField2('');
        setField3('');
        setField4('');
        setFieldSec1('');
        setFieldSec2('');
        setFieldSec3('');
        setFieldSec4('');
        navigation.navigate('Access');
       
        
    }
    else
    {
      setField1('');
      setField2('');
      setField3('');
      setField4('');
      setFieldSec1('');
      setFieldSec2('');
      setFieldSec3('');
      setFieldSec4('');
       setConfirmPin(true);
       setTimeout(()=>
       {
        setConfirmPin(false);
        handleFirstFocus();
      },2000)
    }
   
  }
}

  return(
    <View style={{flex:1,alignItems:'center'}}> 

       <Modal visible={confirmPin} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >Sorry Create Password And Confirm Password Does Not Match....</Text>
                         </View>
                               </Modal>

                               <Modal visible={pinCreated} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataSaveRight1.png')} style={{height:60,width:60}}/>
            <Text
            style={{fontSize:23,color:'#1af9ad',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Pin Generated Succefully.....</Text>
            </View>
                  </Modal>
<View>
<View style={{flexDirection:'row',marginTop:'10%'}}>
        <Text style={{fontSize:20,fontWeight:'500',marginTop:12}}>CREATE PIN</Text>
        <Image source={require('../assets/lockIcon.png')} style={{height:50,width:50}}/>
        </View>
        <Text></Text>

      <View style={{flexDirection:'row'}}>  
        
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric" maxLength={1}  secureTextEntry={true}
      value={field1}
      style={[
        styles.pinInput,
        { borderRadius: field1 ? 10 : 0, backgroundColor: field1 ? '#fff' : '#ddd' },
      ]}
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
onChangeText={(text)=>{ setField1(text)}}/>
    </View>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric"  maxLength={1}  secureTextEntry={true}
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
      onChangeText={(text)=>{ setField2(text)}}
      />
    </View>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}} >
      <TextInput  keyboardType="numeric" maxLength={1} secureTextEntry={true}
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
        onChangeText={(text)=>{ setField3(text)}}/>
    </View>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric"  maxLength={1} secureTextEntry={true}
       value={field4}
    
      style={[
        styles.pinInput,
        { borderRadius: field4 ? 10 : 0, backgroundColor: field4 ? '#fff' : '#ddd' },
      ]}
      ref={(ref) => inputRefs.current[3] = ref}
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
           setField4(text);
    }}
      />
    </View>
   
  
</View>          

</View>


<View style={{padding:45}}>
<View style={{flexDirection:'row'}}>
        <Text style={{fontSize:20,fontWeight:'500',marginTop:12}}>CONFIRM PIN</Text>
        <Image source={require('../assets/lockIcon.png')} style={{height:50,width:50}}/>
        </View>
        <Text></Text>

      <View style={{flexDirection:'row'}}>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric" maxLength={1}  secureTextEntry={true}
    value={fieldSec1}
  
      style={[
        styles.pinInput,
        { borderRadius: fieldSec1 ? 10 : 0, backgroundColor: fieldSec1 ? '#fff' : '#ddd' },
      ]}
      ref={(ref) => inputRefs.current[4] = ref}
      onKeyPress={({ nativeEvent, target }) => {
        if (nativeEvent.key === 'Backspace') {
          focusPreviousField(inputRefs.current.indexOf(target));
        }
        else
       {
          focusNewField(inputRefs.current.indexOf(target))
       }
      }}
      onChangeText={(text)=>{ setFieldSec1(text)}}
      />
    </View>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric"  maxLength={1}  secureTextEntry={true}
     value={fieldSec2}
  
      style={[
        styles.pinInput,
        { borderRadius: fieldSec2 ? 10 : 0, backgroundColor: fieldSec2 ? '#fff' : '#ddd' },
      ]}
ref={(ref) => inputRefs.current[5] = ref}
onKeyPress={({ nativeEvent, target }) => {
  if (nativeEvent.key === 'Backspace') {
    focusPreviousField(inputRefs.current.indexOf(target));
  }
  else
 {
    focusNewField(inputRefs.current.indexOf(target))
 }
}}
onChangeText={(text)=>{ setFieldSec2(text)}}
      />
    </View>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}} >
      <TextInput  keyboardType="numeric"   maxLength={1} secureTextEntry={true}
       value={fieldSec3}
    
      style={[
        styles.pinInput,
        {borderRadius: fieldSec3 ? 10 : 0,backgroundColor: fieldSec3 ? '#fff' : '#ddd' },
      ]}
ref={(ref) => inputRefs.current[6] = ref}
onKeyPress={({ nativeEvent, target }) => {
  if (nativeEvent.key === 'Backspace') {
    focusPreviousField(inputRefs.current.indexOf(target));
  }
  else
 {
    focusNewField(inputRefs.current.indexOf(target))
 }
}}
onChangeText={(text)=>{ setFieldSec3(text)}}
/>
    </View>
    <View style={{height:45,width:45,justifyContent:'center',alignItems:'center',marginRight:10}}>
      <TextInput  keyboardType="numeric"   maxLength={1} secureTextEntry={true}
     value={fieldSec4}
  
      style={[
        styles.pinInput,
        {borderRadius: fieldSec4 ? 10 : 0,  backgroundColor: fieldSec4 ? '#fff' : '#ddd' },
      ]}
ref={(ref) => inputRefs.current[7] = ref}
onKeyPress={({ nativeEvent, target }) => {
  if (nativeEvent.key === 'Backspace') {
    focusPreviousField(inputRefs.current.indexOf(target));
  }
 
}}
      
      onChangeText={(text)=>
        {
            setFieldSec4(text);
    }}
      />
    </View>
  
    </View>
    </View>


    <Text></Text>
    <Button title='create' onPress={CheckCreateAndConfirm}/>
    <Text></Text>
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
    borderRadius:50,
    borderColor: '#ccc'
  },
})

export default PinGeneration;