import { View,Text,Image, Pressable, BackHandler,ActivityIndicator } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import LogForDeepWell from "./LogForDeepWell";
import StepTest from "./StepTest";
import StepTestRecovery from "./StepTestRecovery";
import ConstantDischargeTest from "./ConstantDischargeTest";
import Screens from "./Screens";
import ConstantTestRecovery from "./ConstantTestRecovery";
import VerticalElectSoundForm from "./VerticalElectSoundForm";
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import { TouchableOpacity } from "react-native-gesture-handler";
import DashBoard from "./DashBoard";
import * as SQLite from 'expo-sqlite';
import DashBoardEntry from "./DashBoardEntry";
import { TransitionSpecs } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';


const db=SQLite.openDatabase('Uganda');
const Stack=createStackNavigator();
const WellLogForms=()=>
{

  const [loading,setLoading]=useState(true);
  const [visLog,setVisLog]=useState(false)


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
                'SpaceMono-Regular':require('../assets/SpaceMono-Regular.ttf'),
                'OpenSans-Medium': require('../assets/Open_Sans/static/OpenSans/OpenSans-Medium.ttf'),
                'Kanit-ExtraBold':require('../assets/Kanit-ExtraBold.ttf')
            });
    }
    
    useEffect( ()=>
    {
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
    const isTableEmpty = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM BoreHoleNumbers',
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

      isTableEmpty()
      .then((empty) => {
        if(!empty)
        {
           setVisLog(true);
           setLoading(false)
          }
        if(empty)
        {
            setLoading(false)
        }
    }
      )
        const backAction = () => {
            // do nothing to prevent going back
            return true;
          };
      
          const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      
          return () => backHandler.remove();
    })

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#dffcfc' }}>
          
          <ActivityIndicator size="large" color="#0000ff" style={{fontSize:60}}/>
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
          style={{fontSize:20,color:'blue',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
          >Loading.....</Text>
        </View>
      );
    }


    if(visLog)
    {
      return(
        <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardOverlayEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
        >
             <Stack.Screen
            name="Dashboard"
            component={DashBoard}
           options={{headerStyle:{backgroundColor:'#3A88C8'},
           headerLeft:()=>null,
           headerTintColor:'#cdcae9',
           headerTitleStyle:{fontFamily:'Kanit-ExtraBold',fontSize:23},
           cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection, 
        }}
            />

               <Stack.Screen
            name="DashBoard"
            component={DashBoardEntry}
           options={{headerStyle:{backgroundColor:'#3A88C8'},
           headerTintColor:'white',
           headerLeft:()=>null,
           headerTintColor:'#cdcae9',
           headerTitleStyle:{fontFamily:'Kanit-ExtraBold',fontSize:23},
           cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        }}
        
            />

            <Stack.Screen
            name="Choose Screen"
            component={Screens}
           options={{header:()=>null,
            // cardStyleInterpolator: ({ current: { progress } }) => {
            //   return {
            //     cardStyle: {
            //       opacity: progress,
            //     },
            //   };
            // },
            // transitionSpec: transition.transitionSpec,
            // gestureDirection: transition.gestureDirection,
          }}
            
            />
            <Stack.Screen
            name="Log For DeepWell"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                  headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={LogForDeepWell}
            />
            <Stack.Screen
            name="Step Test"
            component={StepTest}
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            />
            <Stack.Screen
            name="Step Test Recovery"
            component={StepTestRecovery}
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            
            />
            <Stack.Screen
            name="Constant Discharge Test"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={ConstantDischargeTest}
            />

             <Stack.Screen
            name="Constant Test Recovery"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={ConstantTestRecovery}
            /> 
             <Stack.Screen
            name="Vertical Electric Sounding Form"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular'}, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={VerticalElectSoundForm}
            /> 

        </Stack.Navigator>
        
    )
    }

    return(
        <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardOverlayEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
        >
             <Stack.Screen
            name="DashBoard"
            component={DashBoardEntry}
           options={{headerStyle:{backgroundColor:'#3A88C8'},
           headerTintColor:'white',
           headerLeft:()=>null,
           headerTintColor:'#cdcae9',
           headerTitleStyle:{fontFamily:'Kanit-ExtraBold',fontSize:23},
           cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection,
        }}
        
            />

             <Stack.Screen
            name="Dashboard"
            component={DashBoard}
           options={{headerStyle:{backgroundColor:'#3A88C8'},
           headerLeft:()=>null,
           headerTintColor:'#cdcae9',
           headerTitleStyle:{fontFamily:'Kanit-ExtraBold',fontSize:23},
           cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
          transitionSpec: transition.transitionSpec,
          gestureDirection: transition.gestureDirection, 
        }}
            />
            <Stack.Screen
            name="Choose Screen"
            component={Screens}
           options={{header:()=>null,
            // cardStyleInterpolator: ({ current: { progress } }) => {
            //   return {
            //     cardStyle: {
            //       opacity: progress,
            //     },
            //   };
            // },
            // transitionSpec: transition.transitionSpec,
            // gestureDirection: transition.gestureDirection,
          }}
            
            />
            <Stack.Screen
            name="Log For DeepWell"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                  headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={LogForDeepWell}
            />
            <Stack.Screen
            name="Step Test"
            component={StepTest}
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            />
            <Stack.Screen
            name="Step Test Recovery"
            component={StepTestRecovery}
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            
            />
            <Stack.Screen
            name="Constant Discharge Test"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={ConstantDischargeTest}
            />

             <Stack.Screen
            name="Constant Test Recovery"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular' }, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={ConstantTestRecovery}
            /> 
             <Stack.Screen
            name="Vertical Electric Sounding Form"
            options={({navigation}) => ({
                headerTintColor: 'white',
                headerStyle:{backgroundColor:'#3A88C8'},
                headerTitleStyle: { color: 'white',fontFamily:'Kanit-Regular'}, 
                headerLeft:()=>(
                    <View style={{marginLeft:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            navigation.goBack()
                        }}
                        >
                    <Image source={require('../assets/button4.png')} style={{height:30,width:30}}/>
                    </TouchableOpacity>
                    </View>
                ),
                // cardStyleInterpolator: ({ current: { progress } }) => {
                //     return {
                //       cardStyle: {
                //         opacity: progress,
                //       },
                //     };
                //   },
                //   transitionSpec: transition.transitionSpec,
                //   gestureDirection: transition.gestureDirection,
            })
                }
            component={VerticalElectSoundForm}
            /> 

        </Stack.Navigator>
        
    )
}


export default WellLogForms;