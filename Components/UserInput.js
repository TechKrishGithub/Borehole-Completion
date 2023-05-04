import React, { useEffect } from "react";
import {View,Text,StyleSheet,Pressable, TextInput,Modal,TouchableOpacity, Alert,Button,Image} from 'react-native';
import {useState} from 'react';
import Warning from "./Warnings";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Uganda');

const UserInput=({navigation})=>
{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
    
useEffect(()=>
{
  db.transaction(tx=>{
    tx.executeSql("CREATE TABLE IF NOT EXISTS "
    +"VesMaster"
    +"(id INTEGER PRIMARY KEY AUTOINCREMENT,StationNo INTEGER,AB VARCHAR,MN VARCHAR,vesMasterId INTEGER)",
    [],
    (tx,result)=>
    {
        console.log("Table created successfully VesMaster");
    },
    (tx,error)=>
    {
        console.log("Sorry something went wrong ", error);
    }
    )
})

db.transaction(tx=>{
  tx.executeSql("CREATE TABLE IF NOT EXISTS "
  +"BoreHoleNumbersFromApi"
  +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_numbers VARCHAR NOT NULL)",
  [],
  (tx,result)=>
  {
      console.log("Table created successfully BoreHoleNumbersFromApi");
  },
  (tx,error)=>
  {
      console.log("Sorry something went wrong ", error);
  }
  )
})



const isTableEmpty = () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM VesMaster',
            [],
            (_, result) => {
              const count = result.rows.item(0).count;
              resolve(count === 0);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });
    };

   

    isTableEmpty().then((empty)=>
{
  if(empty)
  {
    fetch('http://182.18.181.115:8091///api/VES/GetVesMaster').
    then(response=>response.json()).
    then(responseData=>JSON.parse(responseData)).
    then(result=>
      {
        result.map(item=>
          {
            db.transaction(tx=>
              {
                tx.executeSql("INSERT INTO VesMaster(StationNo,AB,MN,VesMasterId) VALUES (?,?,?,?)",
                [item.StationNo,item.AB,item.MN,item.vesMasterId],
                (tx,result)=>
                {
                  console.log('Data Added Succesfully VesMaster')
                },
                (tx,error)=>
                {
                  console.log(error);
                }
                )
              })
          })
        
      }).catch(error=>console.log(error))
     
  }
 
})

    getData();
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS User_Master (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,userid INTEGER,token VARCHAR)',
        [],
        (tx,result)=>{
          console.log('User_Master Table created successfully');
        },
        (tx,error)=>
        {
          console.log('Sorry Something went wrong', error)
        }
      );
    });
},[]);

