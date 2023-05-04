import {Text,View,Modal,Pressable} from 'react-native';

const Warning=(props)=>
{
    return(
       
            <Modal visible={props.visible}
            transparent
            animationType='slide'
            >
               <View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
                <View style={{height:250,width:'100%',borderWidth:1,borderColor:'grey',borderRadius:40,alignItems:'center',backgroundColor:'yellow'}}>
                    <Text style={{fontSize:24,fontWeight:'bold', color:'#f30b16'}}>Warning</Text>
                    <Text style={{marginBottom:20}}></Text>
                    <Text style={{marginBottom:50}}>Please Entered Validate Username And Password</Text>
                    <Pressable
                    onPress={props.change}
                    style={({pressed})=>({backgroundColor:pressed? '#3a365d':'#1b0eaf'})}
                    >
               <View style={{height:40,width:80,justifyContent:'center',alignItems:'center'}}>
          <Text>cancel</Text>
          </View>
        </Pressable>
                </View>
                </View>
            </Modal>
       
    )
}

export default Warning;