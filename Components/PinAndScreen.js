import React, { useState ,useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WellLogForms from './WellLogForms';
import LogoutButton from './LogoutButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinGeneration from './PinGeneration';
import PinAccess from './PinAccess';
import {Button,Image,Alert,View,Text,StyleSheet,BackHandler,ActivityIndicator} from 'react-native';
import { Pressable } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Font from 'expo-font';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TransitionSpecs } from '@react-navigation/stack';

const db=SQLite.openDatabase('Uganda');

const Stack=createStackNavigator();


const PinAndScreen=()=>
{
  const [id,setId]=useState('');
  const [loading,setLoading]=useState(true);


  const transition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  };

  const loadFont=async ()=>
    {
             await Font.loadAsync({
                'OpenSans-ExtraBoldItalic': require('../assets/Open_Sans/static/OpenSans/OpenSans-ExtraBoldItalic.ttf'),
                'Kanit-Regular':require('../assets/Kanit-Regular.ttf'),
                'SpaceMono-Bold':require('../assets/SpaceMono-Bold.ttf'),
                'PoltawskiNowy-VariableFont_wght':require('../assets/PoltawskiNowy-VariableFont_wght.ttf'), 
                'Kanit-ExtraBold':require('../assets/Kanit-ExtraBold.ttf')         
            });
    }


  
  useEffect(()=>{
    loadFont(); 
    db.transaction(tx=>{
      tx.executeSql("CREATE TABLE IF NOT EXISTS "
      +"BoreHoleNumbers"
      +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_numer VARCHAR NOT NULL)",
      [],
      (tx,result)=>
      {
          console.log("Table created successfully BoreHoleNumbers");
      },
      (tx,error)=>
      {
          console.log("Sorry something went wrong ", error);
      }
      )
  })
    db.transaction(tx=>{
      tx.executeSql(
      'SELECT username FROM User_Master WHERE id = ?',
      [1],
      (_, { rows }) => setId(rows._array[0].username)
      )
    })
    loadFont(); 
 

    AsyncStorage.getItem('Pin').then((value) => {
      if (value !== null) {
        setVisLog(true); 
      setLoading(false)    
      }
      else
      {
        setLoading(false)
      }
    });

    const backAction = () => {
        // do nothing to prevent going back
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => backHandler.remove();

  },[])
  const [visLog,setVisLog]=useState(false);


  if (loading) 
  {
         return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#dffcfc' }}>
                <ActivityIndicator size="large" color="#0000ff"/> 
                <Image source={require('../assets/logo-removebg-preview.png')} style={{
                   position: 'absolute',
                   top: '50%',
                   left: '50%',
                   width: 23,
                   height: 23,
                   marginLeft: -13,
                   marginTop: -28,
                }} />                 
                <Text
                style={{fontSize:25,color:'blue',fontWeight:'bold'}}
                >Loading.....</Text>
              </View>
            );
  }
  

  if(visLog)
  {
    return(

      <Stack.Navigator
      >
          <Stack.Screen
        name="Access"
        component={PinAccess}
        options={({ navigation }) => ({
          headerTintColor:'white',
          headerTintColor:'transparent',
          headerRight:()=>(
            <View>
            <TouchableOpacity
            onPress={ ()=>{Alert.alert('Message','Do You want to Reset Pin?',[{text:'Yes',onPress:async ()=>{
              try
              {
                await AsyncStorage.removeItem('Pin');
                navigation.navigate('PIN');
              }
              catch(error)
              {
                console.log(error)
              }
            }},{text:'No'}])}
          }
            >
            <View style={{marginRight:20,marginLeft:20}}>
            <Image source={require('../assets/6357048.png')} style={{height:41,width:41}}
            
            />
            </View>
            </TouchableOpacity>
            </View>
          ),
          headerStyle:{backgroundColor:'#3A88C8'},
          headerLeft: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginLeft:0,fontSize:7,color:'white'}}>{id}</Text>
            <LogoutButton onPress={async () => {
              await AsyncStorage.removeItem('Username');
              await AsyncStorage.removeItem('Password');
              db.transaction(tx => {
                tx.executeSql(
                 'DROP TABLE IF EXISTS User_Master',
                [],
                (_, result) => {
                  console.log('Table deleted');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              )
              })
              navigation.navigate('UserLogin')
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
            }}  style={{backgroundColor:'white'}}/>
            </View>
          ),
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        })}
        />
        <Stack.Screen
        name="PIN"
        component={PinGeneration}
        options={({ navigation }) => ({
          headerTintColor:'white',
          headerLeft:()=>null,
          headerStyle:{backgroundColor:'#3A88C8'},
          headerRight: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginLeft:0,fontSize:7,color:'white'}}>{id}</Text>
            <LogoutButton onPress={async () => {
              await AsyncStorage.removeItem('Username');
              await AsyncStorage.removeItem('Password');
              db.transaction(tx => {
                tx.executeSql(
                 'DROP TABLE IF EXISTS User_Master',
                [],
                (_, result) => {
                  console.log('Table deleted');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              )
              })
              navigation.navigate('UserLogin')
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
            }}  style={{backgroundColor:'white'}}/>
            </View>
          ),
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        })}
        />
           <Stack.Screen
        name="Well Log Forms"
        component={WellLogForms}
        options={({ navigation }) => ({
          headerTitleAlign:'center',
          headerTitleStyle:{fontFamily:'Kanit-Regular',fontSize:24,color:'#180e60'},
          headerRight: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <View style={{marginRight:15}}>
                <TouchableOpacity
                onPress={()=>
                {
                  Alert.alert('MESSAGE','Do you want to Lock App ?',[{text:'ok',onPress:()=>{navigation.navigate("Access")}},{text:'cancel'}])
                }}
                >
                  <Image source={require('../assets/lockLogo.png')} style={{height:40,width:40}} />
                </TouchableOpacity>
            </View>
            </View>
          ),
          headerStyle:{backgroundColor:'#b3eff7'},
          headerLeft: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginLeft:0,fontSize:7,color:'blue'}}>{id}</Text>
            <LogoutButton onPress={async () => {
              await AsyncStorage.removeItem('Username');
              await AsyncStorage.removeItem('Password');
              db.transaction(tx => {
                tx.executeSql(
                 'DROP TABLE IF EXISTS User_Master',
                [],
                (_, result) => {
                  console.log('Table deleted');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              )
              })
              navigation.navigate('UserLogin')
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
            }}  style={{backgroundColor:'white'}}/>
            </View>
          ),
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        })}

       />
       
      </Stack.Navigator>

    
  )
  }


  return(
    
  
      <Stack.Navigator
      >
        <Stack.Screen
        name="PIN"
        component={PinGeneration}
        options={({ navigation }) => ({
          headerTintColor:'white',
          headerLeft:()=>null,
          headerStyle:{backgroundColor:'#3A88C8'},
          headerRight: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginLeft:0,fontSize:7,color:'white'}}>{id}</Text>
            <LogoutButton onPress={async () => {
              await AsyncStorage.removeItem('Username');
              await AsyncStorage.removeItem('Password');
              db.transaction(tx => {
                tx.executeSql(
                 'DROP TABLE IF EXISTS User_Master',
                [],
                (_, result) => {
                  console.log('Table deleted');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              )
              })
              navigation.navigate('UserLogin')
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
            }}  style={{backgroundColor:'white'}}/>
            </View>
          ),
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        })}
        />
        <Stack.Screen
        name="Access"
        component={PinAccess}
        options={({ navigation }) => ({
          headerTintColor:'white',
          headerTintColor:'transparent',
          headerRight:()=>(
            <View>
            <TouchableOpacity
            onPress={ ()=>{Alert.alert('Message','Do You want to Reset Pin?',[{text:'Yes',onPress:async ()=>{
              try
              {
                await AsyncStorage.removeItem('Pin');
                navigation.navigate('PIN');
              }
              catch(error)
              {
                console.log(error)
              }
            }},{text:'No'}])}
          }
            >
            <View style={{marginRight:20,marginLeft:20}}>
            <Image source={require('../assets/6357048.png')} style={{height:41,width:41}}
            
            />
            </View>
            </TouchableOpacity>
            </View>
          ),
          headerStyle:{backgroundColor:'#3A88C8'},
          headerLeft: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginLeft:0,fontSize:7,color:'white'}}>{id}</Text>
            <LogoutButton onPress={async () => {
              await AsyncStorage.removeItem('Username');
              await AsyncStorage.removeItem('Password');
              db.transaction(tx => {
                tx.executeSql(
                 'DROP TABLE IF EXISTS User_Master',
                [],
                (_, result) => {
                  console.log('Table deleted');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              )
              })
              navigation.navigate('UserLogin')
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
            }}  style={{backgroundColor:'white'}}/>
            </View>
          ),
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        })}
        />
           <Stack.Screen
        name="Well Log Forms"
        component={WellLogForms}
        options={({ navigation }) => ({
          headerTitleAlign:'center',
          headerTitleStyle:{fontFamily:'Kanit-Regular',fontSize:24,color:'#180e60'},
          headerRight: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <View style={{marginRight:15}}>
                <TouchableOpacity
                onPress={()=>
                {
                  Alert.alert('MESSAGE','Do you want to Lock App ?',[{text:'ok',onPress:()=>{navigation.navigate("Access")}},{text:'cancel'}])
                }}
                >
                  <Image source={require('../assets/lockLogo.png')} style={{height:40,width:40}} />
                </TouchableOpacity>
            </View>
            </View>
          ),
          headerStyle:{backgroundColor:'#b3eff7'},
          headerLeft: () => (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginLeft:0,fontSize:7,color:'blue'}}>{id}</Text>
            <LogoutButton onPress={async () => {
              await AsyncStorage.removeItem('Username');
              await AsyncStorage.removeItem('Password');
              db.transaction(tx => {
                tx.executeSql(
                 'DROP TABLE IF EXISTS User_Master',
                [],
                (_, result) => {
                  console.log('Table deleted');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              )
              })
              navigation.navigate('UserLogin')
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
            }}  style={{backgroundColor:'white'}}/>
            </View>
          ),
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        })}

       />
       
      </Stack.Navigator>

    
  )
}

const styles=StyleSheet.create({
  Welllog:{
    fontFamily:'Kanit-Regular',
    color:'#221d57'
  }
})

export default PinAndScreen;