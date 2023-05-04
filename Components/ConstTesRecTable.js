import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button,ActivityIndicator,Modal, ScrollView,StyleSheet, Alert,TouchableOpacity,Image} from 'react-native';
import { useState,useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as DocumentPicker from 'expo-document-picker';

const db=SQLite.openDatabase('Uganda');
const ConstTesRecTable=(props)=>
{

  const constTestTableData=[];
  const [userid,setUserId]=useState();
  const [userName,setUserName]=useState();
   const [loading,setLoading]=useState(false);

   const [blueTick,setBlueTick]=useState(false);
   const [excelMark,setExcelMark]=useState(false)

   const [dataSave,setDataSave]=useState(false);

   const [dataSaving,setDataSaving]=useState(false)

   const [image,SetImage]=useState('');
const [fileName,setFileName]=useState();
const [fileData,setFileData]=useState();
   
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

    const ConstTesRecTableData=[];

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
            +"ConstTesRecoveryTable"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,TimeMin INTEGER NOT NULL,waterLeve VARCHAR NOT NULL,drawDown VARCHAR NOT NULL,recovery VARCHAR NOT NULL,remarks VARCHAR,bore_hole_num VARCHAR NOT NULL)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully ConstTesRecoveryTable");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })
        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS filesForConstRec (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT,bore_hole_num VARCHAR NOT NULL)',
            [],
            (tx,result)=>
            {
              console.log("filesForConstRec table Created successfully");
            },
            (tx,error)=>
            {
              console.log(error)
            }
          );
        });
  },[])

 let timeNew=0;

 const DataSet=()=>
 {
    if(watLev==''||draDo=='')
    {
        Alert.alert('WARNING','Please Enter Required Fields')
    }
    else{
        db.transaction(tx=>{
            tx.executeSql('SELECT TimeMin from ConstTesRecoveryTable where bore_hole_num=?',[boreHoleNum],
            (_, { rows }) => {
              // Get all values from the column and check if drillPip is exists
              const timeValues = rows._array.map((row) => row.TimeMin);
              if (timeValues.includes(time)) {
                console.log('Value already exists in the column');
              }
              else{
                tx.executeSql('INSERT INTO ConstTesRecoveryTable(TimeMin,waterLeve,drawDown,recovery,remarks,bore_hole_num) values(?,?,?,?,?,?)',
                [time,watLev,draDo,recovery,remarks,boreHoleNum],
                (tx,result)=>
                {
                  setDataSave(true);
                  setTimeout(()=>
                  {
                   setDataSave(false);
                  },1000)
                    console.log('DATA INSERTED INTO ConstTesRecoveryTable Success')
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
                         backgroundColor:'#d8e6d8'
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
                          backgroundColor:'#d8e6d8'
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
                                      'DELETE FROM ConstTesRecoveryTable WHERE TimeMin = ? AND bore_hole_num=?',
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
                    tx.executeSql('SELECT TimeMin from ConstTesRecoveryTable where bore_hole_num=?',[boreHoleNum],
                    (_, { rows }) => {
                      // Get all values from the column and check if drillPip is exists
                      const timeValues = rows._array.map((row) => row.TimeMin);
                      if (timeValues.includes(timeNew)) {
                        console.log('Value already exists in the column');
                      }
                      else{                        
                        tx.executeSql('INSERT INTO ConstTesRecoveryTable(TimeMin,waterLeve,drawDown,recovery,remarks,bore_hole_num) values(?,?,?,?,?,?)',
                        [time,watLev,draDo,recovery,remarks,boreHoleNum],
                        (tx,result)=>
                        {
                            console.log('DATA INSERTED INTO ConstTesRecoveryTable Success')
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
          <Text style={{fontWeight:'bold'}}>Attach Constant Test Recovery Report </Text>
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
        {/* <Button
        onPress={()=>
        {
            db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM ConstTesRecoveryTable where bore_hole_num=?",[boreHoleNum],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                            const { id,TimeMin,waterLeve,drawDown,recovery,remarks,bore_hole_num } = results.rows.item(i);
                            console.log(`id: ${id}, TimeMin: ${TimeMin}, waterLeve: ${waterLeve}, drawDown:${drawDown} ,recovery :${recovery},remarks:${remarks},bore_hole_num:${bore_hole_num}`);
                        }
                    }
                )
              })
        }}
        title='check'
        />
         <Button
        onPress={()=>
        {
            db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM ConstantTestRecovery where bore_hole_num=?",[boreHoleNum],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                            const { id,bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy } = results.rows.item(i);
                            console.log(`id: ${id}, bore_hole_num:${bore_hole_num},pumpOn: ${pumpOn}, pumpOff: ${pumpOff}, DuPumtime:${DuPumtime} ,staicWaterLev :${staicWaterLev},DynWaterLev:${DynWaterLev},measureP:${measureP} ,pumpInstdep :${pumpInstdep},measBy:${measBy}`);
                        }
                    }
                )
              })
        }}
        title='check2'
        />
        <Text></Text> */}
        {/* <Button
        title='drop'
        onPress={()=>
        {
            db.transaction(tx => {
                tx.executeSql(
                  'DROP TABLE IF EXISTS ConstantTestRecovery',
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
        <View style={{justifyContent:'center',alignItems:'center'}}>
            <Button title='save' onPress={()=>
            {
            
                if(watLev==''||draDo=='')
                {
                    Alert.alert('WARNING','Please Enter Required Fields')
                }
                else
                {   
                const isTableEmpty = () => {
                  return new Promise((resolve, reject) => {
                    db.transaction((tx) => {
                      tx.executeSql(
                        'SELECT COUNT(*) as count FROM ConstantTestRecovery',
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
                      setDataSaving(true);

                      db.transaction(tx=>
                        {
                          tx.executeSql('SELECT bore_hole_num from filesForConstRec',
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
                                'INSERT INTO filesForConstRec (name, data , bore_hole_num) VALUES (?, ? ,?)',
                                [fileName, fileData,boreHoleNum],
                                (tx, results) => {
                                  console.log('File inserted into filesForConstRec database');
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
                        'INSERT INTO ConstantTestRecovery(bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy) values(?,?,?,?,?,?,?,?,?)',
                        [boreHoleNum,pumpOndate.toLocaleString(),pumpOffdate.toLocaleString(),duraPumpTest,statWatLeve,dynWatLeve,mesPoint,pumInstDep,mesBy],
                    (tx,result)=>
                    {
                              setDataSaving(false);
                               setDataSave(true);
                                setTimeout(()=>
                                {
                                 setDataSave(false);
                                },1000)
                      console.log('Data Inserted ConstantTestRecovery Succefully');
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
                        tx.executeSql('SELECT bore_hole_num from ConstantTestRecovery ',[],
                        (_, { rows }) => {
                          // Get all values from the column and check if drillPip is exists
                          const bore_hole_num_Values = rows._array.map((row) => row.bore_hole_num);
                          if (bore_hole_num_Values.includes(boreHoleNum)) {
                            setDataSaving(false);
                            Alert.alert('WARNING','data Already exist');
                                console.log('Value of ConstantTestRecovery Already contains')
                            }
                            else
                            {
                              tx.executeSql(
                                'INSERT INTO ConstantTestRecovery(bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy) values(?,?,?,?,?,?,?,?,?)',
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
                                setDataSaving(false)
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
{/* 
            <Button
            title='sync'
            onPress={()=>
            {
              db.transaction(tx=>
                {
                  
                  tx.executeSql('SELECT * FROM ConstTesRecoveryTable where bore_hole_num=?',
                  [boreHoleNum],
                  (tx,results)=>
                  {
                    for (let i = 0; i < results.rows.length; i++) {
                      const row = results.rows.item(i);
                         constTestTableData.push({
                          Time:row.TimeMin,
                          Water_Level:row.waterLeve,
                          Resedual_Drawdown:row.drawDown,
                          RecoveryPercentage:row.recovery,
                          Remarks:row.remarks,
                      
                      });
                    }        
                         console.log(constTestTableData) 
                  }
                  )
                })

                db.transaction(tx=>
                  {
                      tx.executeSql('SELECT * FROM ConstantTestRecovery WHERE bore_hole_num=?',
                       [boreHoleNum],
                       (tx,results)=>
                     { 
                           for (let i = 0; i < results.rows.length; i++) {
                        let {id,bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy} = results.rows.item(i);
                        fetch('http://182.18.181.115:8091/api/ConstantRecovery/Insert',
                        {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },

                     body: JSON.stringify({
                      boreholeId: 'ae0cf5ac-2277-4296-9fcb-3c6c5477d4aa',
                      BoreholeNumber: boreHoleNum,
                      ConstRecoveryPumpOn: pumpOn.toLocaleString(),
                      ConstRecoveryPumpOff: pumpOff.toLocaleString(),
                      ConstRecoveryDuration: DuPumtime,
                      ConstRecoverySWL: staicWaterLev,
                      ConstRecoveryDWL: DynWaterLev,
                      ConstRecoveryMeasuringPoint: measureP,
                      ConstRecoveryPumpInstallationDepth: pumpInstdep,
                      ConstRecoveryMeasuredBy: measBy,
                      ConstRecoverySiteFilePath: 'DemoFor',
                      ConstRecoveryTable: constTestTableData,
                      userName: userName,
                      userid:userid,

                     }),
                   }).then(response=>response.json()).then(responseData=>JSON.parse(responseData)).
                   then(result=>
                    {
                      if(result==="Saved")
                      {
                        Alert.alert('Success')
                      }
                      else
                      {
                       Alert.alert('Already Exist')
                      }
                    }

                   ).catch(error=>console.log(error))
                           }
                          }
                      )
                        })



            }}
            /> */}
            {/* <Button
            onPress={()=>
            {
              setLoading(true)
                const isTableEmpty = () => {
                    return new Promise((resolve, reject) => {
                      db.transaction((tx) => {
                        tx.executeSql(
                          'SELECT COUNT(*) as count FROM StepTestRecovery where bore_hole_num=?',
                          [boreHoleNum],
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
                          'SELECT COUNT(*) as count FROM StepTestRecoveryTable where bore_hole_num=?',
                          [boreHoleNum],
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
                isTableEmpty2().then((empty)=>
                 {
                if(!empty)
                    {
                     
                            console.log(userid,userName)
                            try {
                              db.transaction(tx=>
                                {
                                  
                                  tx.executeSql('SELECT * FROM StepTestRecoveryTable where bore_hole_num=?',
                                  [boreHoleNum],
                                  (tx,results)=>
                                  {
                                    for (let i = 0; i < results.rows.length; i++) {
                                      const row = results.rows.item(i);
                                      stepTestTableData.push({
                                          Time:row.TimeMin,
                                          Water_Level:row.waterLeve,
                                          Resedual_Drawdown:row.drawDown,
                                          RecoveryPercentage:row.recovery,
                                          Remarks:row.remarks,
                                      
                                      });
                                    }        
                                         console.log(stepTestTableData) 
                                  }
                                  )
                                })
                              }
                              catch (error) {
                                    console.error(error.message);
                                  }     
                            fetch('http://182.18.181.115:8091/api/BoreholeNumber/Get/', {
                              method: 'POST',
                              headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                           body: JSON.stringify({
                             userId: userid,
                             BoreholeNumber: boreHoleNum,
                           }),
                         })
                           .then((response) => response.json()).
                           then(resData=>JSON.parse(resData))
                           .then((responseData) => {
                             
                             if(responseData.length!==0)
                             {                            
                              const bID=responseData[0].boreholeId;
                              console.log(bID);
                              db.transaction(tx=>
                                {
                                    tx.executeSql('SELECT * FROM StepTestRecovery WHERE bore_hole_num=?',
                                     [boreHoleNum],
                                     (tx,results)=>
                                   { 
                                         for (let i = 0; i < results.rows.length; i++) {
                                      let {id,bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy} = results.rows.item(i);
                                      fetch('http://182.18.181.115:8091//api/StepRecovery/Insert',
                                      {
                                      method: 'POST',
                                      headers: {
                                      Accept: 'application/json',
                                      'Content-Type': 'application/json',
                                    },
        
                                   body: JSON.stringify({
                                      RecoveryPumpOn: pumpOn,
                                      RecoveryPumpOff: pumpOff,
                                      RecoveryDuration: DuPumtime,
                                      RecoverySWL: staicWaterLev,
                                      RecoveryDWL: DynWaterLev,
                                      RecoveryMeasuringPoint:measureP ,
                                      RecoveryPumpInstallationDepth: pumpInstdep,
                                      RecoveryMeasuredBy: measBy,
                                      RecoveryTable: stepTestTableData,
                                      userid:userid,
                                      userName:userName,
                                      boreholeId:bID,
                                      RecoverySiteFilePath:'DemoFor'
                                   }),
                                 }).then(response=>response.json()).then(responseData=>JSON.parse(responseData)).
                                 then(result=>
                                  {
                                    if(result==="Saved")
                                    {
                                      setLoading(false);
                                     setBlueTick(true) ;
                                     setTimeout(()=>
                                     {
                                      setBlueTick(false)
                                     },2000)
                                    }
                                    else
                                    {
                                      setLoading(false)
                                      setExcelMark(true)
                                      setTimeout(()=>
                                      {
                                        setExcelMark(false)
                                      },2000)
                                    }
                                  }

                                 ).catch(error=>console.log(error))
                                         }
                                        }
                                    )
                                      })
                             
                             }
                            })
                     
                               
                    }
                    else
                    {
                      setLoading(false)
                      Alert.alert('WARNING','StepTestRecoveryTable Does not contains DATA please fill')
                    }
                 })
                }
                else
                {
                  setLoading(false)
                  Alert.alert('WARNING','StepTestRecovery Does not contains please fill')
                }
            })
                  

            }}
            title='SYNC'
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
        height:50,
        backgroundColor:'#d8e6d8'
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

export default ConstTesRecTable;