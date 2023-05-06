import React, { useState } from 'react';
import { Modal, FlatList, View, Text ,Button,StyleSheet,TouchableOpacity} from 'react-native';

  const renderItem = ({ item,index }) => 
  {
    const colors = ['#E57373', '#F06292', '#BA68C8', '#64B5F6', '#4DB6AC'];
    // Get the color based on the index of the item
    const backgroundColor = colors[index % colors.length];
    return(
  <View style={[styles.item, { backgroundColor }]} key={item.id}>
      <Text style={styles.itemText}>{item.bore_hole_numbers}</Text>
    </View>
    )
  }

const BoreHoleNumbersStart=({data,visible,onPress})=> {

  return (
    
    <Modal visible={visible} transparent animationType='fade'>
      <View style={{backgroundColor:'rgba(0,0,0,0.5)',flex:1,justifyContent:'center'}}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={6}
    />
    <TouchableOpacity style={styles.button}
          onPress={onPress}
          >
            <Text style={styles.buttonText}>BACK</Text>
          </TouchableOpacity>
   </View>
  </Modal>
   

  );
}

const styles=StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  item: {
    padding: 3,
    width:'14%',
    marginVertical: 8,
    marginHorizontal: 5,
    elevation: 2,
    borderRadius:20,
    alignItems:'center'
  },
  itemText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
})

export default BoreHoleNumbersStart;
