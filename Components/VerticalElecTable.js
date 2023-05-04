import {DataTable} from 'react-native-paper';
import {View,Text, TextInput,Button, ScrollView,StyleSheet, Pressable, FlatList, Alert,Image} from 'react-native';
import { TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';

const VerticalElecTable=()=>
{
    const [takeData,setTakeData]=useState([]);
    useEffect(()=>
    {
        fetch('http://182.18.181.115:8091///api/VES/GetVesMaster').
        then(response=>response.json()).
        then(responseData=>JSON.parse(responseData)).
        then(result=>setTakeData(result)).catch(error=>console.log(error))
    })
    return(
<ScrollView>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>Station No</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}>AB/2(m)</Text></DataTable.Title>
                <DataTable.Title style={styles.Header}><Text style={styles.HeadText}> MN/2(m)</Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'grey',
                      width:120,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}><Text style={styles.HeadText}>Resistivity(ohm)<Text style={{color:'red'}}>*</Text></Text></DataTable.Title>
                <DataTable.Title style={{
                      borderWidth:1,
                      borderColor:'grey',
                      width:95,
                      justifyContent:'center',
                      backgroundColor:'#9efcfa',
                      flex:1
                }}><Text style={styles.HeadText}>App.Res(ohms)</Text></DataTable.Title>              
                </DataTable.Header>
                {takeData.map(item=>(
                       <DataTable.Row key={item.vesMasterId}>
                        
                       <DataTable.Cell style={styles.field}>{item.StationNo}</DataTable.Cell>
                       <DataTable.Cell style={styles.field}><View ><TextInput value={item.AB}/></View></DataTable.Cell>
                       <DataTable.Cell style={styles.field}><View ><TextInput value={item.MN}/></View></DataTable.Cell>
                       <DataTable.Cell style={{
                            borderWidth:1,
                            borderColor:'grey',
                            width:120,
                            justifyContent:'center',
                            height:50
                       }}><View ><TextInput placeholder='Discharge.Q' keyboardType='numeric' key="Discharge" onChangeText={text => handleInputChange(text, 'Discharge')}/></View></DataTable.Cell>
                       <DataTable.Cell style={{
                             borderWidth:1,
                             borderColor:'grey',
                             width:95,
                             justifyContent:'center',
                             height:50
                       }}><View ><TextInput placeholder='EC (us/cm)' keyboardType='numeric' key="EC" onChangeText={text => handleInputChange(text, 'Ec')}/></View></DataTable.Cell>
                      
                   </DataTable.Row>
                ))}
            </DataTable>
           
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
        height:50
    },
    HeadText:{
        color:'#060707',
        fontSize:13
    },
    button: {
        marginLeft: -10,
      },
      Save: {
        fontSize:20
      },
})

export default VerticalElecTable;