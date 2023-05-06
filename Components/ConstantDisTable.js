import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button, ScrollView,StyleSheet, Image, Alert,Modal,ActivityIndicator} from 'react-native';
import { TouchableOpacity} from 'react-native';
import { useState,useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as DocumentPicker from 'expo-document-picker';

const db=SQLite.openDatabase('Uganda');
const ConstDisTable=(props)=>
{
    const [rows, setRows] = useState(1);

    const ConstDisTableData=[];

    const [image,SetImage]=useState('');
const [fileName,setFileName]=useState();
const [fileData,setFileData]=useState();


    useEffect(()=>
    {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS filesForConstDis (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT,bore_hole_num VARCHAR NOT NULL)',
          [],
          (tx,result)=>
          {
            console.log("filesForConstDis table Created successfully");
          },
          (tx,error)=>
          {
            console.log(error)
          }
        );
      });

    },[])

    const [waterLevel,setWaterLeve]=useState('');
    const [drawDown,setDrawDown]=useState();
    const [disQ,setDisQ]=useState('');
    const [Ec,setEc]=useState('');
    const [remarks,setRemarks]=useState('');
    const [time,setTime]=useState();
    const [forDraw,setForDraw]=useState([]);
 
    const [dataSave,setDataSave]=useState(false);
    const [dataSaving,setDataSaving]=useState(false)

    const pumpOndate=props.pumpOndate;
    const pumpOffdate=props.pumpOffdate;
    const selectedValue=props.selectedValue;
    const statwaterLev=props.statwaterLev;
    const dynWaterLev=props.dynWaterLev;
    const measPoint=props.measPoint;
    const pumInstDep=props.pumInstDep;
    const measBy=props.measBy;
    const getBoreHoleNum=props.getBoreHoleNum;
    let timeNew=0;
   

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



      const handleWatLevChange = (text, index) => {
        const newData = [...forDraw];
        newData[index] = text-statwaterLev;
        setForDraw(newData);
      };
    
      
   const DataSet=()=>
   {
    if(waterLevel==='')
    {
        Alert.alert('WARNING','Sorry Please Fill Required Fills')
    }
    else
    {
        db.transaction(tx=>{
            tx.executeSql('SELECT time from ConstantDesTestTable where bore_hole_num= ?',[getBoreHoleNum],
            (_, { rows }) => {
              // Get all values from the column and check if drillPip is exists
              const timeValues = rows._array.map((row) => row.time);
              if (timeValues.includes(timeNew)) {
                console.log('Value already exists in the column');
              }
              else{                        
                tx.executeSql('INSERT INTO ConstantDesTestTable(time,Water_level,draw_down,discharge,Ec,remarks,bore_hole_num) values(?,?,?,?,?,?,?)',
                [time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum],
                (tx,result)=>
                {
                    console.log('DATA INSERTED INTO ConstantDesTestTable Success')
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
        console.log(time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum) 
   }


   const Save=()=>
   {
   
    const isTableEmpty = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM ConstantDesTest',
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
        if(selectedValue==='0'&&statwaterLev===''&&dynWaterLev===''&&measPoint===''&&measBy===''&&pumInstDep==='')
        {
          Alert.alert('WARNING','Please Fill Data');
        }
        else{
          if(empty)
          {
            setDataSaving(true);
            db.transaction(tx=>
              {
                tx.executeSql('SELECT bore_hole_num from filesForConstDis',
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
                      'INSERT INTO filesForConstDis (name, data , bore_hole_num) VALUES (?, ? ,?)',
                      [fileName, fileData,getBoreHoleNum],
                      (tx, results) => {
                        console.log('File inserted filesForConstDis into database');
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
             db.transaction(tx=>
              {
                  tx.executeSql('INSERT INTO ConstantDesTest(pump_on,pump_off,dur_pum_test,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by,bore_hole_num) values(?,?,?,?,?,?,?,?,?)',
                          [pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),selectedValue,statwaterLev,dynWaterLev,measPoint,pumInstDep,measBy,getBoreHoleNum],
                          (tx,result)=>
                          {
                              console.log('DATA INSERTED INTO ConstantDesTest success')
                              setDataSaving(false)
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
              })
          }
          else
          {
            DataSet();
              db.transaction(tx=>{
                    tx.executeSql('SELECT bore_hole_num from ConstantDesTest ',[],
                    (_, { rows }) => {
                      // Get all values from the column and check if drillPip is exists
                      const bore_hole_num_Values = rows._array.map((row) => row.bore_hole_num);
                      if (bore_hole_num_Values.includes(getBoreHoleNum)) {
                        setDataSaving(false);
                        Alert.alert('WARNING','Data Already exist');
                            console.log('Value of ConstantDesTest Already contains')
                        }
                        else
                        {
                            tx.executeSql('INSERT INTO ConstantDesTest(pump_on,pump_off,dur_pum_test,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by,bore_hole_num) values(?,?,?,?,?,?,?,?,?)',
                            [pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),selectedValue,statwaterLev,dynWaterLev,measPoint,pumInstDep,measBy,getBoreHoleNum],
                            (tx,result)=>
                            {
                                console.log('Data Inserted Succefully');
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
                  }
                  )
              })
          }
        
        }
    
      })
    
   }



    return(
        <ScrollView >
            
        <ScrollView horizontal={true}>
            <View>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Time (mins)</Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'black',
                      width:120,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}><Text style={styles.HeadText}>WaterLevel (mbmp) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'black',
                      width:120,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}><Text style={styles.HeadText}> Drawdown(mbmp)<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={{
                        borderWidth:1,
                        borderColor:'black',
                        width:120,
                        justifyContent:'center',
                        backgroundColor:'#9efcfa',
                        flex:1
                }}><Text style={styles.HeadText}>Discharge.Q (m3/h)</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>EC (us/cm)</Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}><Text style={styles.HeadText}>Remarks</Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}></DataTable.Title>
               
                </DataTable.Header>
                {Array.from(Array(rows)).map((_, index) => {    
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
                    <DataTable.Cell style={styles.field}>{timeNew}</DataTable.Cell>
                    <DataTable.Cell style={{
                          borderWidth:1,
                          borderColor:'black',
                          width:120,
                          justifyContent:'center',
                          height:50,
              
                    }}>
                    <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            .....................................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text>                    
                <TextInput placeholder='WaterLeve' keyboardType='numeric' key="waterleve"
    
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
                        <Text style={{fontSize:5,opacity:0}}>...............................</Text>
                        </View>
                </DataTable.Cell>
                    <DataTable.Cell style={{
                          borderWidth:1,
                          borderColor:'black',
                          width:120,
                          justifyContent:'center',
                          height:50,
              
                    }}>
                         <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            .....................................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text>   
                                <Text style={{color:'black',fontSize:12}}>{forDraw[index]||<Text style={{color:'grey'}}>Drawdown(mbmp)</Text>}</Text>
                        </View>
                        <Text style={{fontSize:5,opacity:0}}>...............................</Text>
                        </View>
                        </DataTable.Cell>
                    <DataTable.Cell style={{
                          borderWidth:1,
                          borderColor:'black',
                          width:120,
                          justifyContent:'center',
                          height:50,
              
                    }}>
                         <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            .....................................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text> 
                            <TextInput placeholder='Discharge.Q' keyboardType='numeric' key="Discharge" onChangeText={setDisQ}/>
                            </View>
                        <Text style={{fontSize:5,opacity:0}}>...............................</Text>
                        </View>
                            </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                    <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>......................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text> 
                            <TextInput placeholder='EC (us/cm)' keyboardType='numeric' key="EC" onChangeText={setEc}/>
                            </View>
                        <Text style={{fontSize:5,opacity:0}}>..........................</Text>
                        </View>
                            </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                    <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            .......................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text> 
                            <TextInput placeholder='Remarks' key="=remarks" onChangeText={setRemarks}/>
                            </View>
                        <Text style={{fontSize:5,opacity:0}}>..........................</Text>
                        </View>
                            </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                    <TouchableOpacity onPress={() => {
                            if(index==0)
                            {
                                Alert.alert('WARNING','Sorry First Row Cannot Delete')
                            }
                            else
                            {
                                setRows(rows-1);
                                db.transaction(tx => {
                                    tx.executeSql(
                                      'DELETE FROM ConstantDesTestTable WHERE time = ? AND bore_hole_num=?',
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
                 )
                  })}
            </DataTable>
            </View>
        </ScrollView>
        <Text></Text>
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        <Button 
      onPress={()=>
    {
        if(waterLevel==='')
        {
            Alert.alert('WARNING','Sorry Please Fill Required Fills')
        }
        else
        {
            setRows(rows+1);
            db.transaction(tx=>{
                tx.executeSql('SELECT time from ConstantDesTestTable where bore_hole_num= ?',[getBoreHoleNum],
                (_, { rows }) => {
                  // Get all values from the column and check if drillPip is exists
                  const timeValues = rows._array.map((row) => row.time);
                  if (timeValues.includes(timeNew)) {
                    console.log('Value already exists in the column');
                  }
                  else{                        
                    tx.executeSql('INSERT INTO ConstantDesTestTable(time,Water_level,draw_down,discharge,Ec,remarks,bore_hole_num) values(?,?,?,?,?,?,?)',
                    [time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum],
                    (tx,result)=>
                    {
                        console.log('DATA INSERTED INTO ConstantDesTestTable Success')
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
            console.log(time,waterLevel,drawDown,disQ,Ec,remarks,getBoreHoleNum) 
    }}
        title='Add Row'/>
        </View>
        <Text></Text>
        <View style={{flexDirection:'row',marginLeft:15}}>
          <Text style={{fontWeight:'bold'}}>Attach Constant Test Report </Text>
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
                </View>
    </View>

       
        <Text></Text>
        <View style={{justifyContent:'center',alignItems:'center'}}>
            <Button title='save' onPress={Save}
            /> 
            <Text></Text>
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
    </View>
   
        </ScrollView>
    )
}
const styles=StyleSheet.create({
    Header:{
        borderWidth:1,
        borderColor:'black',
        width:100,
        justifyContent:'center',
        backgroundColor:'#9efcfa',
        flex:1
    },
    field:{
        borderWidth:1,
        borderColor:'black',
        width:100,
        justifyContent:'center',
        height:50
    },
    HeadText:{
        color:'#060707',
        fontSize:12,
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

export default ConstDisTable;