// const getUserFromApi=()=>
// {
//   fetch('http://182.18.181.115:8084/api/login/loginservice?username='+username+'&password='+password+'').
//   then(response=>response.json()).
//   then(responseText=>JSON.parse(responseText)).
//   then((data)=>{
//     console.log(data);
//   }).catch(error=>console.log(error))
// }

    
    const getData=async ()=>
    {
        try{
         await AsyncStorage.getItem('Username').then(
            async value=>
            {
                if(value!=null)
                {
                    await AsyncStorage.getItem('Password').then(
                        value=>{
                            if(value!=null)
                            {
                                navigation.replace('WEIS');
                            }
                        }
                    )
                }
            }
         )

        }
        catch(error)
        {
            console.log(error);
        }
    }



     const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    
    
    
    const Validate=async ()=>
    {
       try{
        if(username!=''&&password!='')
        { 
          fetch('http://182.18.181.115:8084/api/login/loginservice?username='+username+'&password='+password+'').
      then(response=>response.json()).
      then(responseText=>JSON.parse(responseText)).
      then(async (result)=>{
  
        if(result.length!==0)
        {
          console.log(result[0].userid);
          console.log(result[0].token);
          await AsyncStorage.setItem('Username',username);
          await AsyncStorage.setItem('Password',password);
          db.transaction(tx => {
            tx.executeSql('INSERT INTO User_Master (username, password, userid,token) VALUES (? ,? ,?, ?)', [username,password,result[0].userid,result[0].token], (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('User added');
              } else {
                console.log('Error adding user');
              }
            });
          }); 
          const isTableEmptyBoreHole = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM BoreHoleNumbersFromApi',
                  [],
                  (_, result) => {
                    const count = result.rows.item(0).count;
                    resolve(count === 0);
                  },
                  (_, error) => {
                    reject(error);
                  }
                );
              });
            });
          };
          
            isTableEmptyBoreHole().then((empty)=>
          {
            if(empty)
            {
              fetch('http://182.18.181.115:8091/api/BoreholeNumber/GetBoreholes',
                  {
                    method: 'POST ',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      userid:result[0].userid
                    })
                  }
                  ).then(response => response.json()).
                  then(responseData=>JSON.parse(responseData)).
                  then(result=>
                    {
                      result.map(item=>
                        {
                          db.transaction(tx=>
                            {
                              tx.executeSql("INSERT INTO BoreHoleNumbersFromApi(bore_hole_numbers) VALUES (?)",
                              [item.BoreholeNumber],
                              (tx,result)=>
                              {
                                console.log('Data Added Succesfully Into BoreHoleNumbersFromApi');
                                console.log(item.BoreholeNumber)
                              },
                              (tx,error)=>
                              {
                                console.log(error);
                              }
                              )
                            })
                        })
                    })          
    
            }
            else
            {
          
            }
          })
          
          navigation.navigate('WEIS');
          setUsername('');
          setPassword('');

        }
        else
        {
          Alert.alert('warning','Username and password wrong');
        }
      }).catch(error=>{ 
        console.log(error)
      })
        }
        else
        {
           Alert.alert('warining','Please Entered Username and Password')
        }
       }
       catch(error)
       {
        console.log(error);
       }

    }


  return(
    <View style={styles.user}>
     <View style={{height:90,width:90,justifyContent:'center',alignItems:'center',backgroundColor:'white',borderRadius:60}}>
     <Image source={require('../assets/logo-removebg-preview.png')} style={{height:65,width:65}}/>
     </View>
     <Text></Text> 
      <View style={styles.Field}>
      <Image source={require('../assets/weislogoo.png')} style={{height:60,width:140}}/>
       
        <Text></Text>
        <Text style={{fontSize:20,}}>Sign in to start your session</Text>
        
     
      <Text></Text>
      <Text></Text> 
      <View style={styles.InputContainer}>
      <TextInput placeholder="Enter username" placeholderTextColor='grey' style={styles.FieldInput} onChangeText={setUsername} value={username}/>
      </View>
      <Text></Text>
      <View style={styles.InputContainer}>
      <TextInput placeholder="Enter password" placeholderTextColor='gray'  secureTextEntry={!showPassword}  style={styles.FieldInput} onChangeText={setPassword} value={password} />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="gray"
        />
      </TouchableOpacity>
      </View>
      <Text></Text>
     
      {/* <Pressable
      onPress={Validate}
      style={({pressed})=>({backgroundColor:pressed? '#3a365d':'#1b0eaf'})}
      >
        <View style={styles.button}>
        <Text style={{color:'white'}}>Submit</Text>
        </View>
      </Pressable> */}
      <Button title='Submit' onPress={Validate}/>
      </View>
        {/* <Warning visible={warningVis} change={WarningMessage}/> */}
    </View>
  )
}

const styles=StyleSheet.create({
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc',
    width:'95%'
  },
  FieldInput: {
    flex: 1,
    height: 40,
    fontSize:20
  },
  user:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'grey'
  },
  Field:{
    height:500,
    width:'90%',
    borderWidth:1,
    borderColor:'grey',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f7f7fd',
  },
  InputText:
  {
    marginLeft:10,
    fontSize:20,
  },
 Input: 
  {
      height:50,
      width:'95%',
      borderWidth:1,
      borderColor:'grey',
      fontSize:20,
      justifyContent:'center',
  },
  InputPassword: 
  {
      height:50,
      width:'95%',
      borderWidth:1,
      borderColor:'grey',
      fontSize:20,
      justifyContent:'center',
      flexDirection:'row',
  },
  button:
  {
    height:45,
    width:100,
    justifyContent:'center',
    alignItems:'center',
  }
})


export default UserInput;