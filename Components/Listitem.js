import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { Modal } from 'react-native-paper';

const Listitem = ({item,index,visible,onPress}) => {
  const backgroundColor = index % 2 === 0 ? '#f2f2f2' : '#ffffff'; // alternate background colors
  return (
    <Modal visible={visible}>
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{item.id}</Text>
    </View>
    <TouchableOpacity onPress={onPress}>
            <Text style={{marginLeft:100,backgroundColor:'blue'}}>BACK</Text>
          </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default Listitem;
