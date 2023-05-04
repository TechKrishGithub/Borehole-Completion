import {View,Text, TextInput,Button,StyleSheet,ActivityIndicator,Modal, FlatList, Alert, TouchableOpacity,Image} from 'react-native';
import { useEffect, useState } from 'react';
import SData from './SData';
import { Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import {DataTable} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment, { duration } from 'moment';
import * as SQLite from 'expo-sqlite';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

const db=SQLite.openDatabase('Uganda');
const StepTest=()=>
{
    const route = useRoute();
    const [userid,setUserid]=useState();
    const [userName,setUserName]=useState();
    const [loading, setLoading] = useState(false);
    const [dataSave,setDataSave]=useState(false);

    const [dataSaving,setDataSaving]=useState(false);

    const [dataAdded,setDataAdded]=useState(false)
    
    const [blueTick,setBlueTick]=useState(false);
    const [excelMark,setExcelMark]=useState(false)

  const getBoreHoleNum = route.params.getBoreHoleNum;
    const resultSaved=[];
    useEffect(()=>
    {
      setDataSaving(false)
      try {
        db.transaction(tx=>
          {
            tx.executeSql('SELECT * FROM User_Master',
            [],
            (tx,results)=>
            {  
          
              for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows.item(i);
                setUserid(row.userid);
                setUserName(row.username)
                                      
              }                                  
            }
            )
          })                         
        }
        catch (error) {
              console.error(error.message);
            }    
        db.transaction(tx=>{
            tx.executeSql("CREATE TABLE IF NOT EXISTS "
            +"StepTestTable"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,step_no INTEGER,time INTEGER,Water_level VARCHAR,draw_down VARCHAR,discharge VARCHAR,Ec VARCHAR,remarks VARCHAR,bore_hole_num VARCHAR NOT NULL)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully StepTestTable");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })
        db.transaction(tx=>{
            tx.executeSql("CREATE TABLE IF NOT EXISTS "
            +"StepTestForm"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,step_no INTEGER,pump_on datetime,pump_off datetime,total_step INTEGER,dur_pum INTEGER,static_wat VARCHAR,dyn_wat VARCHAR,measu_point VARCHAR,pump_inst_depth VARCHAR,meas_by VARCHAR)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully StepTestForm");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })

        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS filesForStepTest (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT,bore_hole_num VARCHAR NOT NULL)',
            [],
            (tx,result)=>
            {
              console.log("filesForStepTest table Created successfully");
            },
            (tx,error)=>
            {
              console.log(error)
            }
          );
        });

    },[])
    const [selectedValue, setSelectedValue] = useState('0');
    const [stepNo,setStepNo]=useState(0);
    const [rows, setRows] = useState(1);
    const [dele,setDele]= useState([]);
    const [totStepDone,setTotStepDone]=useState('');
    const [statwaterLev,setStatWaterLev]=useState('');
    const [dynWaterLev,setDynWaterLev]=useState('');
    const [measPoint,setMeasPoint]=useState('');
    const [pumInstDep,setPumInsDep]=useState('');
    const [measBy,setMeasBy]=useState('');


    const [image,SetImage]=useState('');
const [fileName,setFileName]=useState();
const [fileData,setFileData]=useState();


    const [waterLevel,setWaterLeve]=useState('');
    const [drawDown,setDrawDown]=useState();
    const [disQ,setDisQ]=useState('');
    const [Ec,setEc]=useState('');
    const [remarks,setRemarks]=useState('');
    const [time,setTime]=useState();
    const [forDraw,setForDraw]=useState([]);
    let timeNew=0;

    // const handleInputChange = (text, inputKey) => {
    //     setInputData(prevData => {
    //       const newData = [...prevData];
    //       const inputIndex = newData.findIndex(data => data.key === inputKey);
    //       if (inputIndex >= 0) {
    //         newData[inputIndex].value = text;
    //       } else {
    //         newData.push({ key: inputKey, value: text });
    //       }
    //       return newData;
    //     });
    //   };
      
   const done=()=>
   {
    console.log(inputData);
   }


   
const pickImage=async ()=>
{
    const result = await DocumentPicker.getDocumentAsync();
    if (result.type === 'success') {
      const fileData = result.uri;
      const fileName = result.name;
      SetImage(fileName);
      setFileName(fileName);
      setFileData(fileData);
    }
  
}


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

  const handleWatLevChange = (text, index) => {
    const newData = [...forDraw];
    newData[index] = text-statwaterLev;
    setForDraw(newData);
  };

  const DataSet=()=>
  {
    const isTableEmpty = () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM StepTestForm',
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
      if(selectedValue==='0'&&stepNo===0&& totStepDone==''&&statwaterLev===''&&dynWaterLev===''&&measPoint===''&&measBy===''&&pumInstDep==='')
      {
        Alert.alert('WARNING','Please Fill Data');
      }
      else{
        if(empty)
        {
           db.transaction(tx=>
            {
                tx.executeSql('INSERT INTO StepTestForm(step_no,pump_on,pump_off,total_step,dur_pum,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by,bore_hole_num) values(?,?,?,?,?,?,?,?,?,?,?)',
                        [stepNo,pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),totStepDone,selectedValue,statwaterLev,dynWaterLev,measPoint,pumInstDep,measBy,getBoreHoleNum],
                        (tx,result)=>
                        {
                            console.log('DATA INSERTED INTO StepTestForm Empty table')
                        },
                        (tx,error)=>
                        {
                            console.log(error);
                        }
                        )   
            })
        }
        else
        {
            db.transaction(tx=>{
                tx.executeSql('SELECT step_no from StepTestForm where bore_hole_num=?',[getBoreHoleNum],
                (_, { rows }) => {
                  // Get all values from the column and check if drillPip is exists
                  const step_no_Values = rows._array.map((row) => row.step_no);
                  if (step_no_Values.includes(parseInt(stepNo))) {
                        console.log('Value of StepTestForm Already contains')
                    }
                    else
                    {
                        tx.executeSql('INSERT INTO StepTestForm(step_no,pump_on,pump_off,total_step,dur_pum,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by,bore_hole_num) values(?,?,?,?,?,?,?,?,?,?,?)',
                        [stepNo,pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),totStepDone,selectedValue,statwaterLev,dynWaterLev,measPoint,pumInstDep,measBy,getBoreHoleNum],
                        (tx,result)=>
                        {
                            console.log('DATA INSERTED INTO StepTestForm After Having Success')
                        },
                        (tx,error)=>
                        {
                            console.log(error);
                        }
                        )           
                    }
                }
                )
            })
        }
      
      }
  
    })
  
  }
 
 
    return(
       <ScrollView>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',justifyContent:'center'}}>
          
            <View style={{height:40,width:'100%',alignItems:'center',backgroundColor:'#D8EDF4',justifyContent:'center'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>STEP TEST</Text>
        </View>
        <View style={{height:350,padding:15}}>
        <View style={{height:'15%',flexDirection:'row'}}>
        <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:11,marginLeft:10,fontWeight:'bold'}}>Borehole Number</Text>
            <TextInput value={getBoreHoleNum} readOnly style={{marginLeft:10,fontWeight:'bold',color:'black'}}/>
            </View>

            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Enter Step No<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='unit' style={{marginLeft:10}} onChangeText={setStepNo}
                onBlur={()=>
                {
                    setRows(1);
                    setTotStepDone('');
                    setSelectedValue('0');
                    setStatWaterLev('');
                    setDynWaterLev('');
                    setMeasPoint('');
                    setPumInsDep('');
                    setMeasBy('');
                    setpumpOnDate(new Date());
                    setpumpOffDate(new Date());
                    setWaterLeve('');
                    setDisQ('');
                    setEc('');
                    setRemarks('');
                }}
            />
            </View>
        </View>
       <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:10,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump On<Text style={{color:'red'}}>*</Text></Text>
            <TouchableOpacity
            onPress={handleShowPickerOn}
            >
                <Text style={{marginLeft:10,fontWeight:'400',fontSize:12}}>{pumpOndate.toLocaleString()}</Text>
            {/* <TextInput placeholder='--/DateTime/--' style={{marginLeft:10,fontWeight:'bold'}} readOnly value={pumpOndate.toLocaleString()}/> */}
            </TouchableOpacity>
            <DateTimePickerModal
        isVisible={showPickerOn}
        mode="datetime"
        date={pumpOndate}
        onConfirm={handleConfirmOn}
        onCancel={handleHidePickerOn}
      />
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump Off<Text style={{color:'red'}}>*</Text></Text>
            <TouchableOpacity
            onPress={handleShowPickerOff}
            >
                 <Text style={{marginLeft:10,fontWeight:'400',fontSize:12}}>{pumpOffdate.toLocaleString()}</Text>
            {/* <TextInput placeholder='--/DateTime/--' style={{marginLeft:10,fontWeight:'bold'}} readOnly value={pumpOffdate.toLocaleString()}/> */}
            </TouchableOpacity>
            <DateTimePickerModal
        isVisible={showPickerOff}
        mode="datetime"
        date={pumpOffdate}
        onConfirm={handleConfirmOff}
        onCancel={handleHidePickerOff}
      />
            </View>
        </View>

        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
        <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:10,borderRadius:10}}>
                <Text style={{fontSize:8,marginLeft:10}}>Total Steps Done<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setTotStepDone}
                value={totStepDone.toString()}
                />
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Duration of pump test(min)<Text style={{color:'red'}}>*</Text></Text>
            <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        style={{marginTop:-10}}
      >
        <Picker.Item label='--select--' value='0'/>
        <Picker.Item label="60" value="60" />
        <Picker.Item label="90" value="90" />
        <Picker.Item label="120" value="120" />
      </Picker>
            </View>
           
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
        <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:10,borderRadius:10}}>
                <Text style={{fontSize:8,marginLeft:10}}>Static Water Level(m.b.no)<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setStatWaterLev}
                value={statwaterLev.toString()}
                />
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Dynamic Water Level(m.b.mp)<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setDynWaterLev}
                value={dynWaterLev.toString()}
                />
            </View>
            
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            
        <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Measuring Point(m.b.g.l)<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setMeasPoint}
                value={measPoint.toString()}
                />
            </View>
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Pump Installation Depth(m)<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setPumInsDep}
                value={pumInstDep.toString()}
                />
            </View>
        </View>
        <Text></Text>
        <View style={{height:'15%',flexDirection:'row'}}>
            
        <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:8,marginLeft:10}}>Measured By<Text style={{color:'red'}}>*</Text></Text>
                <TextInput keyboardType='numeric' placeholder='Enter' style={{marginLeft:10}}
                onChangeText={setMeasBy}
                value={measBy.toString()}
                />
            </View>
            
        </View>
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>

        <ScrollView>
            
            <ScrollView horizontal={true}>
                <View>
                <DataTable>
                    <DataTable.Header>
                    <DataTable.Title style={{
                            borderWidth:1,
                            borderColor:'grey',
                            width:80,
                            justifyContent:'center',
                            backgroundColor:'#9efcfa',
                            flex:1
                    }}><Text style={styles.HeadText}>Step No</Text></DataTable.Title>
                    <DataTable.Title style={{
                            borderWidth:1,
                            borderColor:'grey',
                            width:90,
                            justifyContent:'center',
                            backgroundColor:'#9efcfa',
                            flex:1
                    }}><Text style={styles.HeadText}>Time (mins)</Text></DataTable.Title>
                    <DataTable.Title style={{
                         borderWidth:1,
                         borderColor:'grey',
                         width:150,
                         justifyContent:'center',
                         backgroundColor:'#9efcfa',
                         flex:1
                    }}><Text style={styles.HeadText}>WaterLevel (mbmp) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                    <DataTable.Title style={styles.Header}><Text style={styles.HeadText}> Drawdown(mbmp)<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                    <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Discharge.Q (m3/h)</Text></DataTable.Title>
                    <DataTable.Title style={{
                          borderWidth:1,
                          borderColor:'grey',
                          width:80,
                          justifyContent:'center',
                          backgroundColor:'#9efcfa',
                          flex:1
                    }}><Text style={styles.HeadText}>EC (us/cm)</Text></DataTable.Title>
                    <DataTable.Title  style={{
                         borderWidth:1,
                         borderColor:'grey',
                         width:80,
                         justifyContent:'center',
                         backgroundColor:'#9efcfa',
                         flex:1
                    }}><Text style={styles.HeadText}>Remarks</Text></DataTable.Title>
                    <DataTable.Title  style={{
                         borderWidth:1,
                         borderColor:'grey',
                         width:70,
                         justifyContent:'center',
                         backgroundColor:'#9efcfa',
                         flex:1
                    }}></DataTable.Title>
                   
                    </DataTable.Header>
                    {
                    Array.from(Array(rows)).map((_, index) => 
                {
                    for(let i=0;i<Array.length;i++)
                    {
                     if(index===0)
                     {
                         timeNew=timeNew;
                     }
                     else
                     {
                         if(timeNew >= 5040)
                         {
                             timeNew=timeNew+360;
                         }
                         if(timeNew >= 2160 && timeNew < 5040)
                         {
                             timeNew=timeNew+240;
                         }
    
                         if(timeNew >= 1200 && timeNew < 2160)
                         {
                             timeNew=timeNew+120;
                         }
                         if(timeNew >= 480 && timeNew < 1200)
                         {
                             timeNew=timeNew+60;
                         } 
    
                         if(timeNew >= 180 && timeNew < 480)
                         {
                             timeNew=timeNew+30;
                         }
                         if(timeNew >= 100 && timeNew < 180)
                         {
                             timeNew=timeNew+20
                         }
                         if(timeNew >= 60 && timeNew < 100)
                         {
                             timeNew=timeNew+10;
                         }
                         if (timeNew >= 20 && timeNew < 60)
                         {
                             timeNew=timeNew+5;
                         }
                         if(timeNew>=10 && timeNew < 20)
                         {
                             timeNew=timeNew+2;
                         }
                         
                         if(timeNew < 10)
                         {
                             timeNew=timeNew+1;
                        }   
                     }
                    }
                    return(
                    <DataTable.Row  key={index}>
                         <DataTable.Cell style={{
                             borderWidth:1,
                             borderColor:'grey',
                             width:80,
                             justifyContent:'center',
                             height:50,
                             backgroundColor:'#d8e6d8'
                         }}><Text  style={{color:'black',fontSize:12}} >{stepNo}</Text></DataTable.Cell>
                         <DataTable.Cell style={{
                               borderWidth:1,
                               borderColor:'grey',
                               width:90,
                               justifyContent:'center',
                               height:50,
                               backgroundColor:'#d8e6d8'
                         }}><Text style={{color:'black',fontSize:12}}>{timeNew}</Text></DataTable.Cell>
                        <DataTable.Cell style={{
                             borderWidth:1,
                             borderColor:'grey',
                             width:150,
                             justifyContent:'center',
                             height:50,
                             backgroundColor:'#d8e6d8'
                        }}>
                        <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:4,opacity:0}}>.......................................    
                            ................................................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>.....................</Text>
                        <TextInput placeholder='WaterLeve' keyboardType='numeric' key="waterleve"
                        style={{color:'black',fontSize:12}}          
                        onChangeText={(text)=>
                        {
                            setWaterLeve(text);
                            handleWatLevChange(text, index);
                            setTime(timeNew);
                        }}
                        onBlur={()=>
                        {
                            setDrawDown(forDraw[index])
                        }}
                        />
                        </View>
                        <Text style={{fontSize:4,opacity:0}}>...............................
                        .....................................................................</Text>
                        </View>
                        
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.field}>
                        <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:4,opacity:0}}>.......................................    
                            .........................................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>................</Text>
                            <Text style={{color:'black',fontSize:12}}>{forDraw[index]||<Text style={{color:'grey'}}>Drawdown(mbmp)</Text>}</Text>
                            </View>
                            <Text style={{fontSize:5,opacity:0}}>................</Text>
                        <Text style={{fontSize:4,opacity:0}}>...............................
                        .....................................................................</Text>
                        </View>
                            </DataTable.Cell>
                        <DataTable.Cell style={styles.field}>
                        <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:4,opacity:0}}>.......................................    
                            .........................................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>................</Text>
                                <TextInput placeholder='Discharge.Q' keyboardType='numeric'  onChangeText={setDisQ} style={{color:'black',fontSize:12}}/>
                                </View>
                        <Text style={{fontSize:4,opacity:0}}>...............................
                        .....................................................................</Text>
                        </View>
                                </DataTable.Cell>
                        <DataTable.Cell style={{
                              borderWidth:1,
                              borderColor:'grey',
                              width:80,
                              justifyContent:'center',
                              height:50,
                              backgroundColor:'#d8e6d8'
                        }}>
                             <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:4,opacity:0}}>................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>.......</Text>
                            <TextInput placeholder='EC (us/cm)' keyboardType='numeric'  onChangeText={setEc} style={{color:'black',fontSize:12}}/>
                            </View>
                        <Text style={{fontSize:4,opacity:0}}>...............................</Text>
                        </View>
                            </DataTable.Cell>
                        <DataTable.Cell style={{
                              borderWidth:1,
                              borderColor:'grey',
                              width:80,
                              justifyContent:'center',
                              height:50,
                              backgroundColor:'#d8e6d8'
                        }}>
                             <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:4,opacity:0}}>................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text>
                            <TextInput placeholder='Remarks' onChangeText={setRemarks}  style={{color:'black',fontSize:12}}/>
                            </View>
                        <Text style={{fontSize:4,opacity:0}}>...............................</Text>
                        </View>
                            </DataTable.Cell>
                        <DataTable.Cell style={{
                              borderWidth:1,
                              borderColor:'grey',
                              width:70,
                              justifyContent:'center',
                              height:50,
                              backgroundColor:'#d8e6d8'
                        }}><TouchableOpacity onPress={() => {
                            if(index==0)
                            {
                                Alert.alert('WARNING','Sorry First Row Cannot Delete')
                            }
                            else
                            {
                                setRows(rows-1)
                                db.transaction(tx => {
                                    tx.executeSql(
                                      'DELETE FROM StepTestTable WHERE time = ? AND bore_hole_num=?',
                                      [timeNew,getBoreHoleNum],
                                      (_, result) => {
                                        console.log('Rows affected:', result.rowsAffected); 
                                      },
                                      (_, error) => {
                                        console.log('Error deleting data:', error);
                                      }
                                    );
                                  });
                            }
                        }}>
                        <Image source={require('../assets/trash.jpg')} style={{height:35,width:35,borderRadius:4}}/>    
                        </TouchableOpacity>
                        </DataTable.Cell>
                    </DataTable.Row>
                     )})}
                </DataTable>
                </View>
            </ScrollView>
            <Text></Text>
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
            <Button onPress={()=>
            {
                if(waterLevel=='')
                {
                    Alert.alert('WARNING','Sorry Please Fill Required Fills')
                }
                else{
                    setRows(rows+1)
                    db.transaction(tx=>{
                        tx.executeSql('SELECT time from StepTestTable where step_no=? AND bore_hole_num= ?',[stepNo,getBoreHoleNum],
                        (_, { rows }) => {
                          // Get all values from the column and check if drillPip is exists
                          const timeValues = rows._array.map((row) => row.time);
                          if (timeValues.includes(timeNew)) {
                            console.log('Value already exists in the column');
                          }
                          else{                        
                            tx.executeSql('INSERT INTO StepTestTable(step_no,time,Water_level,draw_down,discharge,Ec,remarks,bore_hole_num) values(?,?,?,?,?,?,?,?)',
                            [stepNo,time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum],
                            (tx,result)=>
                            {
                                console.log('DATA INSERTED INTO StepTestTable Success')
                            },
                            (tx,error)=>
                            {
                                console.log(error);
                            }
                            )                     
                               }
                              
                             },
                            )
                         })
                    
                }
                    console.log(stepNo,time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum)

                
              
            }} 
            
            title='Add Row'/> 
            </View>
            <Text></Text>

            <View style={{flexDirection:'row',marginLeft:15}}>
          <Text style={{fontWeight:'bold'}}>Attach Step Test Report </Text>
          <Text style={{color:'red'}}>*</Text>
          </View>
          <Text style={{fontSize:5}}></Text>

