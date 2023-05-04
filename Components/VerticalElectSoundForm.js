import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button,Modal, ScrollView,StyleSheet, Pressable, FlatList, Alert,Image,ActivityIndicator} from 'react-native';
import { TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import React, { useRef } from 'react';
import * as SQLite from 'expo-sqlite';
import { useRoute } from '@react-navigation/native';

const db=SQLite.openDatabase('Uganda');
const App=()=>
{

  const route = useRoute();
  const getBoreHoleNum = route.params.getBoreHoleNum;
    const [data, setData] = useState([]);
    const [dataTable,setDataTable]=useState([]);
    const vesMastData=[];
    const userData=[];
    const [loading, setLoading] = useState(true);
    const [dataSaving,setDataSaving]=useState(false);
    const [datanotFound,setDataNotFound]=useState(false);
    const [dataAlreadyExistLocal,setDataAlreadyExistLocal]=useState(false)
    const [dataSave,setDataSave]=useState(false);

 const [userid,setUserid]=useState();
 const [username,setUserName]=useState();

 const [blueTick,setBlueTick]=useState(false);
 const [excelMark,setExcelMark]=useState(false)
    useEffect(()=>{
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
            +"VesMasterTable"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,vestId INTEGER,Station_No INTEGER,AB VARCHAR,MN VARCHAR,Resistivity VARCHAR,App_Res VARCHAR,bore_hole_num VARCHAR NOT NULL)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully VesMasterTable");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM VesMaster',
            [],
              (_, { rows: { _array } }) => {setData(_array)
              setLoading(false)
              },
            (tx, error) => {
              console.log('Error fetching data from database:', error);
            },
          );
        });  
    },[])
    
    const handleInputChange = (text, row) => {
        // Perform calculations based on user input
               let Resistance = parseFloat(text);
               let AB = parseFloat(row.AB) * 2;
               let ABsq = Math.pow(AB, 2);
              let MN = parseFloat(row.MN) * 2;
              let MNsq = Math.pow(MN, 2);                                
             let  AppResNew = (Resistance * 3.14 * (ABsq - MNsq) / (4 * MN)).toFixed(7);
        // Update the data state with the new value
        const newData = data.map((r) =>
          r.vesMasterId === row.vesMasterId ? { ...r, column3: AppResNew,resistivity:text } : r,
        );
        setData(newData);
        //Update the resistance data with the new value
      };

      if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#dffcfc' }}>
            <Text></Text>
            <Image source={require('../assets/logo-removebg-preview.png')} style={{
               position: 'absolute',
               top: '47%',
               left: '45%',
               width: 50,
               height: 50,
        }} />
        <ActivityIndicator size={90} color="#00f" style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }]}}/>  
         <Text></Text>
            {/* <Text
            style={{fontSize:25,color:'blue',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Loading.....</Text> */}
          </View>
        );
      }

      
    return(
        <ScrollView>
      <View>
        <Text></Text>
         
            <View style={{height:40,width:'45%',borderWidth:1,borderColor:'grey',marginLeft:10,marginRight:20,borderRadius:10}}>
            <Text style={{fontSize:11,marginLeft:10,fontWeight:'bold'}}>Borehole Number</Text>
            <TextInput value={getBoreHoleNum} disable style={{marginLeft:10,fontWeight:'bold'}}/>
            </View>
            <Text></Text>       
            <ScrollView>
                <ScrollView horizontal={true}>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Station No</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>AB/2(m)</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>MN/2(m)</Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'grey',
                      width:125,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}>
                <Text style={styles.HeadText}>Resistivity(ohm)<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'grey',
                      width:125,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}>
                <Text style={styles.HeadText}>App.Res(ohms)</Text></DataTable.Title>              
                </DataTable.Header>
                {data.map((item,index)=>
                {

                    return(
                        <DataTable.Row key={item.vesMasterId}>
                         
                        <DataTable.Cell style={styles.field}><Text style={{color:'black',fontWeight:'bold',fontSize:13}}>{item.StationNo}</Text></DataTable.Cell>
                        <DataTable.Cell style={styles.field}><View ><TextInput value={item.AB} style={{color:'black',fontWeight:'bold',fontSize:13}}/></View></DataTable.Cell>
                        <DataTable.Cell style={styles.field}><View ><TextInput value={item.MN} style={{color:'black',fontWeight:'bold',fontSize:13}}/></View></DataTable.Cell>
                        <DataTable.Cell style={{
                             borderWidth:1,
                             borderColor:'grey',
                             width:125,
                             justifyContent:'center',
                             height:50,
                             backgroundColor:'#d8e6d8'
                        }}>
                     <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10}}>
                     <Text style={{fontSize:4,opacity:0}}>..............................................................
                     ..............................................................</Text>
                     <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:3,opacity:0}}>..............</Text>
                            <TextInput placeholder='Resistivity' keyboardType='numeric'
                            style={{color:'black',fontWeight:'bold',fontSize:11}}
                        onChangeText={(text) =>
                         {
                            handleInputChange(text, item)
                         }
                       }
                       value={item.resistivity||''}
                         />
                         </View>
                         <Text style={{fontSize:4,opacity:0}}>..............................................................
                         ..............................................................</Text>
                         </View>
                         </DataTable.Cell>
                        <DataTable.Cell style={{
                              borderWidth:1,
                              borderColor:'grey',
                              width:125,
                              justifyContent:'center',
                              height:50,
                              backgroundColor:'#d8e6d8'
                        }}
                        >
                         <Text style={{color:'black',fontWeight:'bold',fontSize:13}}>{item.column3 || '-'}</Text>  
                         </DataTable.Cell>
                    </DataTable.Row>
                 )
                }
              )}
            </DataTable>
            </ScrollView>
            </ScrollView>
            <Text></Text>
            <View style={{justifyContent:'center',alignItems:'center'}}>
            <Button title='save'
            onPress={()=>
            {
              setDataSaving(true);
              const isTableEmpty = () => {
                return new Promise((resolve, reject) => {
                  db.transaction((tx) => {
                    tx.executeSql(
                      'SELECT COUNT(*) as count FROM VesMasterTable where bore_hole_num=?',
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
              isTableEmpty()
              .then((empty) => {
                if(empty)
                {
                  console.log(data)
                  db.transaction(tx=>
                      {          
                         data.map(values=>
                            {
                              tx.executeSql("INSERT INTO VesMasterTable(vestId, Station_No, AB, MN, Resistivity, App_Res,bore_hole_num) VALUES(?,?,?,?,?,?,?)",
                              [values.vesMasterId,values.StationNo,values.AB,values.MN,values.resistivity,values.column3,getBoreHoleNum],
                                                     (tx,result)=>
                                                     {
                                                         console.log('data Added successfully')
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
                                                         Alert.alert('Fail','Data not Saved please Fill again')
                                                     }
                          )
                          })
               })
                }
                else
                {
                  setDataAlreadyExistLocal(true);
                  setTimeout(()=>
                  {
                    setDataAlreadyExistLocal(false);
                  },2000)
                 
                }
              })
              
      
            }}
            /> 
            {/* <Text></Text>
            <Button title='checkData'
            onPress={()=>
            {
                db.transaction(tx=>{
                    tx.executeSql(
                        "SELECT * FROM VesMasterTable where bore_hole_num=?",[getBoreHoleNum],
                        (tx,results)=>
                        {
                            const len=results.rows.length;
                            for(let i=0;i<len;i++)
                            {
                                const { id,bore_hole_num,vestId, Station_No, AB, MN, Resistivity,  App_Res} = results.rows.item(i);
                                console.log(`id: ${id},bore_hole_num:${bore_hole_num},vestId:${vestId},Station_No:${Station_No},AB:${AB},MN:${MN},Resistivity:${Resistivity}, App_Res: ${App_Res}`);
                            }
                        }
                    )
                  })
            }}
            /> */}
            {/* <Text></Text>
             <Button title='CheckUserLogin' onPress={()=> 
            {
              db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM User_Master",[],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                            const { id, username, password,userid,token } = results.rows.item(i);
                            console.log(`User ID: ${id}, UserName: ${username}, Password: ${password}, UserId:${userid} ,token :${token}`);
                        }
                    }
                )
              })
            }}/> */}
            <Text></Text>
            {/* <Button title='sync'
            onPress={()=>
            {  
              setDataSendLoad(true)
                const isTableEmpty = () => {
                return new Promise((resolve, reject) => {
                  db.transaction((tx) => {
                    tx.executeSql(
                      'SELECT COUNT(*) as count FROM VesMasterTable where bore_hole_num=?',
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
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT vestId,Station_No,AB,MN,Resistivity,App_Res FROM VesMasterTable where bore_hole_num=?',
                  [getBoreHoleNum],
                    (_, { rows: { _array } }) => setDataTable(_array),
                  (tx, error) => {
                    console.log('Error fetching data from database:', error);
                  },
                );
              }); 
                   
                console.log(userid,username)
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
                  const boreholeId = responseData[0].boreholeId;
                  console.log(boreholeId)
                    fetch('http://182.18.181.115:8091///api/VES/Insert', {
                      method: 'POST',
                      headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                   body: JSON.stringify({
                    userid:userid,
                    userName:username,
                    boreholeId:boreholeId,
                    BoreholeNumber:getBoreHoleNum,
                    VES_tabledata: dataTable         
                            }),
                 }).then(response=>response.json()).then(responseData=>JSON.parse(responseData)).then(result=> 
                   {                                 
                    console.log(result) 
                    if(result==="Saved")
                    {                  
                      setBlueTick(true)
                      setDataSendLoad(false)
                      setTimeout(()=>
                      {
                        setBlueTick(false)
                      },2000)
                     
                    //   db.transaction(tx => {
                    //     tx.executeSql(
                    //       'DROP TABLE IF EXISTS vesMasterTable',
                    //       [],
                    //       (_, result) => {
                    //         console.log('vesMasterTable Table deleted');
                    //       },
                    //       (_, error) => {
                    //         console.log('Error deleting table:', error);
                    //       }
                    //     );
                    // })
                    }
                    else
                    {
                      setExcelMark(true)
                      setDataSendLoad(false)
                      setTimeout(()=>
                      {
                        setExcelMark(false)
                      },1000) 
                    }
                   }).
                   catch(error=>console.log(error))
                }
  
               })
            }
            else
            {            
                  setDataSendLoad(false)
                  setDataNotFound(true);
                  setTimeout(()=>
                  {
                    setDataNotFound(false)
                  },2000)
            }
        })   
            }}
            /> */}

            {/* <Text></Text>
            <Button
            title='DELETE'
            onPress={()=>
            {
                db.transaction(tx => {
                    tx.executeSql(
                      'DROP TABLE IF EXISTS vesMasterTable',
                      [],
                      (_, result) => {
                        console.log('vesMasterTable Table deleted');
                      },
                      (_, error) => {
                        console.log('Error deleting table:', error);
                      }
                    );
                })
            }}
            /> */}
            </View>
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
            >Data Already Exist on this borehole number</Text>
            </View>
                  </Modal>

                  <Modal visible={datanotFound} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/ExcelMark.png')} style={{height:70,width:70}}/>
            <Text
            style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Data Not Found Please Enter data</Text>
            </View>
                  </Modal>

                  <Modal visible={dataAlreadyExistLocal} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataAlreadyExistLocal.png')} style={{height:40,width:40}}/>
            <Text
            style={{fontSize:18,color:'#fff',fontWeight:'bold'}}
            >Data Already Inserted in this Borehole Number</Text>
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
        borderWidth:1,
        borderColor:'grey',
        width:70,
        justifyContent:'center',
        backgroundColor:'#9efcfa',
        flex:1
    },
    field:{
        borderWidth:1,
        borderColor:'grey',
        width:70,
        justifyContent:'center',
        height:50,
        backgroundColor:'#d8e6d8'
    },
    HeadText:{
      color:'#4b3a4b',
        fontSize:13,
        fontWeight:'bold'
    },
    button: {
        marginLeft: -10,
      },
      Save: {
        fontSize:20
      },
})

export default App;