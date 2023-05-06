import {View,Text, TextInput,Button,TouchableOpacity} from 'react-native';
import { useState } from 'react';
import ConstDisTable from './ConstantDisTable';
import { Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const db=SQLite.openDatabase('Uganda');
const ConstantDischargeTest=()=>
{
    const [selectedValue, setSelectedValue] = useState('0');
    const route = useRoute();
    const getBoreHoleNum = route.params.getBoreHoleNum;

 
    const [statwaterLev,setStatWaterLev]=useState('');
    const [dynWaterLev,setDynWaterLev]=useState('');
    const [measPoint,setMeasPoint]=useState('');
    const [pumInstDep,setPumInsDep]=useState('');
    const [measBy,setMeasBy]=useState('');

    const [pumpOndate, setpumpOnDate] = useState(new Date());
    const [pumpOffdate, setpumpOffDate] = useState(new Date());
   const [showPickerOn, setShowPickerOn] = useState(false);
   const [showPickerOff, setShowPickerOff] = useState(false);

        useEffect(()=>
        {
            db.transaction(tx=>{
                tx.executeSql("CREATE TABLE IF NOT EXISTS "
                +"ConstantDesTest"
                +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,pump_on TIMESTAMP,pump_off TIMESTAMP,dur_pum_test INTEGER,static_wat VARCHAR,dyn_wat VARCHAR,measu_point VARCHAR,pump_inst_depth VARCHAR,meas_by VARCHAR)",
                [],
                (tx,result)=>
                {
                    console.log("Table created successfully ConstantDesTest");
                },
                (tx,error)=>
                {
                    console.log("Sorry something went wrong ", error);
                }
                )
              })

              db.transaction(tx=>{
                tx.executeSql("CREATE TABLE IF NOT EXISTS "
                +"ConstantDesTestTable"
                +"(id INTEGER PRIMARY KEY AUTOINCREMENT,time INTEGER,Water_level VARCHAR,draw_down VARCHAR,discharge VARCHAR,Ec VARCHAR,remarks VARCHAR,bore_hole_num VARCHAR NOT NULL)",
                [],
                (tx,result)=>
                {
                    console.log("Table created successfully ConstantDesTestTable");
                },
                (tx,error)=>
                {
                    console.log("Sorry something went wrong ", error);
                }
                )
              })
        },[])


        const handleConfirmOn = (selectedDate) => {
            setShowPickerOn(false);
            setpumpOnDate(selectedDate);
          };
        
          const handleShowPickerOn = () => {
            setShowPickerOn(true);
          };
        
          const handleHidePickerOn = () => {
            setShowPickerOn(false);
          };
        
          const handleConfirmOff = (selectedDate) => {
            setShowPickerOff(false);
            setpumpOffDate(selectedDate);
          };
          const handleShowPickerOff = () => {
            setShowPickerOff(true);
          };
        
          const handleHidePickerOff = () => {
            setShowPickerOff(false);
          };

    return(
       <ScrollView >
      
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          
            <View style={{height:40,width:'100%',alignItems:'center',backgroundColor:'#D8EDF4',justifyContent:'center'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>CONSTANT DISCHARGE TEST</Text>
        </View>
        <Text></Text>
        <View style={{height:350,padding:5}}>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:11,marginLeft:10,fontWeight:'bold'}}>Borehole Number</Text>
            <TextInput value={getBoreHoleNum} disable style={{marginLeft:10,fontWeight:'bold'}}/>
            </View>

            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump on  <Text style={{color:'red'}}>*</Text></Text>
            <TouchableOpacity
            onPress={handleShowPickerOn}
            >
                <Text style={{marginLeft:10,fontWeight:'400'}}>{pumpOndate.toLocaleString()}</Text>
            {/* <TextInput placeholder='--/DateTime/--' style={{marginLeft:10,fontWeight:'bold'}} readOnly           value={pumpOndate.toLocaleString()}/> */}
            </TouchableOpacity>
            <DateTimePickerModal
        isVisible={showPickerOn}
        mode="datetime"
        date={pumpOndate}
        onConfirm={handleConfirmOn}
        onCancel={handleHidePickerOn}
      />
            </View>
        </View>
       <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump off  <Text style={{color:'red'}}>*</Text></Text>
            <TouchableOpacity
            onPress={handleShowPickerOff}
            >
                <Text style={{marginLeft:10,fontWeight:'400'}}>{pumpOffdate.toLocaleString()}</Text>
            {/* <TextInput placeholder='--/DateTime/--' style={{marginLeft:10,fontWeight:'bold'}} readOnly  value={pumpOndate.toLocaleString()}/> */}
            </TouchableOpacity>
            <DateTimePickerModal
        isVisible={showPickerOff}
        mode="datetime"
        date={pumpOffdate}
        onConfirm={handleConfirmOff}
        onCancel={handleHidePickerOff}
      />
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Duration of pump test(min) <Text style={{color:'red'}}>*</Text></Text>
            <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        style={{marginTop:-10}}
      >
        <Picker.Item label='--select--' value='0'/>
        <Picker.Item label="720" value="720" />
        <Picker.Item label="1440" value="1440" />
        <Picker.Item label="2160" value="2160" />
        <Picker.Item label="2880" value="2880" />
        <Picker.Item label="3600" value="3600" />
        <Picker.Item label="4320" value="4320" />
        <Picker.Item label="5040" value="5040" />
        <Picker.Item label="5760" value="5760" />
      </Picker>
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Static Water Level(m.b.no) <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}} onChangeText={setStatWaterLev}/>
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Dynamic Water Level(m.b.mp) <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}} onChangeText={setDynWaterLev}/>
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Measuring Point(m.b.g.l) <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}} onChangeText={setMeasPoint}/>
            </View>
            
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump Installation Depth(m) <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}} onChangeText={setPumInsDep}/>
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Measured By <Text style={{color:'red'}}>*</Text></Text>
                <TextInput placeholder='Enter' style={{marginLeft:10}} onChangeText={setMeasBy}/>
            </View>
            
           
        </View>
        </View>
        <ConstDisTable getBoreHoleNum={getBoreHoleNum} pumpOndate={pumpOndate} pumpOffdate={pumpOffdate} selectedValue={selectedValue} statwaterLev={statwaterLev} dynWaterLev={dynWaterLev} measPoint={measPoint} pumInstDep={pumInstDep} measBy={measBy}/>
        </View>
        </ScrollView>
       
    )
}



export default ConstantDischargeTest;