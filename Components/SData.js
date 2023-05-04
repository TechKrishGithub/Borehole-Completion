import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button, ScrollView,StyleSheet, Pressable, FlatList, Alert} from 'react-native';
import { TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';


const SData=(props)=>
{
    const [rows, setRows] = useState(1);
    const [dele,setDele]= useState([]);
    const [inputData, setInputData] = useState([]);
    let timeNew=0;
    const handleInputChange = (text, inputKey) => {
        setInputData(prevData => {
          const newData = [...prevData];
          const inputIndex = newData.findIndex(data => data.key === inputKey);
          if (inputIndex >= 0) {
            newData[inputIndex].value = text;
          } else {
            newData.push({ key: inputKey, value: text });
          }
          return newData;
        });
      };
      
   const done=()=>
   {
    console.log(inputData);
   }

    return(
        <ScrollView>
            
        <ScrollView horizontal={true}>
            <View>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Step No</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Time (mins)</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>WaterLevel (mbmp) <Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}> Drawdown(mbmp)<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Discharge.Q (m3/h)</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>EC (us/cm)</Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}><Text style={styles.HeadText}>Remarks</Text></DataTable.Title>
                <DataTable.Title  style={styles.Header}></DataTable.Title>
               
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
                     <DataTable.Cell style={styles.field}>{props.stepNo}</DataTable.Cell>
                     <DataTable.Cell style={styles.field}>{timeNew}</DataTable.Cell>
                    <DataTable.Cell style={styles.field}><View ><TextInput placeholder='WaterLeve' keyboardType='numeric' key="waterleve" onChangeText={text => handleInputChange(text, 'waterleve')}/></View></DataTable.Cell>
                    <DataTable.Cell style={styles.field}><View ><TextInput placeholder='Drawdown' keyboardType='numeric' key="Drawdown" onChangeText={text => handleInputChange(text, 'Drawndown')}/></View></DataTable.Cell>
                    <DataTable.Cell style={styles.field}><View ><TextInput placeholder='Discharge.Q' keyboardType='numeric' key="Discharge" onChangeText={text => handleInputChange(text, 'Discharge')}/></View></DataTable.Cell>
                    <DataTable.Cell style={styles.field}><View ><TextInput placeholder='EC (us/cm)' keyboardType='numeric' key="EC" onChangeText={text => handleInputChange(text, 'Ec')}/></View></DataTable.Cell>
                    <DataTable.Cell style={styles.field}><View ><TextInput placeholder='Remarks' key="=remarks" onChangeText={text => handleInputChange(text, '=remarks')}/></View></DataTable.Cell>
                    <DataTable.Cell style={styles.field}><Button title='DELETE' onPress={() => {
                        if(index==0)
                        {
                            Alert.alert('WARNING','Sorry First Row Cannot Delete')
                        }
                        else
                        {
                            setRows(rows-1)
                        }
                    }}/></DataTable.Cell>
                </DataTable.Row>
                 )})}
            </DataTable>
            </View>
        </ScrollView>
        <Text></Text>
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        <Button onPress={()=>
        {
            setRows(rows+1)       
        }} 
        
        title='Add Row'/>
        </View>
        <Text></Text>
        <View style={{justifyContent:'center',alignItems:'center'}}>
            <Button title='save' onPress={done}/> 
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
    )
}
const styles=StyleSheet.create({
    Header:{
        borderWidth:1,
        borderColor:'grey',
        width:150,
        justifyContent:'center',
        backgroundColor:'#9efcfa',
        flex:1
    },
    field:{
        borderWidth:1,
        borderColor:'grey',
        width:100,
        justifyContent:'center',
        height:50
    },
    HeadText:{
        color:'#060707',
        fontSize:15
    },
    button: {
        marginLeft: -10,
      },
      Save: {
        fontSize:20
      },
})

export default SData;