import { useEffect } from "react";
import { View,Text,StyleSheet,Pressable,Button,Alert,ActivityIndicator,Image,TouchableOpacity,FlatList } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import { Modal,TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Warning from "./Warnings";
import { ScrollView } from "react-native-gesture-handler";
import BoreHoleNumbersStart from "./BoreHoleNumbersStart";

const db=SQLite.openDatabase('Uganda');
const DashBoardEntry=({navigation})=>
{
    const [modalVis,setModalVis]=useState(false);
    const [boreHoleNum,setBoreHoleNum]=useState('');
    const [loading, setLoading] = useState(true);
    const [modAndBut,setModAndBut]=useState(true);

    const [userid,setUserId]=useState();

    const [dataSave,setDataSave]=useState(false)
    const [enterBorehole,setEnterBorehole]=useState(false)
    const [data,setData]=useState([]);

    const [visible,setVisible]=useState(false)
      

    const refreshScreen=async ()=>
    {
      db.transaction(tx=>
        {
          tx.executeSql('SELECT * FROM User_Master',
          [],
          (tx,results)=>
          {  
        
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              setUserId(row.userid);
                                    
            }                                  
          }
          )
        })                         
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM BoreHoleNumbersFromApi',
            [],
              (_, { rows: { _array } }) => {setData(_array)},
            (tx, error) => {
              console.log('Error fetching data from database:', error);
            },
          );
        }); 
    }


    
    useEffect(()=>
    {
      db.transaction(tx=>
        {
          tx.executeSql('SELECT * FROM User_Master',
          [],
          (tx,results)=>
          {  
        
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              setUserId(row.userid);
                                    
            }                                  
          }
          )
        })           

      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM BoreHoleNumbersFromApi',
          [],
            (_, { rows: { _array } }) => {setData(_array)},
          (tx, error) => {
            console.log('Error fetching data from database:', error);
          },
        );
      }); 
        db.transaction(tx=>{
            tx.executeSql("CREATE TABLE IF NOT EXISTS "
            +"BoreHoleNumbers"
            +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_numer VARCHAR NOT NULL)",
            [],
            (tx,result)=>
            {
                console.log("Table created successfully BoreHoleNumbers");
            },
            (tx,error)=>
            {
                console.log("Sorry something went wrong ", error);
            }
            )
        })
        const isTableEmpty = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM BoreHoleNumbers',
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
            if(!empty)
            {
               navigation.replace('Dashboard')
               setLoading(false)
            }
            if(empty)
            {
                setLoading(false)
            }
        }
          )
          const unsubscribe = navigation.addListener('focus', () => {
            refreshScreen();
            
          });
        
          return unsubscribe;
        
    },[refreshBoreholeNumbersApi])


    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#dffcfc' }}>
            
            <ActivityIndicator size="large" color="#0000ff" style={{fontSize:60}}/>
            <Image source={require('../assets/logo-removebg-preview.png')} style={styles.image} /> 
            <Text
            style={{fontSize:20,color:'blue',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Loading.....</Text>
          </View>
        );
      }
  
      const refreshBoreholeNumbersApi=()=>
      {
        db.transaction(tx => {
          tx.executeSql(
            'DROP TABLE IF EXISTS  BoreHoleNumbersFromApi',
            [],
            (_, result) => {
              console.log('Table deleted ConstantDesTestTable');
            },
            (_, error) => {
              console.log('Error deleting table:', error);
            }
          );
    
      })
    
      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"BoreHoleNumbersFromApi"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_numbers VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully BoreHoleNumbersFromApi");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })
      
      fetch('http://182.18.181.115:8091/api/BoreholeNumber/GetBoreholes',
      {
        method: 'POST ',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid:userid
        })
      }
      ).then(response => response.json()).
      then(responseData=>JSON.parse(responseData)).
      then(result=>
        {
          result.map(item=>
            {
              db.transaction(tx=>
                {
                  tx.executeSql(
                    'INSERT INTO BoreHoleNumbersFromApi(bore_hole_numbers) VALUES (?)',
                    [item.BoreholeNumber],
                    (_, { rowsAffected }) => {
                      if (rowsAffected > 0) {
                        console.log('Data inserted successfully');
                      } else {
                        console.log('Data already exists in the table');
                      }
                    },
                    (_, error) => {
                      console.log('Error inserting data:', error);
                    }
                  );
                })
            })
        })          
       
      }

  

