import React, { useEffect ,useState} from "react";
import {View,Text,Pressable,StyleSheet,useColorScheme,ImageBackground,Image,Button} from 'react-native';
import * as Font from 'expo-font';
import * as SQLite from 'expo-sqlite';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';


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
            <LinearGradient 
            colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,borderRadius:20,elevation:10 }}
          >
            <TouchableOpacity
               
               onPress={changeToLogForDeepWell}
               style={{
               borderRadius:20,
               borderWidth:0.8,
               borderColor:'#cfdcdd'
               }}
               >
               <View style={styles.button}>
             <Image source={require('../assets/fileEntry4.png')} style={{height:50,width:50}}/>
               <Text style={styles.text}>Log For Deep Well</Text>
               </View>
               </TouchableOpacity>
            
          </LinearGradient>
             
            </View>

            <View style={styles.screensButtons}>

            <LinearGradient
            colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,borderRadius:20,elevation:10 }}
          >
             <TouchableOpacity
            onPress={changeToStepTest}
            style={{
            borderRadius:20,
            borderWidth:0.8,
            borderColor:'#cfdcdd'
        }}
            >
                <View style={styles.button}>
                  <Image source={require('../assets/fileEntry4.png')} style={{height:50,width:50}}/>
                <Text style={styles.text}>StepTest</Text>
                </View>
            </TouchableOpacity>

          </LinearGradient>
            </View>
            </View>

         <Text></Text>

         <View style={styles.screens}>

            <View style={styles.screensButtons}>
            <LinearGradient
             colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,borderRadius:20,elevation:10 }}
          >
              <TouchableOpacity
            onPress={changeToStepTestRecovery}
            style={{
            borderRadius:20,
            borderWidth:0.8,
            borderColor:'#cfdcdd'
            }}
            >
                <View style={styles.button}>
                  <Image source={require('../assets/fileEntry4.png')} style={{height:50,width:50}}/>
                <Text style={styles.text}>Step Test Recovery</Text>
                </View>
            </TouchableOpacity>

          </LinearGradient>
          
            </View>

            <View style={styles.screensButtons}>

            <LinearGradient
             colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,borderRadius:20,elevation:10 }}
          >

            <TouchableOpacity
            onPress={changeToConstantDischargeTest}
            style={{
            borderRadius:20,
            borderWidth:0.8,
            borderColor:'#cfdcdd'
        }}
            >
                 <View style={styles.button}>
                   <Image source={require('../assets/fileEntry4.png')} style={{height:50,width:50}}/>
                <Text style={styles.text}>Constant Discharge Test</Text>
                </View>
            </TouchableOpacity>

            </LinearGradient>
           
            </View>
       </View>

            <Text></Text>

            <View style={styles.screens}>
              <View style={styles.screensButtons}>
              <LinearGradient
             colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,borderRadius:20,elevation:10 }}
          >
            <TouchableOpacity
            onPress={changeToConstantTestRecovery}
            style={{
            borderRadius:20,
            borderWidth:0.8,
            borderColor:'#cfdcdd'
            }}
            >
                 <View style={styles.button}>
                   <Image source={require('../assets/fileEntry4.png')} style={{height:50,width:50}}/>
                <Text style={styles.text}>Constant Test Recovery</Text>
                </View>
            </TouchableOpacity>
            </LinearGradient>
           
            </View>
            <View style={styles.screensButtons}>
            <LinearGradient
             colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,borderRadius:20,elevation:10 }}
          >
            <TouchableOpacity
            onPress={changeToVertEleSounForm}
            style={{
            borderRadius:20,
            borderWidth:0.8,
            borderColor:'#cfdcdd'
            }}
            >
                 <View style={styles.button}>
                   <Image source={require('../assets/fileEntry4.png')} style={{height:50,width:50}}/>
                <Text style={styles.text}>Vertical Electric Sounding Form</Text>
                </View>
            </TouchableOpacity>
            </LinearGradient>
           
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
     <LinearGradient
             colors={['#3c8da8', '#85cae2', '#3c8da8']}
            start={[0, 0]}
            end={[1, 0]}
            locations={[0.15, 0.5, 0.95]}
            style={{ flex: 1,elevation:10, borderRadius:10 }}
          >
 <TouchableOpacity
            onPress={()=>
            {
                navigation.navigate('Dashboard')
            }}
            style={{
            borderRadius:10,
            borderWidth:0.8,
            borderColor:'#cfdcdd'
            }}
            >
                 <View style={{
                     height:'100%',
                     alignItems:'center',
                     justifyContent:'center',
                     padding:10
                 }}>
                <Text style={{
                       fontSize:15,
                       color:'white',
                       fontFamily: 'SpaceMono-Bold'
                }}>Back To Dashboard</Text>
                </View>
            </TouchableOpacity>
          </LinearGradient>
           
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
    color:'white',
    fontFamily: 'Kanit-ExtraBold'
    },
    screens:{
        width:'100%',
        height:'20%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        padding:5,
        marginTop:20,  
        marginLeft:-20,      
    },
    screensButtons:{
        width:'45%',
        marginLeft:20,
        
       
    }
})
export default Screens;