import React, { useEffect ,useState} from "react";
import {View,Text,Pressable,StyleSheet,useColorScheme,ImageBackground,Image,Button} from 'react-native';
import * as Font from 'expo-font';
import * as SQLite from 'expo-sqlite';
import { TouchableOpacity } from "react-native-gesture-handler";


const db=SQLite.openDatabase('Uganda');

const Screens=({navigation})=>
{
    const theme = useColorScheme();
    const shadowColor = theme === "dark" ? "#fff" : "#000";
    const loadFont=async ()=>
    {
             await Font.loadAsync({
                'OpenSans-ExtraBoldItalic': require('../assets/Open_Sans/static/OpenSans/OpenSans-ExtraBoldItalic.ttf')
            });
    }
    useEffect(()=>
    {
        loadFont(); 
        db.transaction(tx=>
            {
                tx.executeSql(
                    'SELECT bore_hole_numer FROM BoreHoleNumbers ORDER BY id DESC LIMIT 1',
                    [],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            const boreHoleNum = rows.item(0);
                            setGetBoreHoleNum(boreHoleNum['bore_hole_numer']);
                            console.log(getBoreHoleNum)
                            
                        }
            })
        })

    },[])
    const [getBoreHoleNum,setGetBoreHoleNum]=useState('');
 
    function changeToLogForDeepWell() {
        navigation.navigate('Log For DeepWell',{getBoreHoleNum});
    }
    const changeToStepTest=()=>
    {
        navigation.navigate('Step Test',{getBoreHoleNum})
    }
    const changeToStepTestRecovery=()=>
    {
        navigation.navigate('Step Test Recovery',{getBoreHoleNum})
    }
    const changeToConstantDischargeTest=()=>
    {
        navigation.navigate('Constant Discharge Test',{getBoreHoleNum})
    }
    const changeToConstantTestRecovery=()=>
    {
        navigation.navigate('Constant Test Recovery',{getBoreHoleNum});
    }
    const changeToVertEleSounForm=()=>
    {
        navigation.navigate('Vertical Electric Sounding Form',{getBoreHoleNum});
    }
  
    return(
        
        <View style={{flex:1,alignItems:'center',backgroundColor:'#effafc'}}>

<View style={{flex:1,marginTop:50}}>
            <View style={styles.screens}>

           
            <View style={styles.screensButtons}>
               <Pressable
               
            onPress={changeToLogForDeepWell}
            style={({pressed})=>({backgroundColor:pressed?'#837083':'#f5f9fa',
            borderRadius:20,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 20, // set shadow thickness or blur
            shadowOpacity: 1, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
        })}
            >
            <View style={styles.button}>
            <Text style={styles.text}>Log For Deep Well</Text>
            </View>
            </Pressable>
            </View>

            <View style={styles.screensButtons}>
            <Pressable
            onPress={changeToStepTest}
            style={({pressed})=>({backgroundColor:pressed?'#837083':'#f5f9fa',
            borderRadius:20,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 10, // set shadow thickness or blur
            shadowOpacity: 0.5, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
        })}
            >
                <View style={styles.button}>
                <Text style={styles.text}>StepTest</Text>
                </View>
            </Pressable>
            </View>
            </View>

         <Text></Text>

         <View style={styles.screens}>

            <View style={styles.screensButtons}>
            <Pressable
            onPress={changeToStepTestRecovery}
            style={({pressed})=>({backgroundColor:pressed?'#837083':'#f5f9fa',
            borderRadius:20,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 10, // set shadow thickness or blur
            shadowOpacity: 0.5, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
          
        })}
            >
                <View style={styles.button}>
                <Text style={styles.text}>Step Test Recovery</Text>
                </View>
            </Pressable>
            </View>

            <View style={styles.screensButtons}>
            <Pressable
            onPress={changeToConstantDischargeTest}
            style={({pressed})=>({backgroundColor:pressed?'#837083':'#f5f9fa',
            borderRadius:20,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 10, // set shadow thickness or blur
            shadowOpacity: 0.5, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
            padding:25
        })}
            >
                 <View style={styles.button}>
                <Text style={styles.text}>Constant Discharge Test</Text>
                </View>
            </Pressable>
            </View>
       </View>

            <Text></Text>

            <View style={styles.screens}>
              <View style={styles.screensButtons}>
            <Pressable
            onPress={changeToConstantTestRecovery}
            style={({pressed})=>
            ({backgroundColor:pressed?'#837083': '#f5f9fa',
            borderRadius:20,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 10, // set shadow thickness or blur
            shadowOpacity: 0.5, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
            padding:25
        })
    }
            >
                 <View style={styles.button}>
                <Text style={styles.text}>Constant Test Recovery</Text>
                </View>
            </Pressable>
            </View>
            <View style={styles.screensButtons}>
            <Pressable
            onPress={changeToVertEleSounForm}
            style={({pressed})=>({backgroundColor:pressed?'rgb(131, 112, 131)':'#f5f9fa',
            borderRadius:20,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 10, // set shadow thickness or blur
            shadowOpacity: 0.5, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
        })}
            >
                 <View style={styles.button}>
                <Text style={styles.text}>Vertical Electric Sounding Form</Text>
                </View>
            </Pressable>
            </View>
            </View>

<Text></Text>
<Text></Text>
<Text></Text>

<View style={{
      height:'10%',
      justifyContent:'center',
      alignItems:'center',
      padding:8    
}}>
            <Pressable
            onPress={()=>
            {
                navigation.navigate('Dashboard')
            }}
            style={({pressed})=>({backgroundColor:pressed?'rgb(131, 112, 131)':'#f5f9fa',
            borderRadius:10,
            elevation: 10, // set elevation to give shadow effect
            shadowColor: shadowColor, // set shadow color
            shadowRadius: 10, // set shadow thickness or blur
            shadowOpacity: 0.5, // set shadow opacity
            shadowOffset: {
              width: 10, // set x-axis shadow length
              height: 10, // set y-axis shadow length
            },
        })}
            >
                 <View style={{
                     height:'100%',
                     alignItems:'center',
                     justifyContent:'center',
                     padding:10
                 }}>
                <Text style={{
                       fontSize:15,
                       color:'#1e3b3b',
                       fontFamily: 'SpaceMono-Bold'
                }}>Back To Dashboard</Text>
                </View>
            </Pressable>
</View>
            </View>         
        </View>
    )
}

const styles=StyleSheet.create({
    button:{
        height:'100%',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
   
    },
    text:{
    fontSize:15,
    color:'#1e3b3b',
    fontFamily: 'Kanit-ExtraBold'
    },
    screens:{
        width:'100%',
        height:'20%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        padding:8,
        marginTop:20,  
        marginLeft:-20,      
    },
    screensButtons:{
        width:'45%',
        marginLeft:20,
       
    }
})
export default Screens;