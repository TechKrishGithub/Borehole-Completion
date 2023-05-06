import {View,Text, TextInput,Button,StyleSheet,TouchableOpacity,ActivityIndicator,ScrollView,Image} from 'react-native';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import FData from './FData';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { useRoute } from '@react-navigation/native';



const db=SQLite.openDatabase('Uganda');

const LogForDeepWell=()=>
{
  const route = useRoute();
  const getBoreHoleNum = route.params.getBoreHoleNum;
  useEffect(()=>{
    db.transaction(tx=>{
      tx.executeSql('CREATE TABLE IF NOT EXISTS logDeepWellImage(ID INTEGER PRIMARY KEY AUTOINCREMENT,file_data BLOB NOT NULL)',[],
      (tx,result)=>
      {
        console.log('Image table created successfully')
      },
      (tx,error)=>
      {
        console.log('Error',error);
      }
      )
    })
    db.transaction((tx)=>{
      tx.executeSql("CREATE TABLE IF NOT EXISTS "
                    +"DeepWellLogInfos"
                    +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NUT NULL,start_date DATE NOT NULL,end_date DATE NOT NULL,driller_unit Integer NOT NULL,table_height INTEGER NOT NULL,dril_rod_len INTEGER NOT NULL,dril_bit_len INTEGER NOT NULL)",
                    [],
        (txObj,result)=>

      {
        console.log("TABLE DeepWellLogInfos CREATED SUCCESSFULLY");
      },
      (txObj,error)=>
      {
        console.log("There is an Error", error)
      }
      )
    })
  },[])



  const [loading,setLoading]=useState(false);
  const [drillUnit,setDrillUnit]=useState('');
  const [tableHeight,setTableHeight]=useState('');
  const [lenDrillRod,setLenDrillRod]=useState('');
  const [lenDrillBit,setLenDrillBit]=useState('');
  const [boreHoleNum,setBoreHoleNum]=useState(0);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [state,setState]=useState('');
    
  
  
    const handleStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
          setStartDate(selectedDate);
        }
      };
    
      const handleEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
          setEndDate(selectedDate);
        }
      };

      const pickImage = async () => {
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          if (!result.canceled) {
            setState(result.uri);
            insertImage(result.uri);
          }
        } catch (error) {
          console.log('Error picking image:', error);
        }
      };
      const insertImage = async (uri) => {
        try {
          const granted = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
         
          if (granted.status !== 'granted') {
            alert('Permission to access media library denied');
            return;
          }
      
          const asset = await MediaLibrary.createAssetAsync(uri);
          const album = await MediaLibrary.getAlbumAsync('SQLiteImages') || await MediaLibrary.createAlbumAsync('SQLiteImages', asset);
      
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO images (image) VALUES (?)',
              [asset.uri],
              (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                  console.log('Image inserted successfully');
                } else {
                  console.log('Image not inserted');
                }
              },
              (_, error) => {
                console.log('Error inserting image into database:', error);
              }
            );
          });
        } catch (error) {
          console.log('Error inserting image into database:', error);
        }
      };
      
      const selectImage = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM logDeepWellImage',
            [],
            (tx,result)=>
            {
              const len=result.rows.length;
              for(let i=0;i<len;i++)
              {
                  const {id,file_data} = result.rows.item(i);
                  console.log(`id:${id},image:${file_data}`);
              }
            }
          )
        })
      }

       if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#dffcfc' }}>
        
        <ActivityIndicator size="large" color="#0000ff" style={{fontSize:60}}/>
        
        <Text
        style={{fontSize:25,color:'blue',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
        >Loading.....</Text>
      </View>
    );
  }

    return(
        <ScrollView >
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <View style={{height:40,width:'100%',alignItems:'center',backgroundColor:'#D8EDF4',justifyContent:'center'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>LOG FOR DEEP WELL</Text>
        </View>
        <Text></Text>
        <View style={{height:300}}>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
              <View style={{height:15}}>
            <TextInput value='Borehole Number' disable style={{marginLeft:10,fontWeight:'bold'}}/>
            </View>
            <View style={{height:25}}>
            <TextInput value={getBoreHoleNum} disable style={{marginLeft:10,fontWeight:'bold'}}/>
            </View>
            </View>
            
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Start Date   <Text style={{color:'red'}}>*</Text></Text>
            <Pressable
            onPress={() => setShowStartDatePicker(true)}
            >
            <Text style={{marginLeft:10,fontWeight:'bold'}} editable={false}>{startDate.toLocaleDateString()}</Text>
            </Pressable>
            {showStartDatePicker && (
        <DateTimePicker
          testID="startDatePicker"
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
            </View>
        </View>
       <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>End Date  <Text style={{color:'red'}}>*</Text></Text>
            <Pressable
             onPress={() => setShowEndDatePicker(true)}
            >
                <Text style={{marginLeft:10,fontWeight:'bold'}} >{endDate.toLocaleDateString()}</Text>
                    {showEndDatePicker && (
                        <DateTimePicker
                          testID="endDatePicker"
                          value={endDate}
                          mode="date"
                          display="default"
                          onChange={handleEndDateChange}
                        />
                      )}
            </Pressable>
        
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
                <Text style={{fontSize:8,marginLeft:10}}>Driller Unit  <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='unit' style={{marginLeft:10,fontWeight:'bold'}} onChangeText={setDrillUnit}/>
            </View>
        </View>
       <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Table Height (m)  <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='meter' style={{marginLeft:10,fontWeight:'bold'}} onChangeText={setTableHeight}/>
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
                <Text style={{fontSize:8,marginLeft:10}}>Length of Drilling Rods (m)  <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='meter' style={{marginLeft:10,fontWeight:'bold'}} onChangeText={setLenDrillRod}/>
            </View>
        </View>
       <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Length of Drilling Drill Bit (m)  <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='meter' style={{marginLeft:10,fontWeight:'bold'}} onChangeText={setLenDrillBit}/>
            </View>     
        </View>
        </View>
        </View>
        <FData getBoreHoleNum={getBoreHoleNum} lenDrillBit={lenDrillBit} lenDrillRod={lenDrillRod} tableHeight={tableHeight}  startDate={startDate} endDate={endDate} drillUnit={drillUnit}/>
        <Text></Text>
     
    <Text></Text>
    <View style={{justifyContent:'center',alignItems:'center'}}>
      

<Text></Text>

    </View>
        
        </ScrollView>
       
    )
}

const styles=StyleSheet.create({
  file:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'grey',
    width:'71%',
    borderRadius:10,
    marginLeft:8
  },
  choose:{
    height:40,
    width:80,
    borderRadius:1,
    borderColor:'grey',
    backgroundColor:'grey',
    justifyContent:'center',
    alignItems:'center',
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },
  chooseHolder:{
    height:40,
    width:'70%',
    justifyContent:'center',
  }
})

export default LogForDeepWell;