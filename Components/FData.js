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



  // const pickImage1= async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });
  
  //     if (!result.canceled) {
  //       setState(result.uri);
  //       insertImage(result.uri);
  //     }
  //   } catch (error) {
  //     console.log('Error picking image:', error);
  //   }
  // };
  // const insertImage = async (uri) => {
  //   try {
  //     const granted = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
     
  //     if (granted.status !== 'granted') {
  //       alert('Permission to access media library denied');
  //       return;
  //     }
  
  //     const asset = await MediaLibrary.createAssetAsync(uri);
  //     const album = await MediaLibrary.getAlbumAsync('SQLiteImages') || await MediaLibrary.createAlbumAsync('SQLiteImages', asset);
  
  //     await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
  
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         'INSERT INTO images (image) VALUES (?)',
  //         [asset.uri],
  //         (_, { rowsAffected }) => {
  //           if (rowsAffected > 0) {
  //             console.log('Image inserted successfully');
  //           } else {
  //             console.log('Image not inserted');
  //           }
  //         },
  //         (_, error) => {
  //           console.log('Error inserting image into database:', error);
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.log('Error inserting image into database:', error);
  //   }
  // };


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


    // const handleConfirmTime = (selectedTime) => {
    //   setVisibleTime(false);
    //   setSelectedTime(selectedTime.toLocaleTimeString());
    // };

    

    const [dateTime, setDateTime] = useState(null);

    // const [show, setShow] = useState(false);

    // const handleConfirm = (selectedDate) => {
    //   if (selectedDate) {
    //     setDateTime(selectedDate);
    //     setNewDate(dateTime.toLocaleString());
    //     setShow(false);
    //   }
    // };
    // const handleCancel = () => {
    //     setShow(false);
    //   };
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
  


      // const done=()=>
      // {
       
      //   if(dateTime==null||depthAfter==''||time==''||rate==''||formation==''||activites=='')
      //   {
      //    Alert.alert('WARNING','Sorry please fill required fields');
      //   }
      //   else
      //   {
      //     console.log(dateTime.toLocaleString(),drillpipe+1,depthAfter,time,rate,formation,activites,remarks);
      //    db.transaction(tx=>{
      //        tx.executeSql("INSERT INTO DeepWellLogInfosTable"
      //        +"(date_time,drill_pipe,time,rate,formation_log ,activities,remarks,depth) VALUES(?,?,?,?,?,?,?,?)",
      //                    [dateTime,drillpipe+1,time,rate,formation,activites,remarks,depthAfter],
      //                    (tx,result)=>
      //                    {
      //                        Alert.alert('SUCCESS','Data Added successfully');
      //                    },
      //                    (tx,error)=>
      //                    {
      //                        Alert.alert('FAIL','something went wrong');
      //                        console.log(error);
      //                    }
      //        )
      //    })
      //   }

      // }
  


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
                      backgroundColor:'#d8e6d8',
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


                    {/* <DataTable.Cell style={styles.field}>
                        <TouchableOpacity
                       onPress={() => setShow(true)} 
                        >
                            <View style={{width:110}}>                             
                       <Text style={{fontSize:10}}>{dateTime.toLocaleString()}</Text>
                        </View>
                        </TouchableOpacity>
                       {show&&<DateTimePickerModal
                          isVisible={show}
                          mode="datetime"
                          date={dateTime}
                          onConfirm={handleConfirm}
                          onCancel={handleCancel}
                          />}
                    </DataTable.Cell> */}
                    <DataTable.Cell style={{
                       borderWidth:1,
                       borderColor:'grey',
                       width:70,
                       justifyContent:'center',
                       height:55,
                       backgroundColor:'#d8e6d8'
                    }}><Text style={{color:'black',fontWeight:'bold'}}>{index+1}</Text></DataTable.Cell>
                    <DataTable.Cell style={{
                       borderWidth:1,
                       borderColor:'grey',                      
                       width:80,
                       height:55,
                       backgroundColor:'#d8e6d8',
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
                        

                    {/* <TouchableOpacity onPress={() => setVisibleTime(true)}>
                    <Text>time {selectedTime}</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                isVisible={visibleTime}
                                mode="time"
                                onConfirm={handleConfirmTime}
                                onCancel={() => setVisibleTime(false)}
                                /> */}
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
                        backgroundColor:'#d8e6d8',
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
                         backgroundColor:'#d8e6d8',
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

        {/* <Text></Text>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text></Text> */}
          {/* <Button title='checkSa' onPress={()=>{
db.transaction(tx=>{
  tx.executeSql('SELECT drill_pipe from DeepWellLogInfosTable',[],
  (tx,results)=>
        {
            const len=results.rows.length;
            for(let i=0;i<len;i++)
            {
                const {drill_pipe} = results.rows.item(i);
                console.log(`drill_pipe: ${drill_pipe}`);
            }
        }
  )
})
          }}/> */}
          {/* <Text></Text> */}
            {/* <Button title='CheckUserLogin' onPress={()=> 
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

             {/* <Button title='CheckLogForm' onPress={()=> 
            {
              db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM DeepWellLogInfos where bore_hole_num=?",[boreHoleNum],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                            const {id,bore_hole_num,start_date,end_date,driller_unit,table_height,dril_rod_len,dril_bit_len } = results.rows.item(i);
                            console.log(`id: ${id}, bore_hole_num: ${bore_hole_num}, start_date: ${start_date}, end_date:${end_date} ,driller_unit :${driller_unit},table_height :${table_height},dril_rod_len :${dril_rod_len},dril_bit_len :${dril_bit_len}`);
                        }
                    }
                )
              })
            }}/> */}
            {/* <Text></Text> */}
          
        {/* <Pressable 
        onPress={done}
        style={({pressed})=>({backgroundColor:pressed?'#fff':'#2d84f0'})}
        >
        <View style={{height:35,width:80,marginRight:10,justifyContent:'center',alignItems:'center'}}>
      <Text style={styles.Save}>Save</Text>
      </View>
    </Pressable> */}
    {/* </View> */}
{/* <Text></Text>
    <View style={{justifyContent:'center',alignItems:'center'}}>

    <Button title='SAVE' onPress={done}/>
    <Text></Text> */}
    {/* <Text></Text>
    <Button title='CheckLogDeepTableDetails' onPress={()=>
            {
              db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM DeepWellLogInfosTable where bore_hole_num=?",[boreHoleNum],
                    (tx,results)=>
                    {
                        for(let i=0;i<results.rows.length;i++)
                        {
                        const  {id,date_time,drill_pipe,time,rate,formation_log ,activities,remarks,depth,bore_hole_num}=results.rows.item(i);
                            console.log(`ID: ${id}, date_time: ${date_time}, drill_pipe: ${drill_pipe},depth:${depth},time:${time},rate:${rate},formation_log:${formation_log},activites:${activities},remarks:${remarks},bore_hole_num:${bore_hole_num}`)
                        }
                    }
                )
              })
            }}/> */}
            <Text></Text>
      {/* <Button
            title='DATAPUSH'
            onPress={async ()=>
            {             
              try {
                db.transaction(tx=>
                  {
                    
                    tx.executeSql('SELECT * FROM DeepWellLogInfosTable',
                    [],
                    (tx,results)=>
                    {
                      for (let i = 0; i < results.rows.length; i++) {
                        const row = results.rows.item(i);
                        TotalData.push({
                          DateAndTime:row.date_time,
                          DrillPipeNo:row.drill_pipe,
                          Minutes:row.time,
                          Rate:row.rate,
                          Log:row.formation_log,
                          Activity:row.activities,
                          Comments:row.remarks,
                          Depth:row.depth
                        });
                      }        
                            
                    }
                    )
                  })
                }
                catch (error) {
                      console.error(error.message);
                    }
                    try {
                      db.transaction(tx=>
                        {
                          tx.executeSql('SELECT * FROM DeepWellLogInfos',
                          [],
                          (tx,results)=>
                          {  
                        
                            for (let i = 0; i < results.rows.length; i++) {
                              const row = results.rows.item(i);
                              TotalData.push({                    
                                BoreholeNumber:row.bore_hole_num,
                                DateStart:row.start_date,
                                DateEnd:row.end_date,
                                Driller_units:row.driller_unit,
                                TableHeight:row.table_height,
                                DrillingRodLength:row.dril_rod_len,
                                DrillBitLength:row.dril_bit_len                                
                              });
                            }                      
                          }
                          )
                        })
                      }
                      catch (error) {
                            console.error(error.message);
                          }

                          try {
                            db.transaction(tx=>
                              {
                                tx.executeSql('SELECT * FROM User_Master',
                                [],
                                (tx,results)=>
                                {  
                              
                                  for (let i = 0; i < results.rows.length; i++) {
                                    const row = results.rows.item(i);
                                    TotalData.push({                    
                                      userid:row.userid,
                                      userName:row.username                            
                                    });
                                  }                 
                                  // console.log(TotalData)     
                                
                                }
                                )
                              })                         
                            }
                            catch (error) {
                                  console.error(error.message);
                                }
                


                // Execute a SELECT query to retrieve the data
            //     const query = 'SELECT * FROM DeepWellLogInfosTable';
            //     const [results] = await db.executeSql(query);
            
            //     // Format the data as an array of objects
            //     const data = [];
            //     for (let i = 0; i < results.rows.length; i++) {
            //       const row = results.rows.item(i);
            //       data.push({
            //         id: row.id,
            //         date_time:row.date_time,
            //         drill_pipe:row.drill_pipe,
            //         time:row.time,
            //         rate:row.rate,
            //         formation_log:row.formation_log,
            //         activities:row.activities,
            //         remarks:row.remarks,
            //         depth:row.depth
            //       });
            //     }
            
            //     // Do something with the data
            //     console.log(data);
            //   } catch (error) {
            //     console.error(error.message);
            //   }
            }}
            />
            <Text></Text> */}
            <View style={{alignItems:'center'}}>
{/* <Button onPress={ ()=>{
  setLoading(true)
const isTableEmpty = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM DeepWellLogInfosTable where bore_hole_num=?',
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
        'SELECT COUNT(*) as count FROM DeepWellLogInfos where bore_hole_num=?',
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
        try {
          db.transaction(tx=>
            {
              
              tx.executeSql('SELECT * FROM DeepWellLogInfosTable WHERE bore_hole_num = ?',
              [boreHoleNum],
              (tx,results)=>
              {
                for (let i = 0; i < results.rows.length; i++) {
                  const row = results.rows.item(i);
                  TotalData.push({
                    DateAndTime:row.date_time,
                    DrillPipeNo:row.drill_pipe,
                    Minutes:row.time,
                    Rate:row.rate,
                    Log:row.formation_log,
                    Activity:row.activities,
                    Comments:row.remarks,
                    Depth:row.depth
                  });
                }        
                      console.log(TotalData)
              }
              )
            })
          }
          catch (error) {
                console.error(error.message);
              }      
        db.transaction(tx=>
          {
            tx.executeSql('SELECT bore_hole_num from DeepWellLogInfos where bore_hole_num= ?',[boreHoleNum],
            (_, { rows }) => 
            {
              if(rows._array[0].bore_hole_num)
              {
               
                fetch('http://182.18.181.115:8091/api/BoreholeNumber/Get/', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
        body: JSON.stringify({
          userId: userid,
          BoreholeNumber: rows._array[0].bore_hole_num,
        }),
      })
        .then((response) => response.json()).
        then(resData=>JSON.parse(resData))
        .then((responseData) => {
          if(responseData.length!==0)
          { 
            const bID = responseData[0].boreholeId;
                try {
                   db.transaction(tx=>
              {
                  tx.executeSql('SELECT * FROM DeepWellLogInfos WHERE bore_hole_num=?',
                   [boreHoleNum],
                   (tx,results)=>
                 { 
                       for (let i = 0; i < results.rows.length; i++) {
                    let {id,bore_hole_num,start_date,end_date,driller_unit,table_height,dril_rod_len,dril_bit_len} = results.rows.item(i);            
                    console.log(bID);
                    fetch('http://182.18.181.115:8091/api/DeepWellLogForm/Insert', {
                      method: 'POST ',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        BoreholeNumber:bore_hole_num,
                        DateStart:start_date,
                        DateEnd:end_date,
                        Driller_units:driller_unit,
                        TableHeight:table_height,
                        DrillingRodLength:dril_rod_len,
                        DrillBitLength:dril_bit_len,
                        DeepwellReportPath: 'Dommy Path',
                        FormationLogTable:TotalData,
                        userid:userid,
                        userName:userName,
                        boreholeId:bID                                                             
                      })
                    })
                      .then(response => response.json()).
                      then(responseData=>JSON.parse(responseData))                   
                      .then(data=> {
                        console.log(data)
                        if(data==='Saved')
                        {
                          setLoading(false)
                          setBlueTick(true);
                          setTimeout(()=>
                          {
                            setBlueTick(false)
                          },2000)
                        }
                        else if(data==='Already Data Exist')
                        {
                          setLoading(false)
                          setExcelMark(true);
                          setTimeout(()=>
                          {
                            setExcelMark(false)
                          },2000)
                        }
                    // //   if(data==='Already Data Exist')
                    // //   {
                    // //     Alert.alert("WARNING",'Data Already Exist on this Borehole Number');
                    // //   }
                    // //   else{
                        
                    // //     db.transaction(tx => {
                    // //       tx.executeSql(
                    // //         'DROP TABLE IF EXISTS DeepWellLogInfosTable',
                    // //         [],
                    // //         (_, result) => {
                    // //           console.log('DeepWellLogInfosTable Table deleted');
                    // //         },
                    // //         (_, error) => {
                    // //           console.log('Error deleting table:', error);
                    // //         }
                    // //       );
                    
                    // //   })
                    // //   db.transaction(tx => {
                    // //     tx.executeSql(
                    // //       'DROP TABLE IF EXISTS DeepWellLogInfos',
                    // //       [],
                    // //       (_, result) => {
                    // //         console.log('DeepWellLogInfos Table deleted');
                    // //         Alert.alert('Data Transfor Successfully....');
                    // //       },
                    // //       (_, error) => {
                    // //         console.log('Error deleting table:', error);
                    // //       }
                    // //     );
                  
                    // // })
                    
                    //   }
                            
                      })
                      .catch(error => {
                        // Handle the error
                        console.error('error found',error);
                      });
                   

                   }                      
               }
            )
         })
       }
  catch (error) {
        console.error(error.message);
      }
           
          }
          else
          {
            setLoading(false)
            Alert.alert('WARNING','BoreHoleNumber Does not exists');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
      else
      {
        setLoadingO(false)
        console.log('SORRY BORE_HOLE_NUMBER NOT EXISTS');
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
    Alert.alert('WARNING','Sorry Data Not Found,Please Fill Data')
   }
  })
  .catch((error) => {
    console.log('Error:', error);
  });

}} title='SYNC'/> */}


</View>

          {/* <Button onPress={()=>
          {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM DeepWellLogInfosTable2 WHERE id = ?',
                [14],
                (_, result) => {
                  console.log('Rows affected:', result.rowsAffected);
                },
                (_, error) => {
                  console.log('Error deleting data:', error);
                }
              );
            });
          }}
          title='DELETE'
          /> */}
          {/* <Text></Text> */}
{/* 
          <Button title='DeleTable' onPress={()=>{
            db.transaction(tx => {
              tx.executeSql(
                'DROP TABLE IF EXISTS  BoreHoleNumbers',
                [],
                (_, result) => {
                  console.log('Table deleted ConstantDesTestTable');
                },
                (_, error) => {
                  console.log('Error deleting table:', error);
                }
              );
        
          })}}/> */}

    {/* </View> */}

    
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
        height:55,
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