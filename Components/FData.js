import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button, ScrollView,StyleSheet,Modal,ActivityIndicator, Image,Pressable, FlatList,Alert} from 'react-native';
import { TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const db=SQLite.openDatabase('Uganda');

const sql = 'INSERT INTO DeepWellLogInfos (bore_hole_num,start_date,end_date,driller_unit,table_height,dril_rod_len,dril_bit_len) VALUES(?,?,?,?,?,?,?)';
const FData=(props)=>
{ 
  
  const  boreHoleNum=props.getBoreHoleNum;
  const startDate=props.startDate
  const endDate=props.endDate;
  const drillUnit=props.drillUnit;
  const tableHeight=parseFloat(props.tableHeight);
  const drillRod=parseFloat(props.lenDrillRod);
  const drillBit=parseFloat(props.lenDrillBit);
  const sum=drillBit+drillRod-tableHeight;
  
const [userid,setUserId]=useState();
const [userName,setUserName]=useState();
const [dataSaving,setDataSaving]=useState(false);
const [fileName,setFileName]=useState();
const [fileData,setFileData]=useState();

const [dataSave,setDataSave]=useState(false);

const [image,SetImage]=useState('');
     useEffect(()=>{
      setLoading(false);
      setDataSaving(false)
      try{
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
            +"DeepWellLogInfosTable"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,date_time DATETIME NOT NULL,drill_pipe INTEGER NOT NULL,time DATETIME NOT NULL,rate INTEGER NOT NULL,formation_log VARCHAR NOT NULL,activities VARCHAR NOT NULL,remarks VARCHAR,depth VARCHAR NOT NULL,bore_hole_num VARCHAR NOT NULL)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully DeepWellLogInfosTable");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })

        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS filesForLog (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT,bore_hole_num VARCHAR NOT NULL)',
            [],
            (tx,result)=>
            {
              console.log("filesForLog table Created successfully");
            },
            (tx,error)=>
            {
              console.log(error)
            }
          );
        });
  },[])

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



  const DataSet=()=>{
    if(dateTime==null||time==0||rate==0||formation==''||activites==''||isNaN(depth))
    {
     Alert.alert('WARNING','Sorry please fill required fields');
    }
    else
    {
      setDepthAfter(depthAfter+drillRod);
      console.log(drillpipe);
      // setData([...data, { id: rows + 1, datetime: null }]);
      
      console.log(dateTime,drillpipe,depthAfter,time,rate,formation,activites,remarks);
     db.transaction(tx=>{
      tx.executeSql('SELECT drill_pipe from DeepWellLogInfosTable where bore_hole_num=?',[boreHoleNum],
      (_, { rows }) => {
        // Get all values from the column and check if drillPip is exists
        const drillpipValues = rows._array.map((row) => row.drill_pipe);
        if (drillpipValues.includes(drillpipe)) {
          console.log('Value already exists in the column');
        }
        else{
          tx.executeSql("INSERT INTO DeepWellLogInfosTable"
          +"(date_time,drill_pipe,time,rate,formation_log ,activities,remarks,depth,bore_hole_num) VALUES(?,?,?,?,?,?,?,?,?)",
                      [dateTime,drillpipe,time,rate,formation,activites,remarks,depthAfter,boreHoleNum],
                      (tx,result)=>
                      {
                         console.log('Data Inserted Into DeepWellLogInfosTable Sucess')
                      },
                      (tx,error)=>
                      {
                          Alert.alert('FAIL','Error found while Adding Data');
                          console.log(error);
                      }
                )
             }
           },
          )
       })
       
    }
   
  }
    
    const TotalData=[]
    const userData=[]

    const [loading,setLoading]=useState(false);
    const [blueTick,setBlueTick]=useState(false);
    const [excelMark,setExcelMark]=useState(false)

  const [data, setData] = useState([{ id: 1, datetime: null }]);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [dataRate, setDataRate] = useState([]);
    const [rows, setRows] = useState(1);
    const [drillpipe,setDrillPipe]=useState(1);
    const [depthAfter,setDepthAfter]=useState(0);
    // const [selectedTime, setSelectedTime] = useState(null);
    const [time,setTime]=useState(0);
    const [rate,setRate]=useState(0);
    const [formation,setFormation]=useState('');
    const [activites,setActivities]=useState('');
    const [remarks,setRemarks]=useState('');
    const [state,setState]=useState('');

    

    const [dateTime, setDateTime] = useState(null);

    const handleTimeChange = (value, index) => {
      const newData = [...dataRate];
      newData[index] = value;
      setDataRate(newData);
    };

    function handleDateTimeChange(rowId, value) {
      const newData = [...data];
      newData[rowId].datetime = value;
      setData(newData);
    }
    function handleDateTimePickerConfirm(value) {
      if (selectedRowId !== null) {
        const newDate = moment(value).format('YYYY-MM-DD HH:mm:ss');
        handleDateTimeChange(selectedRowId, newDate);
        setSelectedRowId(null);
        setDateTime(newDate);
      }
      setIsDateTimePickerVisible(false);
    }
  
    function handleDateTimePickerCancel() {
      setIsDateTimePickerVisible(false);
    }
  
    function openDateTimePicker(rowId) {
      setSelectedRowId(rowId);
      setIsDateTimePickerVisible(true);
    }


    return(
        <ScrollView>
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
        <ScrollView horizontal={true}>
            <View >
            <DataTable>
                <DataTable.Header>
                <DataTable.Title style={{ borderWidth:1,borderColor:'grey',width:130,justifyContent:'center',backgroundColor:'#9efcfa',flex:1}}><Text style={styles.HeadText}>Date&Time</Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'grey',
                      width:70,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}><Text style={styles.HeadText}>Drill Pipe</Text></DataTable.Title>
                <DataTable.Title style={{
                  borderWidth:1,
                  borderColor:'grey',
                  width:80,
                  justifyContent:'center',
                  backgroundColor:'#9efcfa',
                  flex:1
                }}><Text style={styles.HeadText}>Depth(m) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Time(min) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={{
                  borderWidth:1,
                  borderColor:'grey',
                  width:100,
                  justifyContent:'center',
                  backgroundColor:'#9efcfa',
                  flex:1
                }}><Text style={styles.HeadText}>Rate(m/min) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}><Text style={styles.HeadText}>Fomation log <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}><Text style={styles.HeadText}>Activities<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}><Text style={styles.HeadText}>Remarks</Text></DataTable.Title>
                <DataTable.Title  style={{
                    borderWidth:1,
                    borderColor:'grey',                      
                    width:70,
                    height:55,
                    backgroundColor:'#9efcfa',
                    justifyContent:'center'
                }}></DataTable.Title>
               
                </DataTable.Header>
                {Array.from(Array(rows)).map((_,index) => { 
                const time = dataRate[index] || '';
                let myRate;
                 depth=sum;
                 for(let i=0;i<=index;i++)
                 {
                  if(i==0)
                  {
                    depth=depth;
                     myRate = time ?(Number.isInteger(+(depth/time))) ? +(depth/time) : (depth/time).toFixed(2): '';
                  }
                  else
                  {
                    depth=depth+drillRod;
                    myRate = time ?(Number.isInteger(+(depth/time))) ? +(depth/time) : (depth/time).toFixed(2): '';

                  }
                 }
                   return(
                <DataTable.Row  key={index}
                >
                   <DataTable.Cell   style={{
                      borderWidth:1,
                      borderColor:'grey',                      
                      width:130,
                      height:55,
                      justifyContent:'center'
                   }}>
                    
                    <TouchableOpacity onPress={() => openDateTimePicker(index)}>
                    <View style={{borderWidth:0.6,borderColor:'grey',borderRadius:10}}>
                <TextInput
                  value={data[index].datetime}
                  editable={false}
                  pointerEvents="none"
                  placeholder='--/--DATETIME--/---'
                  style={{fontSize:12,fontWeight:'bold',color:'black'}}
                />
              <Text style={{color:'white',opacity:0,fontSize:12}}>{data[index].datetime}</Text>   
                </View>
              </TouchableOpacity>
            
              <DateTimePickerModal
                isVisible={isDateTimePickerVisible}
                mode="datetime"
                onConfirm={handleDateTimePickerConfirm}
                onCancel={handleDateTimePickerCancel}
              />
            </DataTable.Cell>

                    <DataTable.Cell style={{
                       borderWidth:1,
                       borderColor:'grey',
                       width:70,
                       justifyContent:'center',
                       height:55,
          
                    }}><Text style={{color:'black',fontWeight:'bold'}}>{index+1}</Text></DataTable.Cell>
                    <DataTable.Cell style={{
                       borderWidth:1,
                       borderColor:'grey',                      
                       width:80,
                       height:55,
                       justifyContent:'center'
                    }}
                    >
                      <View>
                      <Text style={{fontSize:7,opacity:0}}>.............................</Text>
                      <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:3,opacity:0}}>..........</Text>
                        <TextInput
                        placeholder='Depth(m)'                    
                        value={isNaN(depth) ? '' : depth.toString()} 
                        style={{color:'black',fontWeight:'bold'}}
                        readOnly
                        />
                      </View>      
                    </View>
                    <Text style={{fontSize:8}}></Text>
                    </View>   
                      </DataTable.Cell>
                      
                    <DataTable.Cell style={styles.field}>   
                    <View >
                      <Text style={{fontSize:7,opacity:0}}>..............................................</Text>
                      <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:3,opacity:0}}>...............</Text>
                    <TextInput placeholder='Time(min)' keyboardType='numeric' style={{color:'black',fontWeight:'bold',fontSize:13}} 
                     onChangeText={(value) =>{
                      setTime(value)
                      handleTimeChange(value, index)
                    }
                    } 
                    onBlur={()=>{
                        if(depthAfter==0)
                        {
                          setDepthAfter(sum);
                        }
                        }}/>
                      
                     </View>
                    <Text style={{fontSize:5,opacity:0}}>...............</Text>
                    </View>
                    <Text style={{fontSize:8}}></Text>
                    </View>   
                        </DataTable.Cell>
                        
                    <DataTable.Cell style={{
                        borderWidth:1,
                        borderColor:'grey',                      
                        width:100,
                        height:55,

                        justifyContent:'center'
                    }}
                    ><View >
                        <View>
                      <Text style={{fontSize:6,opacity:0}}>..............................................</Text>
                      <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:3,opacity:0}}>............</Text>
                          <View>
                          <Text style={{fontSize:1,opacity:0}}>{myRate}
                          ............................................................
                          ...........................................................</Text>
                        <TextInput
                        placeholder='Rate(m/min)'
                        value={isNaN(myRate) ? '' : (myRate).toString()} 
                        style={{color:'black',fontWeight:'bold',fontSize:12}}                        
                        />
                        </View>
                      </View>
                      <Text style={{fontSize:5,opacity:0}}>...............</Text>
                    </View>
                    <Text style={{fontSize:8}}></Text>
                    </View>             
                      </View>
                      </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                      <View >
                      <Text style={{fontSize:7,opacity:0}}>..........................................................</Text>
                      <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:3,opacity:0}}>...............</Text>
                      <TextInput placeholder='Formation Log'  style={{color:'black',fontWeight:'bold',fontSize:12}} key="formation" onChangeText={setFormation}
                    onBlur={()=>
                    {
                      setRate((depth/time));
                    }}
                    />
                    </View>
                    <Text style={{fontSize:5,opacity:0}}>...............</Text>
                    </View>
                    <Text style={{fontSize:8}}></Text>
                    </View>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                    <View >
                    <Text style={{fontSize:7,opacity:0}}>..........................................................</Text>
                      <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:3,opacity:0}}>...............</Text>
                      <TextInput placeholder='Activities'  style={{color:'black',fontWeight:'bold',fontSize:13}} key="activities" onChangeText={setActivities}/>
                      </View>
                    <Text style={{fontSize:5,opacity:0}}>...............</Text>
                    </View>
                    <Text style={{fontSize:8}}></Text>
                    </View>
                      </DataTable.Cell>
                    <DataTable.Cell style={styles.field}>
                    <View >
                    <Text style={{fontSize:7,opacity:0}}>..........................................................</Text>
                      <View style={{borderWidth:0.7,borderColor:'grey',borderRadius:10,}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:3,opacity:0}}>...............</Text>
                      <TextInput placeholder='Enter Remarks'  style={{color:'black',fontSize:13,fontWeight:'bold'}} key="remarks" onChangeText={setRemarks}/>
                      </View>
                    <Text style={{fontSize:5,opacity:0}}>...............</Text>
                    </View>
                    <Text style={{fontSize:8}}></Text>
                    </View>
                      </DataTable.Cell>
                    <DataTable.Cell style={{
                         borderWidth:1,
                         borderColor:'grey',                      
                         width:70,
                         height:55,

                         justifyContent:'center'
                    }}>
                      <TouchableOpacity
                       onPress={() => {
                        if(index==0)
                    {
                        Alert.alert('WARNING','Sorry First Row Cannot Delete');
                    }
                    else
                    {
                        setRows(rows-1);
                        setDepthAfter(depthAfter-drillRod); 
                        setDrillPipe(drillpipe-1);
                        console.log(drillpipe);
                        db.transaction(tx => {
                            tx.executeSql(
                              'DELETE FROM DeepWellLogInfosTable WHERE drill_pipe = ? AND bore_hole_num=?',
                              [drillpipe,boreHoleNum],
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
                  )})
}                
            </DataTable>
            </View>
        </ScrollView>
        <Text></Text>
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        {/* <Button onPress={DataSet} title='ADD ROW' /> */}
        <Button onPress={()=>{
          if(dateTime==null||time==0||rate==0||formation==''||activites==''||isNaN(depth))
          {
           Alert.alert('WARNING','Sorry please fill required fields');
          }
          else
          {
            setRows(rows+1);
            setDepthAfter(depthAfter+drillRod);
            console.log(drillpipe);
            setData([...data, { id: rows + 1, datetime: null }]);
            
            console.log(dateTime,drillpipe,depthAfter,time,rate,formation,activites,remarks);
           db.transaction(tx=>{
            tx.executeSql('SELECT drill_pipe from DeepWellLogInfosTable where bore_hole_num=?',[boreHoleNum],
            (_, { rows }) => {
              // Get all values from the column and check if drillPip is exists
              const drillpipValues = rows._array.map((row) => row.drill_pipe);
              if (drillpipValues.includes(drillpipe)) {
                console.log('Value already exists in the column');
              }
              else{
                tx.executeSql("INSERT INTO DeepWellLogInfosTable"
                +"(date_time,drill_pipe,time,rate,formation_log ,activities,remarks,depth,bore_hole_num) VALUES(?,?,?,?,?,?,?,?,?)",
                            [dateTime,drillpipe,time,rate,formation,activites,remarks,depthAfter,boreHoleNum],
                            (tx,result)=>
                            {
                                console.log('DeepWellLogInfosTable Data Added success')

                            },
                            (tx,error)=>
                            {
                                Alert.alert('FAIL','Error found while Adding Data');
                                console.log(error);
                            }
                      )
                   }
                 },
                )
             })
             setDrillPipe(drillpipe+1);
          }
         
        }} 
          
          title='Add Row'/>
        </View>
        <Text></Text>


        <View style={{flexDirection:'row',marginLeft:15}}>
          <Text style={{fontWeight:'bold'}}>Attach Log for Deepwell Report </Text>
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
      {/* <View style={{justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity
      activeOpacity={0.8}
     
      style={{
        backgroundColor: '#6C63FF',
        borderRadius: 8,
        paddingVertical: 13,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
       }}
      >
        <Text style={{
                             color: '#fff',
                             fontSize: 15,
                             fontWeight: 'bold',
                             textTransform: 'uppercase',
                          }}>save</Text>

    </TouchableOpacity>
    </View>
        <Text></Text> */}
<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Button title='SAVE' onPress={()=>{
         
          if(boreHoleNum==0||drillUnit==''||tableHeight==''||drillBit==''||drillRod=='')
          {
              Alert.alert('WARNING','Please Fill Required fields');
          }
          else
          {  
            setDataSaving(true);
            db.transaction(tx=>
              {
                tx.executeSql('SELECT bore_hole_num from filesForLog',
                [],
                (_,{rows})=>
                {
                  const boreholeNum=rows._array.map((row)=>row.bore_hole_num);
                  if(boreholeNum.includes(boreHoleNum))
                  {
                    console.log("file already exist");
                  }
                else{
                tx.executeSql(
                  'INSERT INTO filesForLog (name, data , bore_hole_num) VALUES (?, ? ,?)',
                  [fileName, fileData,boreHoleNum],
                  (tx, results) => {
                    console.log('File inserted filesForLog into database');
                  },
                  (error)=>
                  {
                    console.log(error);
                  }
                )
                }
              })
              })
          console.log(boreHoleNum,startDate,endDate,drillUnit,tableHeight,drillBit,drillRod);    
          const isTableEmpty = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM DeepWellLogInfos',
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
               
                DataSet();
                 db.transaction(tx=>{
              tx.executeSql(
                sql,
              [boreHoleNum,startDate.toDateString(),endDate.toDateString(),drillUnit,tableHeight,drillRod,drillBit],
              (tx,result)=>
              {
                setDataSaving(false);
                          setDataSave(true);
                          setTimeout(()=>
                          {
                           setDataSave(false);
                          },1000)
              
                console.log('Data Inserted Succefully');

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
                setDataSaving(true);
                DataSet(); 
                db.transaction(tx=>{
                  tx.executeSql('SELECT bore_hole_num from DeepWellLogInfos ',[],
                  (_, { rows }) => {
                    // Get all values from the column and check if drillPip is exists
                    const bore_hole_num_Values = rows._array.map((row) => row.bore_hole_num);
                    if (bore_hole_num_Values.includes(boreHoleNum)) {
                      setDataSaving(false);
                      Alert.alert('WARNING','data already saved')
                          console.log('Value of DeepWellLogInfos Already contains')

                      }
                      else
                      {
                        tx.executeSql(
                          sql,
                        [boreHoleNum,startDate.toDateString(),endDate.toDateString(),drillUnit,tableHeight,drillRod,drillBit],
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
</View>


    
    <Modal visible={dataSave} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataSaveRight1.png')} style={{height:60,width:60}}/>
            <Text
            style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Data Saved Succesfully</Text>
            </View>
                  </Modal>
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
    Header:{
        borderWidth:1,
        borderColor:'grey',
        width:125,
        justifyContent:'center',
        backgroundColor:'#9efcfa',
        flex:1
    },
    field:{
        borderWidth:1,
        borderColor:'grey',
        width:125,
        justifyContent:'center',
        height:55
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
        fontSize:20,
        color:'#17f1e1'
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
      }
})

export default FData;