<View style={styles.file}>
            <TouchableOpacity
            onPress={pickImage}
            >
                <View style={styles.choose}>
                <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>ChooseFile</Text>
                </View>
                </TouchableOpacity>
                <View style={styles.chooseHolder}>
                <TextInput placeholder='no file choosen' style={{marginLeft:10}} value={image} disable/>
                {/* {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 ,marginLeft:300}} />} */}
                {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
                </View>
    </View>

            <Text></Text>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Button title='save' onPress={()=>
            
                {
                    if(waterLevel==''||fileName==null||fileData==null)
                    {
                        Alert.alert('WARNING','Sorry Please Fill Required Fills')
                    }
                    else
                    {
                      setDataSaving(true);
                      db.transaction(tx=>
                        {
                          tx.executeSql('SELECT bore_hole_num from filesForStepTest',
                          [],
                          (_,{rows})=>
                          {
                            const boreholeNum=rows._array.map((row)=>row.bore_hole_num);
                            if(boreholeNum.includes(getBoreHoleNum))
                            {
                              console.log("file already exist");
                            }
                            else
                            {
                              tx.executeSql(
                                'INSERT INTO filesForStepTest (name, data , bore_hole_num) VALUES (?, ? ,?)',
                                [fileName, fileData,getBoreHoleNum],
                                (tx, results) => {
                                  console.log('File inserted filesForStepTest into database');
                                },
                                (error)=>
                                {
                                  console.log(error);
                                }
                              )
                            }
                          }
                          )
                        })
                      
                      DataSet();
                        db.transaction(tx=>{
                            tx.executeSql('SELECT time from StepTestTable where step_no=? AND bore_hole_num=?',[stepNo,getBoreHoleNum],
                            (_, { rows }) => {
                              // Get all values from the column and check if drillPip is exists
                              const timeValues = rows._array.map((row) => row.time);
                              if (timeValues.includes(time)) {
                                setDataSaving(false);
                                Alert.alert('Warning','Data Already Saved on this step number')
                                console.log('Value already exists in the column');
                              }
                              else{                        
                                tx.executeSql('INSERT INTO StepTestTable(step_no,time,Water_level,draw_down,discharge,Ec,remarks,bore_hole_num) values(?,?,?,?,?,?,?,?)',
                                [stepNo,time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum],
                                (tx,result)=>
                                {
                                    console.log('DATA INSERTED INTO StepTestTable Success')
                                    setDataSaving(false);
                                    setDataSave(true);
                                    setTimeout(()=>
                                    {
                                     setDataSave(false);
                                    },1000)
                                },
                                (tx,error)=>
                                {
                                  setDataSaving(false);
                                    console.log(error);
                                }
                                )                     
                                   }
                                  
                                 },
                                )
                             })
                  }
                }}/> 
                {/* <Text></Text>
                <Button
        onPress={()=>
        {
            db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM StepTestTable where bore_hole_num=?",[getBoreHoleNum],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                            const { id,step_no,time,Water_level,draw_down,discharge,Ec,remarks,bore_hole_num} = results.rows.item(i);
                            console.log(`id: ${id}, step_no: ${step_no}, time: ${time}, Water_level:${Water_level} ,draw_down :${draw_down},discharge:${discharge},Ec:${Ec} ,remarks :${remarks},bore_hole_num:${bore_hole_num}`);
                        }
                    }
                )
              })
        }}
        title='checkTable'
        />
        <Text></Text>
        <Button
        onPress={()=>
        {
            db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM StepTestForm where bore_hole_num=?",[getBoreHoleNum],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                            const { id,bore_hole_num,step_no,pump_on,pump_off,total_step,dur_pum,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by} = results.rows.item(i);
                            console.log(`id: ${id},bore_hole_num:${bore_hole_num}, step_no: ${step_no}, pump_on: ${pump_on}, pump_off:${pump_off} ,total_step :${total_step},dur_pum:${dur_pum},static_wat:${static_wat} ,dyn_wat :${dyn_wat},measu_point :${measu_point},pump_inst_depth :${pump_inst_depth},meas_by :${meas_by}`);
                        }
                    }
                )
              })
        }}
        title='checkForm'
        /> */}
        <Text></Text>
        {/* <Button
        title='drop'
        onPress={()=>
        {
            db.transaction(tx => {
                tx.executeSql(
                  'DROP TABLE IF EXISTS StepTestForm',
                  [],
                  (_, result) => {
                    console.log('StepTestRecovery Table deleted');
                  },
                  (_, error) => {
                    console.log('Error deleting table:', error);
                  }
                );
          
            })
        }}
        />
        <Text></Text> */}
        {/* <Button
        onPress={async ()=>
        {
          setLoading(true)
            const isTableEmpty = () => {
                return new Promise((resolve, reject) => {
                  db.transaction((tx) => {
                    tx.executeSql(
                      'SELECT COUNT(*) as count FROM StepTestForm where bore_hole_num=?',
                      [getBoreHoleNum],
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
              const isTableEmpty2 = () => {
                return new Promise((resolve, reject) => {
                  db.transaction((tx) => {
                    tx.executeSql(
                      'SELECT COUNT(*) as count FROM StepTestTable where bore_hole_num=?',
                      [getBoreHoleNum],
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
                if(!empty)
                {                    
                    isTableEmpty2().then(async(empty)=>{
                        if(!empty)
                        {                
                         
                            db.transaction(tx=>
                                {                                
                                 tx.executeSql('SELECT * FROM StepTestForm where bore_hole_num=?',
                                  [getBoreHoleNum],
                                  (tx,results)=>
                                  {            
                                    console.log(results.rows.length)
                                    for (let i = 0; i <results.rows.length;i++)
                                     {                                        
                                        const stepTestTableArrayData=[];
                                        const { id,bore_hole_num,step_no,pump_on,pump_off,total_step,dur_pum,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by} = results.rows.item(i);        

                                              tx.executeSql('SELECT * FROM StepTestTable where step_no=? AND bore_hole_num=?',
                                              [step_no,getBoreHoleNum],
                                              
                                              (tx,results)=>
                                              {
                                                
                                                for (let i = 0; i < results.rows.length; i++) {
                                                  const row = results.rows.item(i);                                                  
                                                  stepTestTableArrayData.push({
                                                      StepNo:row.step_no,
                                                      Time:row.time,
                                                      Water_Level:row.Water_level,
                                                      Draw_Down:row.draw_down,
                                                      Discharge:row.discharge,
                                                      EC:row.Ec,
                                                      Remarks:row.remarks
                                                  });
                                                }        
                                                     console.log(stepTestTableArrayData) 
                                              }
                                              )                
                                            
                                              fetch('http://182.18.181.115:8091/api/BoreholeNumber/Get/', {
                                                method: 'POST',
                                                headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                              },
                                             body: JSON.stringify({
                                               userId: userid,
                                               BoreholeNumber: getBoreHoleNum,
                                             }),
                                           })
                                             .then((response) => response.json()).
                                             then(resData=>JSON.parse(resData))
                                             .then((responseData) => {
                                               
                                               if(responseData.length!==0)
                                               {  
                                                const bID=responseData[0].boreholeId;
                                                console.log(bID);
                                                fetch('http://182.18.181.115:8091//api/StepTest/Insert',
                                                {
                                                method: 'POST',
                                                headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                              },
                                             body: JSON.stringify({
                                                DrawdownPumpOn: pump_on,
                                                DrawdownPumpOff: pump_off,
                                                StepTestNo: step_no,
                                                DrawdownDuration: dur_pum,
                                                DrawdownSWL: static_wat,
                                                DrawdownDWL: dyn_wat,
                                                DrawdownMeasuringPoint: measu_point,
                                                DrawdownPumpInstallationDepth: pump_inst_depth,
                                                DrawdownMeasuredBy: meas_by,
                                                DrawdownTable: stepTestTableArrayData,
                                                DrawdownSiteFile:'dfkdfkdjfd',
                                                userid: userid,
                                                userName:userName,
                                                boreholeId:bID
                                             }),
                                           }).then(response=>response.json()).
                                           then(responseData=>JSON.parse(responseData)).
                                           then(result=>
                                            {
                                                resultSaved.push(result)
                                                console.log(resultSaved)
                                                if(result==='Saved')
                                                {
                                                  setLoading(false);
                                                  setBlueTick(true);
                                                  setTimeout(()=>
                                                  {
                                                    setBlueTick(false)
                                                  },1000)
                                                  
                                                                           
                                                }
                                                else
                                                {
                                                  setLoading(false)                                  
                                                    Alert.alert('WARNING','Data Already Exist on '+step_no+' this number ')                                        
                                                }                                        
                                            }
                                            )
                                           .catch(error=>console.log(error))         
                                               }
                                            })
                                                
                                 
                                    }
                                  }
                                  
                                  )
                                })
                        }
                        else
                        {
                          setLoading(false)
                          setExcelMark(true)
                          setTimeout(()=>
                          {
                            setExcelMark(false);
                          },2000)
                        }
                    })
                }
                else
                {
                    setLoading(false)
                    Alert.alert('WARNING','Sorry StepTestForm having no data')
                }
            })
            
        }}
        
        title='SYNC'
        />
          */}
        {/* <Text></Text>
        <Button
        onPress={()=>
        {
            console.log(resultSaved)
        }}
        title='reChec'
        /> */}
            {/* <Pressable 
            onPress={done}
            style={({pressed})=>({backgroundColor:pressed?'#fff':'#1a06fd'})}
            >
            <View style={{height:35,width:80,marginRight:10,justifyContent:'center',alignItems:'center'}}>
          <Text style={styles.Save}>Save</Text>
          </View>
        </Pressable> */}
        </View>
       
            </ScrollView>

        </View>

        <Modal visible={dataSaving} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
            <ActivityIndicator size="large" color="#fff" style={{fontSize:60}}/>
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
            style={{fontSize:25,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Saving.....</Text>
            </View>
                  </Modal>

        <Modal visible={dataSave} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataSaveRight1.png')} style={{height:60,width:60}}/>
            <Text
            style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Data Saved Succesfully</Text>
            </View>
                  </Modal>

        <Modal visible={loading} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
            <ActivityIndicator size="large" color="#fff" style={{fontSize:60}}/>
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
            style={{fontSize:25,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Sending.....</Text>
            </View>
                  </Modal>

                  <Modal visible={blueTick} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
            <Text
            style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Sended Succefully....</Text>
            </View>
                  </Modal>

                  <Modal visible={excelMark} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
            <Text
            style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >stepTestTable having no data please fill</Text>
            </View>
                  </Modal>


                  <Modal visible={dataAdded} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataSaveRight1.png')} style={{height:60,width:60}}/>
            <Text
            style={{fontSize:23,color:'#1af9ad',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Boreholenumber Added</Text>
            </View>
                  </Modal>


        </ScrollView>
       
    )
}

const styles=StyleSheet.create({
    Header:{
        borderWidth:1,
        borderColor:'grey',
        width:140,
        justifyContent:'center',
        backgroundColor:'#9efcfa',
        flex:1
    },
    field:{
        borderWidth:1,
        borderColor:'grey',
        width:140,
        justifyContent:'center',
        height:50,
        backgroundColor:'#d8e6d8'
    },
    HeadText:{
        color:'#4b3a4b',
        fontSize:15,
        fontWeight:'bold'
    },
    button: {
        marginLeft: -10,
      },
      Save: {
        fontSize:20
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
        borderBottomLeftRadius:10,
      },
      chooseHolder:{
        height:40,
        width:'70%',
        justifyContent:'center'
      },
file:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:'grey',
    width:'71%',
    borderRadius:10,
    marginLeft:8
  },
     
})

export default StepTest;