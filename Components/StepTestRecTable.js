import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button,ActivityIndicator,Modal, ScrollView,StyleSheet, Alert,TouchableOpacity,Image} from 'react-native';
import { useState,useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as DocumentPicker from 'expo-document-picker';

const db=SQLite.openDatabase('Uganda');
const StepTestRecTable=(props)=>
{
  const [userid,setUserId]=useState();
  const [userName,setUserName]=useState();
   const [loading,setLoading]=useState(false);

   const [blueTick,setBlueTick]=useState(false);
   const [excelMark,setExcelMark]=useState(false)

   const [dataSave,setDataSave]=useState(false);

   const [dataSaving,setDataSaving]=useState(false);
   
    const duraPumpTest=props.duraPumpTest;
    const statWatLeve=props.statWatLeve;
    const dynWatLeve=props.dynWatLeve;
    const mesPoint=props.mesPoint;
    const pumInstDep=props.pumInstDep;
    const mesBy=props.mesBy;
    const pumpOndate=props.pumpOndate;
    const pumpOffdate=props.pumpOffdate;
   const boreHoleNum=props.getBoreHoleNum;

   const bottom=dynWatLeve-statWatLeve;

    const [rows, setRows] = useState(1);
    const [dele,setDele]= useState([]);
    const [time,setTime]=useState();
    const [watLev,setWatLev]=useState('');
    const [draDo,setDraDo]=useState('');
    const [recovery,setRecovery]=useState(0);
    const [remarks,setRemarks]=useState('');

    const [image,SetImage]=useState('');
const [fileName,setFileName]=useState();
const [fileData,setFileData]=useState();

    const stepTestTableData=[];

    useEffect(()=>{
      
      try {
        db.transaction(tx=>
          {
            tx.executeSql('SELECT * FROM User_Master',
            [],
            (tx,results)=>
            {  
          
              for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows.item(i);
                setUserId(row.userid);
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
            +"StepTestRecoveryTable"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,TimeMin INTEGER NOT NULL,waterLeve VARCHAR NOT NULL,drawDown VARCHAR NOT NULL,recovery VARCHAR NOT NULL,remarks VARCHAR,bore_hole_num VARCHAR NOT NULL)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully StepTestRecoveryTable");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })

        
 db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS filesForStepRec (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT,bore_hole_num VARCHAR NOT NULL)',
    [],
    (tx,result)=>
    {
      console.log("filesForStepRec table Created successfully");
    },
    (tx,error)=>
    {
      console.log(error)
    }
  );
});

  },[])

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


 const DataSet=()=>
 {
    if(watLev==''||draDo=='')
    {
        Alert.alert('WARNING','Please Enter Required Fields')
    }
    else{
        db.transaction(tx=>{
            tx.executeSql('SELECT TimeMin from StepTestRecoveryTable where bore_hole_num=?',[boreHoleNum],
            (_, { rows }) => {
              // Get all values from the column and check if drillPip is exists
              const timeValues = rows._array.map((row) => row.TimeMin);
              if (timeValues.includes(time)) {
                console.log('Value already exists in the column');
              }
              else{
                tx.executeSql('INSERT INTO StepTestRecoveryTable(TimeMin,waterLeve,drawDown,recovery,remarks,bore_hole_num) values(?,?,?,?,?,?)',
                [time,watLev,draDo,recovery,remarks,boreHoleNum],
                (tx,result)=>
                {
                  setDataSave(true);
                  setTimeout(()=>
                  {
                   setDataSave(false);
                  },1000)
                    console.log('DATA INSERTED INTO StepTestRecoveryTable Success')
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
 }
 
 const [forPer,setForPer]=useState([]);
  
   const done=()=>
   {
    console.log(inputData);
   }
   const handleRecLevChange = (text, index) => {
    const newData = [...forPer];
    const top=dynWatLeve-text;
    const percentage=(top / bottom) * 100;
    newData[index] = percentage.toFixed(2) + "%";
    setForPer(newData);
  };

  
    return(
        <ScrollView>
            
        <ScrollView horizontal={true}>
            <View>
            <DataTable>
                <DataTable.Header>
               
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Time (mins)</Text></DataTable.Title>
                <DataTable.Title style={{
                     borderWidth:1.3,
                     borderColor:'grey',
                     width:100,
                     justifyContent:'center',
                     backgroundColor:'#9efcfa',
                     flex:1
                }}><Text style={styles.HeadText}>WaterLevel (mbmp) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1.3,
                      borderColor:'grey',
                      width:100,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}><Text style={styles.HeadText}> Drawdown(mbmp)<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Recovery(%)</Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}><Text style={styles.HeadText}>Remarks</Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}></DataTable.Title>
               
                </DataTable.Header>
                {Array.from(Array(rows)).map((_, index) =>
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
                return (
                <DataTable.Row  key={index}>
                   
                     <DataTable.Cell style={styles.field}><Text style={{color:'black',fontWeight:'bold',fontSize:13}}>{timeNew}</Text></DataTable.Cell>
                    <DataTable.Cell style={{
                         borderWidth:1.3,
                         borderColor:'grey',
                         width:100,
                         justifyContent:'center',
                         height:50,
            
                    }}>
                         <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            ......................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text>    
                        <TextInput placeholder='WaterLeve' keyboardType='numeric' key="waterleve" style={{color:'black',fontWeight:'bold',fontSize:13}} onChangeText={(text)=>
                        {
                            setWatLev(text)
                            setTime(timeNew)
                            handleRecLevChange(text, index);
                        }}
                        
                        />
                        </View>
                        <Text style={{fontSize:5,opacity:0}}>...............................</Text>
                        </View>
                        </DataTable.Cell>
                    <DataTable.Cell style={{
                          borderWidth:1.3,
                          borderColor:'grey',
                          width:100,
                          justifyContent:'center',
                          height:50,
              
                    }}>
                        <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            ......................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text>  
                        <TextInput placeholder='Drawdown' keyboardType='numeric' key="Drawdown" style={{color:'black',fontWeight:'bold',fontSize:13}} onChangeText={setDraDo}
    
                        />
                        </View>
                        <Text style={{fontSize:5,opacity:0}}>...............................</Text>
                        </View>
                        </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                        <View >
                        <Text style={{color:'black',fontWeight:'bold',fontSize:13}}>{forPer[index]||<Text style={{color:'grey'}}>Recovery %</Text>}</Text>
                            {/* <TextInput value='' disabled keyboardType='numeric' key="Recovery" style={{color:'black',fontWeight:'bold',fontSize:13}}/> */}
                            </View>
                            </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                    <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                            <Text style={{fontSize:5,opacity:0}}>..................
                            .................................</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:2,opacity:0}}>..........</Text>  
                            <TextInput placeholder='Remarks' key="remarks" style={{color:'black',fontWeight:'bold',fontSize:13}} onChangeText={(text)=>{
                                setRemarks(text)
                                setRecovery(forPer[index]);
                            }}/>
                            </View>
                        <Text style={{fontSize:5,opacity:0}}>...............................</Text>
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
                                setRows(rows-1)
                                db.transaction(tx => {
                                    tx.executeSql(
                                      'DELETE FROM StepTestRecoveryTable WHERE TimeMin = ? AND bore_hole_num=?',
                                      [timeNew,boreHoleNum],
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
        <Button 
        onPress={()=>{
            if(watLev==''||draDo=='')
            {
                Alert.alert('WARNING','Please Enter Required Fields')
            }
            else{
                setRows(rows+1)
                db.transaction(tx=>{
                    tx.executeSql('SELECT TimeMin from StepTestRecoveryTable where bore_hole_num=?',[boreHoleNum],
                    (_, { rows }) => {
                      // Get all values from the column and check if drillPip is exists
                      const timeValues = rows._array.map((row) => row.TimeMin);
                      if (timeValues.includes(timeNew)) {
                        console.log('Value already exists in the column');
                      }
                      else{                        
                        tx.executeSql('INSERT INTO StepTestRecoveryTable(TimeMin,waterLeve,drawDown,recovery,remarks,bore_hole_num) values(?,?,?,?,?,?)',
                        [time,watLev,draDo,recovery,remarks,boreHoleNum],
                        (tx,result)=>
                        {
                            console.log('DATA INSERTED INTO StepTestRecoveryTable Success')
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
                  
        }} 
        title='Add Row'
        />
        </View>
        <Text></Text>
        <View style={{flexDirection:'row',marginLeft:15}}>
          <Text style={{fontWeight:'bold'}}>Attach Recovery Test Report </Text>
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
              
                if(watLev==''||draDo=='')
                {
                    Alert.alert('WARNING','Please Enter Required Fields')
                }
                else
                {   
                  setDataSaving(true)
                const isTableEmpty = () => {
                  return new Promise((resolve, reject) => {
                    db.transaction((tx) => {
                      tx.executeSql(
                        'SELECT COUNT(*) as count FROM StepTestRecovery',
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
                    if(empty)
                    {
                      db.transaction(tx=>
                        {
                          tx.executeSql('SELECT bore_hole_num from filesForStepRec',
                          [],
                          (_,{rows})=>
                          {
                            const boreholeNumCheck=rows._array.map((row)=>row.bore_hole_num);
                            if(boreholeNumCheck.includes(boreHoleNum))
                            {
                              console.log("file already exist");
                            }
                            else
                            {
                              tx.executeSql(
                                'INSERT INTO filesForStepRec (name, data , bore_hole_num) VALUES (?, ? ,?)',
                                [fileName, fileData,boreHoleNum],
                                (tx, results) => {
                                  console.log('File inserted into filesForStepRec database');
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
                    tx.executeSql(
                        'INSERT INTO StepTestRecovery(bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy) values(?,?,?,?,?,?,?,?,?)',
                        [boreHoleNum,pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),duraPumpTest,statWatLeve,dynWatLeve,mesPoint,pumInstDep,mesBy],
                    (tx,result)=>
                    {
                               setDataSaving(false)
                               setDataSave(true);
                                setTimeout(()=>
                                {
                                 setDataSave(false);
                                },1000)
                      console.log('Data Inserted StepTestRecovery Succefully');
                    },
                    (tx,error)=>
                    {
                      setDataSaving(false)
                      console.log(error);
                    }
                    )
                  })
                    }
                    else
                    {
                      DataSet();
                      db.transaction(tx=>{
                        tx.executeSql('SELECT bore_hole_num from StepTestRecovery ',[],
                        (_, { rows }) => {
                          // Get all values from the column and check if drillPip is exists
                          const bore_hole_num_Values = rows._array.map((row) => row.bore_hole_num);
                          if (bore_hole_num_Values.includes(boreHoleNum)) {
                             setDataSaving(false);
                             Alert.alert('WARNING','Already data Exist');
                                console.log('Value of StepTestRecovery Already contains')
                            }
                            else
                            {
                              tx.executeSql(
                                'INSERT INTO StepTestRecovery(bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy) values(?,?,?,?,?,?,?,?,?)',
                        [boreHoleNum,pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),duraPumpTest,statWatLeve,dynWatLeve,mesPoint,pumInstDep,mesBy],
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
                  })
                  .catch((error) => {
                    console.log('Error:', error);
                  });
                }      
            }}/> 
            <Text></Text>
           
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
            >Data Already Exist On this Borehole Number</Text>
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
        </ScrollView>
    )
}
const styles=StyleSheet.create({
    Header:{
        borderWidth:1.3,
        borderColor:'grey',
        width:80,
        justifyContent:'center',
        backgroundColor:'#9efcfa',
        flex:1
    },
    field:{
        borderWidth:1.3,
        borderColor:'grey',
        width:80,
        justifyContent:'center',
        height:50
    },
    HeadText:{
      color:'#4b3a4b',
      fontSize:10,
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

export default StepTestRecTable;