const onPress=()=>
{
  setVisible(false)
}
      if(modAndBut)
      {
        return(
            <View style={{flex:1,alignItems:'center'}}>
     <View style={{flexDirection:'row-reverse',width:'100%',backgroundColor:'rgba(0,0,0,0.2)'}}>
      <View style={{alignItems:'flex-end'}}>
        <TouchableOpacity
        style={{
          padding:10,
          borderRadius: 10
        }}
      onPress={refreshBoreholeNumbersApi}
        >
          <Image source={require('../assets/Refresh1.png')} style={{height:30,width:30}}/>
        </TouchableOpacity>
      </View>
  
      <View style={{alignItems:'flex-end'}}>
     <TouchableOpacity style={{
       padding:10,
       borderRadius: 10
     }}
          onPress={()=>
          {
            setVisible(true)
          }}
          >
            <Text style={{
               color: '#fff',
               fontFamily:'OpenSans-Medium',
               fontSize:20
            }}>Borehole Numbers</Text>
          </TouchableOpacity>
          </View>

          </View>
            <View style={styles.screens}>

        <View style={styles.screensButtons}>
        <Pressable
onPress={()=>
{
    setModalVis(true);
    setModAndBut(false);
}}
style={({pressed})=>({backgroundColor:pressed?'#837083':'#24605d',
borderRadius:20,
elevation: 10, // set elevation to give shadow effect
shadowColor: 'black', // set shadow color
shadowRadius: 10, // set shadow thickness or blur
shadowOpacity: 0.5, // set shadow opacity
shadowOffset: {
  width: 10, // set x-axis shadow length
  height: 10, // set y-axis shadow length
},

})}
>
    <View style={styles.buttonEnter}>
        <Text style={{fontSize:25,fontWeight:'bold',color:'white'}}>+</Text>
    <Text style={styles.text}>Enter Borehole Number</Text>
    </View>
         </Pressable>
         
</View>

</View>
<BoreHoleNumbersStart data={data} visible={visible} onPress={onPress}/>
</View>

        )
      }


    return(
       

<Modal visible={modalVis} animationType='fade' >

                <View style={{height:250,width:'100%',alignItems:'center'}}>
                    <Text></Text>
                <Text style={styles.boreNumText}>Enter Borehole Number</Text>
                <Text></Text>
                    <TextInput placeholder="EX:DWD1234" autoCapitalize="characters" style={styles.input} onChangeText={setBoreHoleNum}/>
                    
                    <Text></Text>
                    <View style={{flexDirection:'row'}}>
                    <Button
                    title="cancel"
                    onPress={()=>
                    {
                        setModalVis(false);
                        setModAndBut(true)
                    }}
                    />
                 <Text style={{opacity:0}}>.............</Text>

                    <Button
                    onPress={()=>
                    {
                        if(boreHoleNum==='')
                        {
                          setEnterBorehole(true)
                          setTimeout(()=>
                          {
                            setEnterBorehole(false)
                          },1000)
                        }
                        else
                        {
                        db.transaction(tx=>
                            {
                                tx.executeSql("INSERT INTO BoreHoleNumbers"
                                +"(bore_hole_numer) VALUES(?)",
                                            [boreHoleNum],
                                            (tx,result)=>
                                            {
                                               setDataSave(true);
                                               setTimeout(()=>
                                               {
                                                setDataSave(false);
                                                setModalVis(false);
                                                setModAndBut(true)
                                                navigation.navigate('Choose Screen');
                                               },1000)
                                            },
                                            (tx,error)=>
                                            {
                                                Alert.alert('FAIL','something went wrong');
                                                console.log(error);
                                            }
                                      )
                            })
                        }
                    }}
                    title='Sumbit'
                    />
                   
                    </View>
                    </View>
                    <Modal visible={dataSave} transparent animationType='fade' >  
        <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataSaveRight1.png')} style={{height:60,width:60}}/>
            <Text
            style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Borehole Number Added Succefully</Text>
            </View>
                  </Modal>


                    <Modal visible={enterBorehole} transparent animationType='fade' >  
    <View style={{justifyContent:'center',alignItems:'center'}}>        
       <Image source={require('../assets/dataAlreadyExistLocal.png')} style={{height:40,width:40}}/>
        <Text
        style={{fontSize:18,color:'#bef6e3',fontWeight:'bold'}}
        >Please Enter Borehole Number</Text>
        </View>
              </Modal>
            </Modal>
           

    )

}



const styles=StyleSheet.create({
    buttonEnter:{
        alignItems:'center',
        padding:10,
        justifyContent:'center',
       
    },
  
    text:{
        fontSize:15,
        color:'#e4e9f0',
        fontFamily: 'PoltawskiNowy-VariableFont_wght'
    },
    screens:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        padding:8,
        marginTop:20,  
        marginLeft:-20,      
    },
    screensButtons:{
        width:'45%',
        marginLeft:20,
        marginTop:30
    },
    input:{
        borderWidth:0.6,
        borderRadius:10,
        borderTopEndRadius:10,
        borderTopLeftRadius:10,
        width:'60%'
    },
    boreNumText:
    {
        fontSize:20,
        fontFamily:'SpaceMono-Bold',
        color:'#264967'
    },
    image: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 23,
      height: 23,
      marginLeft: -13,
      marginTop: -28,
    }
})
export default DashBoardEntry;