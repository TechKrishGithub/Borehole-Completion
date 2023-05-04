import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserInput from './Components/UserInput';
import WellLogForms from './Components/WellLogForms';
import LogoutButton from './Components/LogoutButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogOutOptions from './Components/LogoutOptions';
import { View,ImageBackground,Image ,Text,ActivityIndicator} from 'react-native';
import PinGeneration from './Components/PinGeneration';
import PinAndScreen from './Components/PinAndScreen';
import { TransitionSpecs } from '@react-navigation/stack';
import * as Font from 'expo-font';

const Stack=createStackNavigator();

const App=()=>
{


  const loadFont=async ()=>
  {
           await Font.loadAsync({
              'OpenSans-ExtraBoldItalic': require('./assets/Open_Sans/static/OpenSans/OpenSans-ExtraBoldItalic.ttf'),
              'Kanit-Regular':require('./assets/Kanit-Regular.ttf'),
              'SpaceMono-Bold':require('./assets/SpaceMono-Bold.ttf'),
              'PoltawskiNowy-VariableFont_wght':require('./assets/PoltawskiNowy-VariableFont_wght.ttf'),
              'SpaceMono-Regular':require('./assets/SpaceMono-Regular.ttf'),
              'OpenSans-Medium': require('./assets/Open_Sans/static/OpenSans/OpenSans-Medium.ttf'),
              'Kanit-ExtraBold':require('./assets/Kanit-ExtraBold.ttf')
          });
  }

  const transition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  };
  const [visLog,setVisLog]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(()=>
  {
    
    loadFont()
     AsyncStorage.getItem('Username').then(
                async value=>
                {
                    if(value!=null)
                    {
                        await AsyncStorage.getItem('Password').then(
                            value=>{
                                if(value!==null)
                                {
                                  setVisLog(true);
                                  setLoading(false);         
                                }
                                else
                                {
                                  setLoading(false)
                                }
                            }
                        )
                    }
                  else
                  {
                    setLoading(false)
                  }
                }
             )
  },[])
  
  if (loading) 
  {
         return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#dffcfc' }}>
                <Image source={require('./assets/logo-removebg-preview.png')} style={{
                   position: 'absolute',
                   top: '47%',
                   left: '44%',
                   width: 60,
                   height: 60,
                }} />
                 <ActivityIndicator size="large" color="#00f"/> 
              </View>
            );
  }

  
  

if(visLog)
{
  return(
    <NavigationContainer >
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackground: () => (
            <ImageBackground
              source={require('./assets/top.png')}
              style={{ flex: 1 }}
            />
          ),
        }}
      >
             <Stack.Screen
        name="WEIS"
        component={PinAndScreen}
        options={({ navigation }) => ({
          // headerTintColor:'transparent',
          headerTitle: () => (
      
              <View>
                <View style={{marginLeft:40}}>
              <Text style={{fontWeight:'bold',fontSize:7,color:'#0f26aa'}}>
              REPUBLIC OF UGANDA 
              </Text>
              </View>
              <View>
              <Text style={{fontWeight:'bold',color:'#0f26aa',fontSize:10}}>
              Ministry of Water and Environment
              </Text>
              <View style={{marginLeft:38}}>
              <Text style={{fontWeight:'bold',color:'#0f26aa',fontSize:9}}>
             Borehole Completion
              </Text>
              </View>
              </View>
              </View>
          ),
          headerLeft:()=>(
            <Image source={require('./assets/logo-removebg-preview.png')} style={{marginLeft:20,height:50,width:50}}/>
            
          ),
          headerRight: () => (
            <Image source={require('./assets/weislogoo.png')} style={{marginRight:10,height:50,width:85}}/>
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
        name="UserLogin"
        component={UserInput}
        options={{
          header:()=>null,
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
   
        
      </Stack.Navigator>
    </NavigationContainer>
    
  )
  
}


  return(
  
    <NavigationContainer >
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackground: () => (
            <ImageBackground
              source={require('./assets/top.png')}
              style={{ flex: 1 }}
            />
          ),
        }}
      >
        <Stack.Screen
        name="UserLogin"
        component={UserInput}
        options={{
          header:()=>null,
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
        name="WEIS"
        component={PinAndScreen}
        options={({ navigation }) => ({
          // headerTintColor:'transparent',
          headerTitle: () => (
      
              <View>
                <View style={{marginLeft:40}}>
              <Text style={{fontWeight:'bold',fontSize:7,color:'#0f26aa'}}>
              REPUBLIC OF UGANDA 
              </Text>
              </View>
              <View>
              <Text style={{fontWeight:'bold',color:'#0f26aa',fontSize:10}}>
              Ministry of Water and Environment
              </Text>
              <View style={{marginLeft:38}}>
              <Text style={{fontWeight:'bold',color:'#0f26aa',fontSize:9}}>
             Borehole Completion
              </Text>
              </View>
              </View>
              </View>
          ),
          headerLeft:()=>(
            <Image source={require('./assets/logo-removebg-preview.png')} style={{marginLeft:20,height:50,width:50}}/>
            
          ),
          headerRight: () => (
            <Image source={require('./assets/weislogoo.png')} style={{marginRight:10,height:50,width:85}}/>
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
    </NavigationContainer>
    
  )
}

export default App;