import {View,Text, TextInput,Button,TouchableOpacity} from 'react-native';
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { useRoute } from '@react-navigation/native';
import ConstTesRecTable from './ConstTesRecTable';


const db=SQLite.openDatabase('Uganda');
const ConstantTestRecovery=()=>
{
   
    const route = useRoute();
    const getBoreHoleNum = route.params.getBoreHoleNum;
    useEffect(()=>{
        db.transaction(tx=>{
            tx.executeSql("CREATE TABLE IF NOT EXISTS "
            +"ConstantTestRecovery"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,pumpOn DATETIME NOT NULL,pumpOff DATETIME NOT NULL,DuPumtime INTEGER NOT NULL,staicWaterLev VARCHAR NOT NULL,DynWaterLev VARCHAR,measureP VARCHAR,pumpInstdep VARCHAR,measBy VARCHAR)",
            [],
            (tx,result)=>
            {
                console.log("created successfully ConstantTestRecovery");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })
  },[])
  const [duraPumpTest,setDuraPumpTest]=useState('');
  const [statWatLeve,setStatWatLeve]=useState('');
  const [dynWatLeve,setDynWatLev]=useState('');
  const [mesPoint,setMesPoint]=useState('');
  const [pumInstDep,setPumInstDep]=useState('');
  const [mesBy,setMesBy]=useState('');

  const [pumpOndate, setpumpOnDate] = useState(new Date());
 const [pumpOffdate, setpumpOffDate] = useState(new Date());
const [showPickerOn, setShowPickerOn] = useState(false);
const [showPickerOff, setShowPickerOff] = useState(false);

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
       <ScrollView>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          
            <View style={{height:40,width:'100%',alignItems:'center',backgroundColor:'#D8EDF4',justifyContent:'center'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>CONSTANT TEST RECOVERY</Text>
        </View>
        <Text></Text>
        <View style={{height:350,padding:5}}>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:11,marginLeft:10,fontWeight:'bold'}}>Borehole Number</Text>
            <TextInput value={getBoreHoleNum} disable style={{marginLeft:10,fontWeight:'bold'}}/>
            </View>

            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump on <Text style={{color:'red'}}>*</Text></Text>
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
            <Text style={{fontSize:8,marginLeft:10}}>Pump Off <Text style={{color:'red'}}>*</Text></Text>
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
            <Text style={{fontSize:8,marginLeft:10}}>Duration of pump test(min)  <Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='min' style={{marginLeft:10}}
                onChangeText={setDuraPumpTest}
                />
           
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Static Water Level(m.b.no) <Text style={{color:'red'}}>*</Text></Text>
            <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setStatWatLeve}
                />
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Dynamic Water Level(m.b.mp) <Text style={{color:'red'}}>*</Text></Text>
            <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setDynWatLev}
                />
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Measuring Point(m.b.g.l) <Text style={{color:'red'}}>*</Text></Text>
            <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setMesPoint}
                />
            </View>
            
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump Installation Depth(m) <Text style={{color:'red'}}>*</Text></Text>
            <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setPumInstDep}
                />
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Measured By <Text style={{color:'red'}}>*</Text></Text>
            <TextInput placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setMesBy}
                />
            </View>
            
           
        </View>
        </View>
        <ConstTesRecTable getBoreHoleNum={getBoreHoleNum} duraPumpTest={duraPumpTest} statWatLeve={statWatLeve} dynWatLeve={dynWatLeve} mesPoint={mesPoint} pumInstDep={pumInstDep} mesBy={mesBy} pumpOndate={pumpOndate} pumpOffdate={pumpOffdate}/>
        </View>
        </ScrollView>
       
    )
}



export default ConstantTestRecovery;