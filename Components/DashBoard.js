import { useEffect ,useLayoutEffect} from 'react';
import React from 'react';
import {View,Text,StyleSheet,FlatList,Button,Pressable,Modal,Alert,TouchableOpacity,ActivityIndicator,Image} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { FAB, TextInput } from 'react-native-paper';
import {DataTable} from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';




const db=SQLite.openDatabase('Uganda');
const DashBoard=({navigation})=>
{
  const resultSaved=[];
  const TotalData=[];
  const stepTestTableData=[];
  const ConstDisTableData=[];
  const constTestTableData=[]
  
  const [dataSendForLog,setDataSendForLog]=useState(false)
  const [dataTable,setDataTable]=useState([]);
  const [userid,setUserid]=useState();
    const [userName,setUserName]=useState();

    const [isValueTrue, setIsValueTrue] = useState(null);

    const [loadingForStatTr,SetLoadingForStatTr]=useState(true);

    const [loadingForStat,setLoadingForStat]=useState(false);

    const [myLoad,setMyLoad]=useState(false);

    const [allDataRendered, setAllDataRendered] = useState(false);

    const [boreHoleNumNotFound,setBoreHoleNumNotFound]=useState(false)
    const [savedForLogDeep,setSavedForLogDeep]=useState(false);
    const [savedForStepTest,setSavedForStepTest]=useState(false);
    const [savedForStepTestRecovery,setSavedForStepTestRecovery]=useState(false);
    const [savedForVesMaster,setSavedForVesMaster]=useState(false);
    const [savedForConstDesTest,setSavedForConstDesTest]=useState(false);
    const [savedForConstTestRecovery,setSavedForConstTestRecovery]=useState(false)

    const [errorForLogDeep,setErrorForLogDeep]=useState(false)
    const [errorForStepTest,setErrorForStepTest]=useState(false);
    const [errorForStepTestRecovery,setErrorForStepTestRecovery]=useState(false);
    const [errorForVesMaster,setErrorForVesMaster]=useState(false)
    const [errorForConstDesTest,setErrorForConstDesTest]=useState(false)
    const [errorForConstTestRecovery,setErrorForConstTestRecovery]=useState(false)
  

    const [sendingData,setSendingData]=useState(false);
    const [datanotFound,setDataNotFound]=useState(false)

    const [loading, setLoading] = useState(true);
    
    const [loadingForTrFa,setLoadingForTrFa]=useState(false);
    const [boreHoleNumAlrExist,setBoreHoleNumAlrExist]=useState(false)
    const [boreHoleNumAdded,setBoreHoleNumAdded]=useState(false)
    const [enterBorehole,setEnterBoreholeNum]=useState(false)


    const [boreHoleNumForLog,setBoreHoleNumForLog]=useState([]);
    const [boreHoleNumForStep,setBoreHoleNumForStep]=useState([]);
    const [boreHoleNumForStepRec,setBoreHoleNumForStepRec]=useState([]);
    const [boreHoleNumForVes,setBoreHoleNumForVes]=useState([]);
    const [boreHoleNumForConstDesTes,setBoreHoleNumForConstDesTes]=useState([])
    const [boreHoleNumForConstTesRec,setBoreHoleNumForConstTesRec]=useState([])


    const [sendingStatForLog,SetSendingStatForLog]=useState([]);
    const [sendingStatForStepTest,SetSendingStatForStepTest]=useState([]);
    const [sendingStatForStepTestRecov,SetSendingStatForStepTestRecov]=useState([]);
    const [sendingStatForConstDis,SetSendingStatForConstDis]=useState([]);
    const [sendingStatForConstDisReco,SetSendingStatForConstDisReco]=useState([]);
    const [sendingStatForVes,SetSendingStatForVes]=useState([]);

    const [newBoreHoleNum,setNewBoreHoleNum]=useState('');
    const [modalVis,setModalVis]=useState(false);

  
    const [boreHoleNumGet,setBoreHoleNumGet]=useState([])

    const [visible,setVisible]=useState(false);
    const [data,setData]=useState([])

    const refreshScreen=()=>
    {
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
      const isTableEmpty1 = () => {
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
      const isTableEmpty2 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM StepTestTable',
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
      const isTableEmpty3 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM StepTestRecovery',
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
      const isTableEmpty4 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM VesMasterTable',
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
      const isTableEmpty5 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM ConstantDesTest',
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

      const isTableEmpty6 = () => {
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
      isTableEmpty1()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            {
                tx.executeSql(
                    'SELECT bore_hole_num FROM DeepWellLogInfos',
                    [],
                    (_, { rows }) => {
                      setBoreHoleNumForLog(rows._array.map((row) => row.bore_hole_num));
                      setLoadingForTrFa(false)
                           
            })
        })
        }
    })
    isTableEmpty2()
    .then((empty) => {
      if(!empty)
      {
        setLoadingForTrFa(true)
        db.transaction(tx=>
          {
              tx.executeSql(
                  'SELECT bore_hole_num FROM StepTestForm',
                  [],
                  (_, { rows }) => {
                          setBoreHoleNumForStep(rows._array.map((row) => row.bore_hole_num));
                          setLoadingForTrFa(false)
          })
      })
       
      }
  })
  isTableEmpty3()
  .then((empty) => {
    if(!empty)
    {
      setLoadingForTrFa(true)
      db.transaction(tx=>
        {
            tx.executeSql(
                'SELECT bore_hole_num FROM StepTestRecovery',
                [],
                (_, { rows }) => {
                        setBoreHoleNumForStepRec(rows._array.map((row) => row.bore_hole_num));
                        setLoadingForTrFa(false)
        })
    }) 
    }
})
isTableEmpty4()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      {
          tx.executeSql(
              'SELECT bore_hole_num FROM VesMasterTable',
              [],
              (_, { rows }) => {
                      setBoreHoleNumForVes(rows._array.map((row) => row.bore_hole_num));
                      setLoadingForTrFa(false)
      })
  }) 
  }
})

isTableEmpty5()
  .then((empty) => {
    if(!empty)
    {
      setLoadingForTrFa(true)
      db.transaction(tx=>
        {
          
            tx.executeSql(
                'SELECT bore_hole_num FROM ConstantDesTest',
                [],
                (_, { rows }) => {
                        setBoreHoleNumForConstDesTes(rows._array.map((row) => row.bore_hole_num));
                        setLoadingForTrFa(false)
        })
    })
     
    }
})
isTableEmpty6()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      {
        
          tx.executeSql(
              'SELECT bore_hole_num FROM ConstantTestRecovery',
              [],
              (_, { rows }) => {
                      setBoreHoleNumForConstTesRec(rows._array.map((row) => row.bore_hole_num));
                      setLoadingForTrFa(false)
      })
  })
   
  }
})


const isTableEmptyForSen1 = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM LogForDeepWellSendingStauts',
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
const isTableEmptyForSen2 = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM StepTestSendingStauts',
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
const isTableEmptyForSen3 = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM StepTestRecoverySendingStauts',
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
const isTableEmptyForSen4 = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM ConstantDisTestSendingStauts',
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
const isTableEmptyForSen5 = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM ConstantTestRecoverySendingStauts',
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

const isTableEmptyForSen6 = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM VesMasterSendingStauts',
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


isTableEmptyForSen1()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT bore_hole_num FROM LogForDeepWellSendingStauts',
              [],
              (_, { rows }) => {
                SetSendingStatForLog(rows._array.map((row) => row.bore_hole_num)); 
                setLoadingForTrFa(false)                               
      })
  })
  }
})

isTableEmptyForSen2()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT bore_hole_num FROM StepTestSendingStauts',
              [],
              (_, { rows }) => {
                SetSendingStatForStepTest(rows._array.map((row) => row.bore_hole_num)); 
                setLoadingForTrFa(false)     
      })
  })
  }
})
isTableEmptyForSen3()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT bore_hole_num FROM StepTestRecoverySendingStauts',
              [],
              (_, { rows }) => {
                SetSendingStatForStepTestRecov(rows._array.map((row) => row.bore_hole_num)); 
                setLoadingForTrFa(false)  
      })
  })
  }
})
isTableEmptyForSen4()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT bore_hole_num FROM ConstantDisTestSendingStauts',
              [],
              (_, { rows }) => {
                SetSendingStatForConstDis(rows._array.map((row) => row.bore_hole_num)); 
                setLoadingForTrFa(false)  
      })
  })
  }
})

isTableEmptyForSen5()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT bore_hole_num FROM ConstantTestRecoverySendingStauts',
              [],
              (_, { rows }) => {
                SetSendingStatForConstDisReco(rows._array.map((row) => row.bore_hole_num)); 
                setLoadingForTrFa(false)  
      })
  })
  }
})

isTableEmptyForSen6()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      { 
          tx.executeSql(
              'SELECT bore_hole_num FROM VesMasterSendingStauts',
              [],
              (_, { rows }) => {
                SetSendingStatForVes(rows._array.map((row) => row.bore_hole_num)); 
                setLoadingForTrFa(false);
              
      })
  })
  }
})



db.transaction((tx) => {
tx.executeSql(
  'SELECT * FROM BoreHoleNumbers',
  [],
    (_, { rows: { _array } }) => {
       setBoreHoleNumGet(_array)
       setLoading(false);
       
       
    },
  (tx, error) => {
    console.log('Error fetching data from database:', error);
    setLoading(false);
  },
);
});  
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
    
    }

    
    useEffect(()=>{
      setLoading(true)
      setLoadingForTrFa(false);
      setSendingData(false);
      setErrorForConstDesTest(false);
      setErrorForStepTestRecovery(false);
      setErrorForStepTest(false);      
      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"LogForDeepWellSendingStauts"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully LogForDeepWellSendingStauts");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })

      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"StepTestSendingStauts"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully StepTestSendingStauts");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })

      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"StepTestRecoverySendingStauts"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully StepTestRecoverySendingStauts");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })

      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"ConstantDisTestSendingStauts"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully ConstantDisTestSendingStauts");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })

      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"ConstantTestRecoverySendingStauts"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully ConstantTestRecoverySendingStauts");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })

      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"VesMasterSendingStauts"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully VesMasterSendingStauts");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })


      const isTableEmptyForSen1 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM LogForDeepWellSendingStauts',
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
      const isTableEmptyForSen2 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM StepTestSendingStauts',
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
      const isTableEmptyForSen3 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM StepTestRecoverySendingStauts',
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
      const isTableEmptyForSen4 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM ConstantDisTestSendingStauts',
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
      const isTableEmptyForSen5 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM ConstantTestRecoverySendingStauts',
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
      
      const isTableEmptyForSen6 = () => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT COUNT(*) as count FROM VesMasterSendingStauts',
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
      isTableEmptyForSen1()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            { 
                tx.executeSql(
                    'SELECT bore_hole_num FROM LogForDeepWellSendingStauts',
                    [],
                    (_, { rows }) => {
                      SetSendingStatForLog(rows._array.map((row) => row.bore_hole_num)); 
                      setLoadingForTrFa(false)    
            })
        })
        }
      })
      
      isTableEmptyForSen2()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            { 
                tx.executeSql(
                    'SELECT bore_hole_num FROM StepTestSendingStauts',
                    [],
                    (_, { rows }) => {
                      SetSendingStatForStepTest(rows._array.map((row) => row.bore_hole_num)); 
                      setLoadingForTrFa(false)     
            })
        })
        }
      })
      isTableEmptyForSen3()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            { 
                tx.executeSql(
                    'SELECT bore_hole_num FROM StepTestRecoverySendingStauts',
                    [],
                    (_, { rows }) => {
                      SetSendingStatForStepTestRecov(rows._array.map((row) => row.bore_hole_num)); 
                      setLoadingForTrFa(false)  
            })
        })
        }
      })
      isTableEmptyForSen4()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            { 
                tx.executeSql(
                    'SELECT bore_hole_num FROM ConstantDisTestSendingStauts',
                    [],
                    (_, { rows }) => {
                      SetSendingStatForConstDis(rows._array.map((row) => row.bore_hole_num)); 
                      setLoadingForTrFa(false)  
            })
        })
        }
      })
      
      isTableEmptyForSen5()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            { 
                tx.executeSql(
                    'SELECT bore_hole_num FROM ConstantTestRecoverySendingStauts',
                    [],
                    (_, { rows }) => {
                      SetSendingStatForConstDisReco(rows._array.map((row) => row.bore_hole_num)); 
                      setLoadingForTrFa(false)  
            })
        })
        }
      })
      
      isTableEmptyForSen6()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            { 
                tx.executeSql(
                    'SELECT bore_hole_num FROM VesMasterSendingStauts',
                    [],
                    (_, { rows }) => {
                      SetSendingStatForVes(rows._array.map((row) => row.bore_hole_num)); 
                      setLoadingForTrFa(false)     
            })
        })
        }
      })
      
      


      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM BoreHoleNumbersFromApi',
          [],
            (_, { rows: { _array } }) => {setData(_array);},
          (tx, error) => {
            console.log('Error fetching data from database:', error);
          },
        );
      }); 
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
        +"StepTestTable"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,step_no INTEGER,time INTEGER,Water_level VARCHAR,draw_down VARCHAR,discharge VARCHAR,Ec VARCHAR,remarks VARCHAR,bore_hole_num VARCHAR NOT NULL)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully StepTestTable");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
      })
      db.transaction((tx)=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
                      +"DeepWellLogInfos"
                      +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NUT NULL,start_date DATE NOT NULL,end_date DATE NOT NULL,driller_unit Integer NOT NULL,table_height INTEGER NOT NULL,dril_rod_len INTEGER NOT NULL,dril_bit_len INTEGER NOT NULL)",
                      [],
          (txObj,result)=>
  
        {
          console.log("TABLE DeepWellLogInfos CREATED SUCCESSFULLY");
        },
        (txObj,error)=>
        {
          console.log("There is an Error", error)
        }
        )
      })
      
      db.transaction(tx=>{
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
        +"StepTestForm"
        +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,step_no INTEGER,pump_on datetime,pump_off datetime,total_step INTEGER,dur_pum INTEGER,static_wat VARCHAR,dyn_wat VARCHAR,measu_point VARCHAR,pump_inst_depth VARCHAR,meas_by VARCHAR)",
        [],
        (tx,result)=>
        {
            console.log("Table created successfully StepTestForm");
        },
        (tx,error)=>
        {
            console.log("Sorry something went wrong ", error);
        }
        )
    })
    db.transaction(tx=>{
      tx.executeSql("CREATE TABLE IF NOT EXISTS "
      +"StepTestRecovery"
      +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,pumpOn DATETIME NOT NULL,pumpOff DATETIME NOT NULL,DuPumtime INTEGER NOT NULL,staicWaterLev VARCHAR NOT NULL,DynWaterLev VARCHAR,measureP VARCHAR,pumpInstdep VARCHAR,measBy VARCHAR)",
      [],
      (tx,result)=>
      {
          console.log("Table created successfully StepTestRecovery");
      },
      (tx,error)=>
      {
          console.log("Sorry something went wrong ", error);
      }
      )
  })
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
db.transaction(tx=>{
  tx.executeSql("CREATE TABLE IF NOT EXISTS "
  +"ConstantDesTest"
  +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,pump_on TIMESTAMP,pump_off TIMESTAMP,dur_pum_test INTEGER,static_wat VARCHAR,dyn_wat VARCHAR,measu_point VARCHAR,pump_inst_depth VARCHAR,meas_by VARCHAR)",
  [],
  (tx,result)=>
  {
      console.log("Table created successfully ConstantDesTest");
  },
  (tx,error)=>
  {
      console.log("Sorry something went wrong ", error);
  }
  )
})

db.transaction(tx=>{
  tx.executeSql("CREATE TABLE IF NOT EXISTS "
  +"ConstantDesTestTable"
  +"(id INTEGER PRIMARY KEY AUTOINCREMENT,time INTEGER,Water_level VARCHAR,draw_down VARCHAR,discharge VARCHAR,Ec VARCHAR,remarks VARCHAR,bore_hole_num VARCHAR NOT NULL)",
  [],
  (tx,result)=>
  {
      console.log("Table created successfully ConstantDesTestTable");
  },
  (tx,error)=>
  {
      console.log("Sorry something went wrong ", error);
  }
  )
})


db.transaction(tx=>{
  tx.executeSql("CREATE TABLE IF NOT EXISTS "
  +"ConstantTestRecovery"
  +"(id INTEGER PRIMARY KEY AUTOINCREMENT,bore_hole_num VARCHAR NOT NULL,pumpOn DATETIME NOT NULL,pumpOff DATETIME NOT NULL,DuPumtime INTEGER NOT NULL,staicWaterLev VARCHAR NOT NULL,DynWaterLev VARCHAR,measureP VARCHAR,pumpInstdep VARCHAR,measBy VARCHAR)",
  [],
  (tx,result)=>
  {
      console.log("Table created successfully ConstantTestRecovery");
  },
  (tx,error)=>
  {
      console.log("Sorry something went wrong ", error);
  }
  )
})





const isTableEmpty1 = () => {
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
       
          const isTableEmpty2 = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM StepTestTable',
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
          const isTableEmpty3 = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM StepTestRecovery',
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
          const isTableEmpty4 = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM VesMasterTable',
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

          const isTableEmpty5 = () => {
            return new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'SELECT COUNT(*) as count FROM ConstantDesTest',
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

          const isTableEmpty6 = () => {
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

          isTableEmpty1()
          .then((empty) => {
            if(!empty)
            {
              setLoadingForTrFa(true)
              db.transaction(tx=>
                {
                  
                    tx.executeSql(
                        'SELECT bore_hole_num FROM DeepWellLogInfos',
                        [],
                        (_, { rows }) => {
                                setBoreHoleNumForLog(rows._array.map((row) => row.bore_hole_num));
                                setLoadingForTrFa(false)
                })
            })
             
            }
        })
        
        isTableEmpty2()
        .then((empty) => {
          if(!empty)
          {
            setLoadingForTrFa(true)
            db.transaction(tx=>
              {
                
                  tx.executeSql(
                      'SELECT bore_hole_num FROM StepTestForm',
                      [],
                      (_, { rows }) => {
                              setBoreHoleNumForStep(rows._array.map((row) => row.bore_hole_num));
                              setLoadingForTrFa(false)
              })
          })
           
          }
      })
      isTableEmpty3()
      .then((empty) => {
        if(!empty)
        {
          setLoadingForTrFa(true)
          db.transaction(tx=>
            {
              
                tx.executeSql(
                    'SELECT bore_hole_num FROM StepTestRecovery',
                    [],
                    (_, { rows }) => {
                            setBoreHoleNumForStepRec(rows._array.map((row) => row.bore_hole_num));
                            setLoadingForTrFa(false)
            })
        }) 
        }
    })
    isTableEmpty4()
    .then((empty) => {
      if(!empty)
      {
        setLoadingForTrFa(true)
        db.transaction(tx=>
          {
              tx.executeSql(
                  'SELECT bore_hole_num FROM VesMasterTable',
                  [],
                  (_, { rows }) => {
                          setBoreHoleNumForVes(rows._array.map((row) => row.bore_hole_num));
                          setLoadingForTrFa(false)
          })
      }) 
      }
  })
  
  isTableEmpty5()
  .then((empty) => {
    if(!empty)
    {
      setLoadingForTrFa(true)
      db.transaction(tx=>
        {
          
            tx.executeSql(
                'SELECT bore_hole_num FROM ConstantDesTest',
                [],
                (_, { rows }) => {
                        setBoreHoleNumForConstDesTes(rows._array.map((row) => row.bore_hole_num));
                        setLoadingForTrFa(false)
        })
    })
     
    }
})
isTableEmpty6()
.then((empty) => {
  if(!empty)
  {
    setLoadingForTrFa(true)
    db.transaction(tx=>
      {
        
          tx.executeSql(
              'SELECT bore_hole_num FROM ConstantTestRecovery',
              [],
              (_, { rows }) => {
                      setBoreHoleNumForConstTesRec(rows._array.map((row) => row.bore_hole_num));
                      setLoadingForTrFa(false);
                      
      
      })
  })
   
  }
})

db.transaction((tx) => {
  tx.executeSql(
    'SELECT * FROM BoreHoleNumbers',
    [],
      (_, { rows: { _array } }) => 
      {
        setBoreHoleNumGet(_array);
        setLoading(false)
       
      },
    (tx, error) => {
      console.log('Error fetching data from database:', error);
      setLoading(false);

    },
  );
});  

  
  const unsubscribe = navigation.addListener('focus', () => {
    refreshScreen();
    
  });

  return unsubscribe;

    },[navigation,refreshBoreholeNumbersApi]);



if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dffcfc' }}>
      <View style={{position: 'relative'}}>
        <Image source={require('../assets/logo-removebg-preview.png')} style={{height: 50, width: 50}} />
        <ActivityIndicator size={50} color="#000" style={{marginTop:-48}}/> 
      </View>
      <Text style={{fontSize:25,color:'blue',fontFamily:'PoltawskiNowy-VariableFont_wght'}}>Loading.....</Text>
    </View>
  );
}


   


    
  const sendData=(boreHoleNumFromValues)=>
  {
   
    fetch('http://182.18.181.115:8091/api/BoreholeNumber/Get/', {
      method: 'POST',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
   body: JSON.stringify({
     userId: userid,
     BoreholeNumber: boreHoleNumFromValues,
   }),
 })
   .then((response) => response.json()).
   then(resData=>JSON.parse(resData))
   .then(async (responseData) => {
     
     if(responseData.length!==0)            
     {
      const bID=responseData[0].boreholeId;
      sendDataForLogForDeepWell(boreHoleNumFromValues,bID);
      setTimeout(()=>
      {
        sendDataForStepTest(boreHoleNumFromValues,bID)
      },4000)

      setTimeout(()=>
      {
        sendDataForStepTestRecovery(boreHoleNumFromValues,bID)
      },8000)

      setTimeout(()=>
      {
        sendDataForConstDesTest(boreHoleNumFromValues,bID)
      },12000)
      setTimeout(()=>
      {
        sendDataForConstTestRecovery(boreHoleNumFromValues,bID)
      },17000)
      setTimeout(()=>
      {
        sendDataForVesMaster(boreHoleNumFromValues,bID);
        refreshScreen();
      },21000)
     
     }
     else
     {
      setBoreHoleNumNotFound(true);
      setTimeout(()=>
      {
        setBoreHoleNumNotFound(false);
      },3000)
     }
    })   
  }


  const sendDataForLogForDeepWell=(boreHoleNumFromValues,bID)=>
  {
    setSendingData(true);
    db.transaction(tx=>
      {
        
        tx.executeSql('SELECT * FROM DeepWellLogInfosTable WHERE bore_hole_num = ?',
        [boreHoleNumFromValues],
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

db.transaction(tx=>
  {
     tx.executeSql('SELECT * FROM DeepWellLogInfos WHERE bore_hole_num=?',
       [boreHoleNumFromValues],
       (tx,results)=>
     { 
           for (let i = 0; i < results.rows.length; i++)
       {
        let {id,bore_hole_num,start_date,end_date,driller_unit,table_height,dril_rod_len,dril_bit_len} = results.rows.item(i);            
        console.log(bID);
        return fetch('http://182.18.181.115:8091/api/DeepWellLogForm/Insert', {
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
              db.transaction(tx=>{
                tx.executeSql('SELECT bore_hole_num from LogForDeepWellSendingStauts',[],
                (_, { rows }) => {
                  // Get all values from the column and check if drillPip is exists
                  const boreHoleValues = rows._array.map((row) => row.bore_hole_num);
                  if (boreHoleValues.includes(boreHoleNumFromValues)) {
                    console.log("Value already Exist")
                  }
                  else
                  {
                    tx.executeSql("INSERT INTO LogForDeepWellSendingStauts"
                    +"(bore_hole_num) VALUES(?)",
                                [boreHoleNumFromValues],
                                (tx,result)=>
                                {
                                   console.log('Data Inserted Into LogForDeepWellSendingStauts Sucess')
                                },
                                (tx,error)=>
                                {
                                    console.log(error);
                                }
                    )
                  }
                }
                )
              })
              setSendingData(false);
             setSavedForLogDeep(true);
             setTimeout(()=>
             {
              setSavedForLogDeep(false)
             },2000)
            }
            else
            {

            
              setSendingData(false);
              setErrorForLogDeep(true);
              setTimeout(()=>
             {
              setErrorForLogDeep(false);
             },1800)
            }
          })
      }
    })
  })
  }


const sendDataForStepTest=(boreHoleNumFromValues,bID)=>
{
  setSendingData(true);
  db.transaction(tx=>
    {                                
     tx.executeSql('SELECT * FROM StepTestForm where bore_hole_num=?',
      [boreHoleNumFromValues],
      (tx,results)=>
      {            
        console.log(results.rows.length)
        for (let i = 0; i <results.rows.length;i++)
         {                                        
            const stepTestTableArrayData=[];
            const { id,bore_hole_num,step_no,pump_on,pump_off,total_step,dur_pum,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by} = results.rows.item(i);        
            const dateTimeString1 = pump_on; 
            const dateParts1 = dateTimeString1.split('/');
             const timeParts1 = dateParts1[2].split(', ')[1].split(':');
            const year1 = parseInt(dateParts1[2].split(', ')[0]);
           const  day1= parseInt(dateParts1[0])+1; // subtract 1 to convert to 0-based index
           const month1 = parseInt(dateParts1[1])-1;
            const hour1 = parseInt(timeParts1[0]);
            const minute1 = parseInt(timeParts1[1]);
           const second1 = parseInt(timeParts1[2]);
           const dateTime1 = new Date(year1, month1, day1, hour1, minute1, second1);
           const isoDateTime1 = dateTime1.toISOString();
  
           const dateTimeString = pump_off; 
            const dateParts = dateTimeString.split('/');
             const timeParts = dateParts[2].split(', ')[1].split(':');
            const year = parseInt(dateParts[2].split(', ')[0]);
           const day = parseInt(dateParts[0])+1; // subtract 1 to convert to 0-based index
           const month = parseInt(dateParts[1])-1;
            const hour = parseInt(timeParts[0]);
            const minute = parseInt(timeParts[1]);
           const second = parseInt(timeParts[2]);
           const dateTime = new Date(year, month, day, hour, minute, second);
           const isoDateTime = dateTime.toISOString();
           console.log("StepTestTable",pump_on,isoDateTime1);
           console.log("stepTestTable",pump_off,isoDateTime);
                  tx.executeSql('SELECT * FROM StepTestTable where step_no=? AND bore_hole_num=?',
                  [step_no,boreHoleNumFromValues],
                  (tx,results)=>
                  {                          
                    for (let i = 0; i < results.rows.length; i++) {
                      const row = results.rows.item(i);                                                  
                      stepTestTableArrayData.push({
                          StepNo:row.step_no,
                          Time:row.time,
                          Water_Level:row.Water_level,
                          Draw_Down:row.draw_down,
                          Discharge:row.discharge,
                          EC:row.Ec,
                          Remarks:row.remarks
                      });
                    }        
                         console.log(stepTestTableArrayData) 
                  }
                  )
                 fetch('http://182.18.181.115:8091//api/StepTest/Insert',
                    {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                 body: JSON.stringify({
                    DrawdownPumpOn: isoDateTime1,
                    DrawdownPumpOff: isoDateTime,
                    StepTestNo: step_no,
                    DrawdownDuration: dur_pum,
                    DrawdownSWL: static_wat,
                    DrawdownDWL: dyn_wat,
                    DrawdownMeasuringPoint: measu_point,
                    DrawdownPumpInstallationDepth: pump_inst_depth,
                    DrawdownMeasuredBy: meas_by,
                    DrawdownTable: stepTestTableArrayData,
                    DrawdownSiteFile:'dfkdfkdjfd',
                    userid: userid,
                    userName:userName,
                    boreholeId:bID
                 }),
               }).then(response=>response.json()).
               then(responseData=>JSON.parse(responseData)).
               then(result=>
                {
                    resultSaved.push(result)
                    console.log(resultSaved)
                    console.log(result)
                    if(result==='Saved')
                    {

                      db.transaction(tx=>{
                        tx.executeSql('SELECT bore_hole_num from StepTestSendingStauts',[],
                        (_, { rows }) => {
                          // Get all values from the column and check if drillPip is exists
                          const boreHoleValues = rows._array.map((row) => row.bore_hole_num);
                          if (boreHoleValues.includes(boreHoleNumFromValues)) {
                            console.log("Value already Exist")
                          }
                          else
                          {
                            tx.executeSql("INSERT INTO StepTestSendingStauts"
                            +"(bore_hole_num) VALUES(?)",
                                        [boreHoleNumFromValues],
                                        (tx,result)=>
                                        {
                                           console.log('Data Inserted Into StepTestSendingStauts Sucess')
                                        },
                                        (tx,error)=>
                                        {
                                            console.log(error);
                                        }
                            )
                          }
                        }
                        )
                      })

                      setSendingData(false);
                     setSavedForStepTest(true);
                     setTimeout(()=>{
                      setSavedForStepTest(false)
                     },2000)
                    }
                    else
                    {

                    
                      setSendingData(false);
                     setErrorForStepTest(true);
                     setTimeout(()=>
                     {
                      setErrorForStepTest(false)
                     },1800)
                    }
                  })
                }
              })
            })
}


const sendDataForStepTestRecovery=(boreHoleNumFromValues,bID)=>
{
  setSendingData(true)
  db.transaction(tx=>
    {
      
      tx.executeSql('SELECT * FROM StepTestRecoveryTable where bore_hole_num=?',
      [boreHoleNumFromValues],
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

  db.transaction(tx=>
    {
        tx.executeSql('SELECT * FROM StepTestRecovery WHERE bore_hole_num=?',
         [boreHoleNumFromValues],
         (tx,results)=>
       { 
             for (let i = 0; i < results.rows.length; i++) {
          let {id,bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy} = results.rows.item(i);
          const dateTimeString1 = pumpOn; 
          const dateParts1 = dateTimeString1.split('/');
           const timeParts1 = dateParts1[2].split(', ')[1].split(':');
          const year1 = parseInt(dateParts1[2].split(', ')[0]);
         const  day1= parseInt(dateParts1[0])+1; // subtract 1 to convert to 0-based index
         const month1 = parseInt(dateParts1[1])-1;
          const hour1 = parseInt(timeParts1[0]);
          const minute1 = parseInt(timeParts1[1]);
         const second1 = parseInt(timeParts1[2]);
         const dateTime1 = new Date(year1, month1, day1, hour1, minute1, second1);
         const isoDateTime1 = dateTime1.toISOString();

         const dateTimeString = pumpOff; 
         const dateParts = dateTimeString.split('/');
         const timeParts = dateParts[2].split(', ')[1].split(':');
         const year = parseInt(dateParts[2].split(', ')[0]);
         const day = parseInt(dateParts[0])+1; // subtract 1 to convert to 0-based index
         const month = parseInt(dateParts[1])-1;
         const hour = parseInt(timeParts[0]);
         const minute = parseInt(timeParts[1]);
         const second = parseInt(timeParts[2]);
         const dateTime = new Date(year, month, day, hour, minute, second);
         const isoDateTime = dateTime.toISOString();
            console.log("StepTestRecovery",pumpOn,isoDateTime1);
            console.log("StepTestRecovery",pumpOff,isoDateTime);
          return fetch('http://182.18.181.115:8091//api/StepRecovery/Insert',
          {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
       
       body: JSON.stringify({
          RecoveryPumpOn: isoDateTime1,
          RecoveryPumpOff: isoDateTime,
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

          db.transaction(tx=>{
            tx.executeSql('SELECT bore_hole_num from StepTestRecoverySendingStauts',[],
            (_, { rows }) => {
              // Get all values from the column and check if drillPip is exists
              const boreHoleValues = rows._array.map((row) => row.bore_hole_num);
              if (boreHoleValues.includes(boreHoleNumFromValues)) {
                console.log("Value already Exist")
              }
              else
              {
                tx.executeSql("INSERT INTO StepTestRecoverySendingStauts"
                +"(bore_hole_num) VALUES(?)",
                            [boreHoleNumFromValues],
                            (tx,result)=>
                            {
                               console.log('Data Inserted Into StepTestRecoverySendingStauts Sucess')
                            },
                            (tx,error)=>
                            {
                                console.log(error);
                            }
                )
              }
            }
            )
          })
          
          setSendingData(false);
          setSavedForStepTestRecovery(true);
          setTimeout(()=>
          {
           setSavedForStepTestRecovery(false)
          },2000)
        }
        else
        {
          
          setSendingData(false);
          setErrorForStepTestRecovery(true);
          setTimeout(()=>
          {
            setErrorForStepTestRecovery(false);
          },1800)
        } 
      })
    }
  })
})

}


const sendDataForConstDesTest=(boreHoleNumFromValues,bID)=>
{
setSendingData(true)
  db.transaction(tx=>
    {
      
      tx.executeSql('SELECT * FROM ConstantDesTestTable where bore_hole_num=?',
      [boreHoleNumFromValues],
      (tx,results)=>
      {
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          ConstDisTableData.push({
            Time:row.time,
            Water_Level:row.Water_level,
            Draw_Down:row.draw_down,
            Discharge:row.discharge,
            Ec:row.Ec,
            remarks:row.remarks,
          
          });
        }        
             console.log(ConstDisTableData) 
      }
      )
    })

db.transaction(tx=>
    {
        tx.executeSql('SELECT * FROM ConstantDesTest WHERE bore_hole_num=?',
        [boreHoleNumFromValues],
        (tx,results)=>
        {
            for (let i = 0; i < results.rows.length; i++) {
                let {id,bore_hole_num,pump_on,pump_off,dur_pum_test,static_wat,dyn_wat,measu_point,pump_inst_depth,meas_by} = results.rows.item(i)
                const dateTimeString1 = pump_on; 
                const dateParts1 = dateTimeString1.split('/');
                const timeParts1 = dateParts1[2].split(', ')[1].split(':');
                const year1 = parseInt(dateParts1[2].split(', ')[0]);
                const  day1= parseInt(dateParts1[0])+1; // subtract 1 to convert to 0-based index
                const month1 = parseInt(dateParts1[1])-1;
                const hour1 = parseInt(timeParts1[0]);
                const minute1 = parseInt(timeParts1[1]);
                const second1 = parseInt(timeParts1[2]);
                const dateTime1 = new Date(year1, month1, day1, hour1, minute1, second1);
                const isoDateTime1 = dateTime1.toISOString();

                const dateTimeString = pump_off; 
                const dateParts = dateTimeString.split('/');
                const timeParts = dateParts[2].split(', ')[1].split(':');
                const year = parseInt(dateParts[2].split(', ')[0]);
                const day = parseInt(dateParts[0])+1; // subtract 1 to convert to 0-based index
                const month = parseInt(dateParts[1])-1;
                const hour = parseInt(timeParts[0]);
                const minute = parseInt(timeParts[1]);
                const second = parseInt(timeParts[2]);
                const dateTime = new Date(year, month, day, hour, minute, second);
                const isoDateTime = dateTime.toISOString();

               console.log("ConstantTest",pump_on,isoDateTime1);
               console.log("ConstantTest",pump_off,isoDateTime);
                // const dateTimeOff = new Date(pump_off);
                // const pump_off_new = dateTimeOff.toISOString();
                // console.log(dateTimeOn.toISOString(), dateTimeOff.toISOString())
          fetch('http://182.18.181.115:8091/api/ConstantTest/Insert',
          {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        
       body: JSON.stringify({
        boreholeId: bID,
        BoreholeNumber: boreHoleNumFromValues,
        ConstantPumpOn: isoDateTime1,
        ConstantPumpOff: isoDateTime,
        ConstantSiteFile: 'Dummy Path',
        ConstantTable: ConstDisTableData,
        ConstantDuration: dur_pum_test,
        ConstantSWL: static_wat,
        ConstantDWL: dyn_wat,
        ConstantMeasuringPoint: measu_point,
        ConstantPumpInstallationDepth: pump_inst_depth,
        ConstantMeasuredBy: meas_by,
        userid: userid,
        userName:userName
       }),
     }).then(response=>response.json()).then(responseData=>JSON.parse(responseData)).
     then(result=>
      {
       
        if(result==="Saved")
        {
          db.transaction(tx=>{
            tx.executeSql('SELECT bore_hole_num from ConstantDisTestSendingStauts',[],
            (_, { rows }) => {
              // Get all values from the column and check if drillPip is exists
              const boreHoleValues = rows._array.map((row) => row.bore_hole_num);
              if (boreHoleValues.includes(boreHoleNumFromValues)) {
                console.log("Value already Exist")
              }
              else
              {
                tx.executeSql("INSERT INTO ConstantDisTestSendingStauts"
                +"(bore_hole_num) VALUES(?)",
                            [boreHoleNumFromValues],
                            (tx,result)=>
                            {
                               console.log('Data Inserted Into ConstantDisTestSendingStauts Sucess')
                            },
                            (tx,error)=>
                            {
                                console.log(error);
                            }
                )
              }
            }
            )
          })

          setSendingData(false)
          setSavedForConstDesTest(true);
          setTimeout(()=>{
            setSavedForConstDesTest(false)
          },2000)
        }
        else
        {
          
    
          setSendingData(false);
          setErrorForConstDesTest(true);
          setTimeout(()=>
          {
            setErrorForConstDesTest(false)
          },1800)
        }
      })
    }
  })
})

}

const sendDataForConstTestRecovery=(boreHoleNumFromValues,bID)=>
{
  setSendingData(true)
  db.transaction(tx=>
    {
      
      tx.executeSql('SELECT * FROM ConstTesRecoveryTable where bore_hole_num=?',
      [boreHoleNumFromValues],
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
           [boreHoleNumFromValues],
           (tx,results)=>
         { 
               for (let i = 0; i < results.rows.length; i++) {
            let {id,bore_hole_num,pumpOn,pumpOff,DuPumtime,staicWaterLev,DynWaterLev,measureP,pumpInstdep,measBy} = results.rows.item(i);
            const dateTimeString1 = pumpOn; 
            const dateParts1 = dateTimeString1.split('/');
            const timeParts1 = dateParts1[2].split(', ')[1].split(':');
            const year1 = parseInt(dateParts1[2].split(', ')[0]);
            const  day1= parseInt(dateParts1[0])+1; // subtract 1 to convert to 0-based index
            const month1 = parseInt(dateParts1[1])-1;
            const hour1 = parseInt(timeParts1[0]);
            const minute1 = parseInt(timeParts1[1]);
            const second1 = parseInt(timeParts1[2]);
            const dateTime1 = new Date(year1, month1, day1, hour1, minute1, second1);
            const isoDateTime1 = dateTime1.toISOString();

            const dateTimeString = pumpOff; 
            const dateParts = dateTimeString.split('/');
            const timeParts = dateParts[2].split(', ')[1].split(':');
            const year = parseInt(dateParts[2].split(', ')[0]);
            const day = parseInt(dateParts[0])+1; // subtract 1 to convert to 0-based index
            const month = parseInt(dateParts[1])-1;
            const hour = parseInt(timeParts[0]);
            const minute = parseInt(timeParts[1]);
            const second = parseInt(timeParts[2]);
            const dateTime = new Date(year, month, day, hour, minute, second);
            const isoDateTime = dateTime.toISOString();

           console.log("ConstantRecovery",pumpOn,isoDateTime1);
           console.log("ConstantRecovery",pumpOff,isoDateTime);

            fetch('http://182.18.181.115:8091/api/ConstantRecovery/Insert',
            {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          
         body: JSON.stringify({
          boreholeId: bID,
          BoreholeNumber: boreHoleNumFromValues,
          ConstRecoveryPumpOn:isoDateTime1,
          ConstRecoveryPumpOff: isoDateTime,
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
            db.transaction(tx=>{
              tx.executeSql('SELECT bore_hole_num from ConstantTestRecoverySendingStauts',[],
              (_, { rows }) => {
                // Get all values from the column and check if drillPip is exists
                const boreHoleValues = rows._array.map((row) => row.bore_hole_num);
                if (boreHoleValues.includes(boreHoleNumFromValues)) {
                  console.log("Value already Exist")
                }
                else
                {
                  tx.executeSql("INSERT INTO ConstantTestRecoverySendingStauts"
                  +"(bore_hole_num) VALUES(?)",
                              [boreHoleNumFromValues],
                              (tx,result)=>
                              {
                                 console.log('Data Inserted Into ConstantTestRecoverySendingStauts Sucess')
                              },
                              (tx,error)=>
                              {
                                  console.log(error);
                              }
                  )
                }
              }
              )
            })

            setSendingData(false);
            setSavedForConstTestRecovery(true);
            setTimeout(()=>
            {
              setSavedForConstTestRecovery(false)
            },2000)
          }
          else
          {

           

            setSendingData(false);
            setErrorForConstTestRecovery(true);
            setTimeout(()=>
            {
              setErrorForConstTestRecovery(false)
            },2000)
          }
        }

       ).catch(error=>console.log(error))
               }
              }
          )
            })
}




const sendDataForVesMaster=(boreHoleNumFromValues,bID)=>
{
  setSendingData(true)
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT vestId,Station_No,AB,MN,Resistivity,App_Res FROM VesMasterTable where bore_hole_num=?',
      [boreHoleNumFromValues],
        (_, { rows: { _array } }) => setDataTable(_array),
      (tx, error) => {
        console.log('Error fetching data from database:', error);
      },
    );
  }); 
   fetch('http://182.18.181.115:8091///api/VES/Insert', {
    method: 'POST',
    headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
 body: JSON.stringify({
  userid:userid,
  userName:userName,
  boreholeId:bID,
  BoreholeNumber:boreHoleNumFromValues,
  VES_tabledata: dataTable         
          }),
}).then(response=>response.json()).then(responseData=>JSON.parse(responseData)).then(result=> 
 {                                 
  
  if(result==="Saved")
  {     
    db.transaction(tx=>{
      tx.executeSql('SELECT bore_hole_num from VesMasterSendingStauts',[],
      (_, { rows }) => {
        // Get all values from the column and check if drillPip is exists
        const boreHoleValues = rows._array.map((row) => row.bore_hole_num);
        if (boreHoleValues.includes(boreHoleNumFromValues)) {
          console.log("Value already Exist")
        }
        else
        {
          tx.executeSql("INSERT INTO VesMasterSendingStauts"
          +"(bore_hole_num) VALUES(?)",
                      [boreHoleNumFromValues],
                      (tx,result)=>
                      {
                         console.log('Data Inserted Into VesMasterSendingStauts Sucess')
                      },
                      (tx,error)=>
                      {
                          console.log(error);
                      }
          )
        }
      }
      )
    })
    
    setSendingData(false)
   setSavedForVesMaster(true)
   setTimeout(()=>
   {
    setSavedForVesMaster(false)
   },2000)
  }
  else
  {
       setSendingData(false);
    setErrorForVesMaster(true);
    setTimeout(()=>
    {
      setErrorForVesMaster(false);
    },1800)
  }
    })

}





const refreshBoreholeNumbersApi=()=>
{
  setLoading(true)
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
      setLoading(false)
  })          
 
}

    return(       

            <View style={{flex:1,alignItems:'center'}}>

     <View style={{
      flexDirection:'row-reverse',
      width:'100%',
      backgroundColor:'#f5f9fa',
      elevation:3
    }}>
      <View style={{alignItems:'flex-end'}}>
        <TouchableOpacity
        style={{
          padding:10,
          marginRight:10,
          borderRadius:10
        }}
        onPress={refreshBoreholeNumbersApi}
        >
          <Icon name='refresh' size={20} color="#000"/>
          {/* <Image source={require('../assets/Refresh1.png')} style={{height:30,width:30}}/> */}
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
               color: '#141112',
               fontFamily:'OpenSans-Medium',
               fontSize:20
            }}>Borehole Numbers</Text>
          </TouchableOpacity>
          </View>

          </View>
{/* 
           <Button title='CheckUser' onPress={()=> 
            {
              db.transaction(tx=>{
                tx.executeSql(
                    "SELECT * FROM LogForDeepWellSendingStauts",[],
                    (tx,results)=>
                    {
                        const len=results.rows.length;
                        for(let i=0;i<len;i++)
                        {
                          console.log(results.rows.item(i))
                            // const { id, bore_hole_num,Status } = results.rows.item(i);
                            // console.log(`User ID: ${id}, bore_hole_num: ${bore_hole_num}, Status: ${Status}, `);
                        }
                    }
                )
              })
            }}/> */}

{/* <Button title='delete'
onPress={()=>
{
  
  db.transaction(tx => {
    tx.executeSql(
      'DROP TABLE IF EXISTS  LogForDeepWellSendingStauts',
      [],
      (_, result) => {
        console.log('Table deleted LogForDeepWellSendingStauts');
      },
      (_, error) => {
        console.log('Error deleting table:', error);
      }
    );

})
}}
/> */}
<Button
onPress={()=>
{
  navigation.navigate("Choose Screen");
}}
title='screens'
/>
<Text style={{fontSize:5}}></Text>
            <ScrollView
            >
                {
                    boreHoleNumGet.map((values,index)=>
                 (
                  
                    <View key={index} >
                         <View style={{flexDirection:'row',flex:1,marginLeft:20}}>
                    <TextInput value={(values.id).toString()}   readOnly style={{fontWeight:'bold',color:'#edf5c9'}}/>
                     <TextInput
                    value='BoreHole Number'
                    readOnly style={{fontWeight:'bold',color:'#edf5c9'}}
                    />
                    <TextInput
                    value={(values.bore_hole_numer)}
                    readOnly style={{fontWeight:'bold',color:'#f8f59e'}}
                    />
                   
                    </View>
                    
                    <Text></Text>
           
                        <DataTable >
                      <DataTable.Header>
                  <View style={styles.titles}>
                    <DataTable.Title>
                        <Text style={styles.headText}>S.no</Text>
                    </DataTable.Title>
                    </View>
                    <View style={{
                       borderWidth:1,
                       borderColor:'grey',
                       width:'50%',
                       justifyContent:'center',
                       alignItems:'center',
                       backgroundColor:'#b3eff7',
                    }}>
                    <DataTable.Title >
                        <Text style={styles.headText}>Well Log Forms </Text>
                    </DataTable.Title>
                    </View>
                    <View style={styles.titles}>
                    <DataTable.Title >
                        <Text style={styles.headText}>status</Text>
                    </DataTable.Title>
                    </View>
                    {
                      
                   boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               <View style={{
                borderWidth:1,
                borderColor:'grey',
                backgroundColor:'#b3eff7',
                justifyContent:'center',
                alignItems:'center',
                width:"10%",
               
            }}>
            <DataTable.Title
            style={{
              alignItems:'center',
              justifyContent:'center'
            }}
            >
              <View style={{width:'100%'}}>
              <FontAwesome5 name="file-export" size={22} color="#114044" />
              </View>
              </DataTable.Title>
              </View>

              
               : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }

                </DataTable.Header>

                <DataTable.Row>
                  <View style={styles.fields}>
                    <DataTable.Cell >
                      <Text style={styles.fieldText}>1</Text>
                      </DataTable.Cell>
                      </View>

                      <View style={styles.fieldsHead}>
                    <DataTable.Cell >
                      <Text style={styles.fieldText}>Log For Deep Well</Text>
                      </DataTable.Cell>
                      </View>

                      <View  style={styles.fields}>
                    <DataTable.Cell>
                        {
                        boreHoleNumForLog.includes(values.bore_hole_numer) ? <Text style={styles.fieldText}>Saved</Text> :
                        <View style={styles.fieldForFalse}>
                       <TouchableOpacity
                       onPress={()=>
                      {
                        const getBoreHoleNum=values.bore_hole_numer;
                        navigation.navigate('Log For DeepWell',{getBoreHoleNum})
                      }}
                       >
                        <Text style={styles.fieldTextForFalse}>Pending</Text>
                       </TouchableOpacity>                       
                       </View>
                        }
                    </DataTable.Cell>
                    </View>
                     
                    {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               sendingStatForLog.includes(values.bore_hole_numer) ?
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 justifyContent:'center',
                 alignItems:'center',
                 width:"10%"
             }}>
             <DataTable.Cell
             style={{
               alignItems:'center',
               justifyContent:'center'
             }}
             >
               <View style={{width:'100%'}}>
               <Icon name="check-circle" size={22} color="#17d238" />
             {/* <Image source={require('../assets/TickMark3.png')} style={{height:40,width:40}}/> */}
               {/* <Image source={require("../assets/Tickmark2.png")} style={{height:20,width:20}}/> */}
               </View>
               </DataTable.Cell>
               </View>
               
               :
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 width:'10%',
                 alignItems:'center',
                 justifyContent:'center',
        
             }}>
             <DataTable.Cell >
               <View
               style={{width:'100%'}}
               >
                 <Icon name="times-circle" size={22} color="#f00" />
             {/* <Image source={require('../assets/pending.png')} style={{height:30,width:30}}/> */}
             </View>
               </DataTable.Cell>
               </View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
               
            }
                </DataTable.Row>
                <DataTable.Row>
                <View style={styles.fields}>
                    <DataTable.Cell ><Text style={styles.fieldText}>2</Text></DataTable.Cell>
                    </View>
                    <View style={styles.fieldsHead}>
                    <DataTable.Cell ><Text style={styles.fieldText}>Step Test</Text></DataTable.Cell>
                    </View>
                    <View style={styles.fields}>
                    <DataTable.Cell >
                      {
                        boreHoleNumForStep.includes(values.bore_hole_numer) ? <Text style={styles.fieldText}>Saved</Text> :
                        <View style={styles.fieldForFalse}>
                       <TouchableOpacity
                       onPress={()=>
                      {
                        const getBoreHoleNum=values.bore_hole_numer;
                        navigation.navigate('Step Test',{getBoreHoleNum})
                      }}
                       >
                        <Text style={styles.fieldTextForFalse}>Pending</Text>
                       </TouchableOpacity>
                       </View>
                        }
                    </DataTable.Cell>
                    </View>
                    {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               sendingStatForStepTest.includes(values.bore_hole_numer) ?
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 justifyContent:'center',
                 alignItems:'center',
                 width:"10%"
             }}>
             <DataTable.Cell
             style={{
               alignItems:'center',
               justifyContent:'center'
             }}
             >
               <View style={{width:'100%'}}>
               <Icon name="check-circle" size={22} color="#17d238" />
             {/* <Image source={require('../assets/TickMark3.png')} style={{height:40,width:40}}/> */}
               {/* <Image source={require("../assets/Tickmark2.png")} style={{height:20,width:20}}/> */}
               </View>
               </DataTable.Cell>
               </View>
               :
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 width:'10%',
                 alignItems:'center',
                 justifyContent:'center',
        
             }}>
             <DataTable.Cell >
               <View
               style={{width:'100%'}}
               >
                <Icon name="times-circle" size={22} color="#f00" />
             {/* <Image source={require('../assets/pending.png')} style={{height:30,width:30}}/> */}
             </View>
               </DataTable.Cell>
               </View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }
                </DataTable.Row>
                <DataTable.Row>
                <View style={styles.fields}>
                    <DataTable.Cell ><Text style={styles.fieldText}>3</Text></DataTable.Cell>
                    </View>
                
                    <View style={styles.fieldsHead}>
                    <DataTable.Cell ><Text style={styles.fieldText}>Step Test Recovery</Text></DataTable.Cell>
                    </View>
                
                    <View style={styles.fields}>
                    <DataTable.Cell >{
                       boreHoleNumForStepRec.includes(values.bore_hole_numer) ? <Text style={styles.fieldText}>Saved</Text> :
                       <View style={styles.fieldForFalse}>
                       <TouchableOpacity
                         onPress={()=>
                          {
                            const getBoreHoleNum=values.bore_hole_numer;
                            navigation.navigate('Step Test Recovery',{getBoreHoleNum})
                          }}
                       >
                        <Text style={styles.fieldTextForFalse}>Pending</Text>
                       </TouchableOpacity>
                       </View>
                    }                  
                    </DataTable.Cell>
                    </View>
                    {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               sendingStatForStepTestRecov.includes(values.bore_hole_numer) ?
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 justifyContent:'center',
                 alignItems:'center',
                 width:"10%"
             }}>
             <DataTable.Cell
             style={{
               alignItems:'center',
               justifyContent:'center'
             }}
             >
               <View style={{width:'100%'}}>
               <Icon name="check-circle" size={22} color="#17d238" />
             {/* <Image source={require('../assets/TickMark3.png')} style={{height:40,width:40}}/> */}
               {/* <Image source={require("../assets/Tickmark2.png")} style={{height:20,width:20}}/> */}
               </View>
               </DataTable.Cell>
               </View>
               :
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 width:'10%',
                 alignItems:'center',
                 justifyContent:'center',
        
             }}>
             <DataTable.Cell >
               <View
               style={{width:'100%'}}
               >
                <Icon name="times-circle" size={22} color="#f00" />
             {/* <Image source={require('../assets/pending.png')} style={{height:30,width:30}}/> */}
             </View>
               </DataTable.Cell>
               </View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }
                </DataTable.Row>
                <DataTable.Row>
                <View style={styles.fields}>
                    <DataTable.Cell ><Text style={styles.fieldText}>4</Text></DataTable.Cell>
                </View>
                <View style={styles.fieldsHead}>
                    <DataTable.Cell ><Text style={styles.fieldText}>Constant Discharge Test</Text></DataTable.Cell>
                    </View>
                    <View style={styles.fields}>
                    <DataTable.Cell >{
                       boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? <Text style={styles.fieldText}>Saved</Text> :
                       <View style={styles.fieldForFalse}>
                       <TouchableOpacity
                         onPress={()=>
                          {
                            const getBoreHoleNum=values.bore_hole_numer;
                            navigation.navigate('Constant Discharge Test',{getBoreHoleNum})
                          }}
                       >
                        <Text style={styles.fieldTextForFalse}>Pending</Text>
                       </TouchableOpacity>
                       </View>
                    }
                    </DataTable.Cell>
                    </View>
                    {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               sendingStatForConstDis.includes(values.bore_hole_numer) ?
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 justifyContent:'center',
                 alignItems:'center',
                 width:"10%"
             }}>
             <DataTable.Cell
             style={{
               alignItems:'center',
               justifyContent:'center'
             }}
             >
               <View style={{width:'100%'}}>
               <Icon name="check-circle" size={22} color="#17d238" />
             {/* <Image source={require('../assets/TickMark3.png')} style={{height:40,width:40}}/> */}
               {/* <Image source={require("../assets/Tickmark2.png")} style={{height:20,width:20}}/> */}
               </View>
               </DataTable.Cell>
               </View>
               
               :
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 width:'10%',
                 alignItems:'center',
                 justifyContent:'center',
        
             }}>
             <DataTable.Cell >
               <View
               style={{width:'100%'}}
               >
                  <Icon name="times-circle" size={22} color="#f00" />
             {/* <Image source={require('../assets/pending.png')} style={{height:30,width:30}}/> */}
             </View>
               </DataTable.Cell>
               </View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }
                </DataTable.Row>
                <DataTable.Row>
                <View style={styles.fields}>
                    <DataTable.Cell ><Text style={styles.fieldText}>5</Text></DataTable.Cell>
                </View>
                <View style={styles.fieldsHead}>
                    <DataTable.Cell ><Text style={styles.fieldText}>Constant Test Recovery</Text></DataTable.Cell>
                    </View>
                    <View style={styles.fields}>
                    <DataTable.Cell >{
                       boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? <Text style={styles.fieldText}>Saved</Text> :
                       <View style={styles.fieldForFalse}>
                       <TouchableOpacity
                         onPress={()=>
                          {
                            const getBoreHoleNum=values.bore_hole_numer;
                            navigation.navigate('Constant Test Recovery',{getBoreHoleNum})
                          }}
                       >
                        <Text style={styles.fieldTextForFalse}>Pending</Text>
                       </TouchableOpacity>
                       </View>
                    }
                    </DataTable.Cell>
                    </View>
                    {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               sendingStatForConstDisReco.includes(values.bore_hole_numer) ?
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 justifyContent:'center',
                 alignItems:'center',
                 width:"10%"
             }}>
             <DataTable.Cell
             style={{
               alignItems:'center',
               justifyContent:'center'
             }}
             >
               <View style={{width:'100%'}}>
               <Icon name="check-circle" size={22} color="#17d238" />
             {/* <Image source={require('../assets/TickMark3.png')} style={{height:40,width:40}}/> */}
               {/* <Image source={require("../assets/Tickmark2.png")} style={{height:20,width:20}}/> */}
               </View>
               </DataTable.Cell>
               </View>
               
               :
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 width:'10%',
                 alignItems:'center',
                 justifyContent:'center',
        
             }}>
             <DataTable.Cell >
               <View
               style={{width:'100%'}}
               >
                  <Icon name="times-circle" size={22} color="#f00" />
             {/* <Image source={require('../assets/pending.png')} style={{height:30,width:30}}/> */}
             </View>
               </DataTable.Cell>
               </View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }
                </DataTable.Row>
                <DataTable.Row>
                <View style={styles.fields}>
                    <DataTable.Cell ><Text style={styles.fieldText}>6</Text></DataTable.Cell>
                </View>
                
                <View style={styles.fieldsHead}>
                    <DataTable.Cell ><Text style={styles.fieldText}>Vertical Electric Sounding Form</Text></DataTable.Cell>
                    </View>

                    <View style={styles.fields}>
                    <DataTable.Cell >
                      {
                       boreHoleNumForVes .includes(values.bore_hole_numer) ? <Text style={styles.fieldText}>Saved</Text> : 
                      <View style={styles.fieldForFalse}>
                       <TouchableOpacity
                        onPress={()=>
                          {
                            const getBoreHoleNum=values.bore_hole_numer;
                            navigation.navigate('Vertical Electric Sounding Form',{getBoreHoleNum})
                          }}
                       >
                        <Text style={styles.fieldTextForFalse}>Pending</Text>
                       </TouchableOpacity>
                       </View>
                        }
                        
                    </DataTable.Cell>

                    </View>
                  
                    {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? 
               sendingStatForVes.includes(values.bore_hole_numer) ?
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 justifyContent:'center',
                 alignItems:'center',
                 width:"10%"
             }}>
             <DataTable.Cell
             style={{
               alignItems:'center',
               justifyContent:'center'
             }}
             >
               <View style={{width:'100%'}}>
               <Icon name="check-circle" size={22} color="#17d238" />
             {/* <Image source={require('../assets/TickMark3.png')} style={{height:40,width:40}}/> */}
               {/* <Image source={require("../assets/Tickmark2.png")} style={{height:20,width:20}}/> */}
               </View>
               </DataTable.Cell>
               </View>
               
               :
               <View style={{
                 borderWidth:1,
                 borderColor:'grey',
                 backgroundColor:'#effafc',
                 width:'10%',
                 alignItems:'center',
                 justifyContent:'center',
        
             }}>
             <DataTable.Cell >
               <View
               style={{width:'100%'}}
               >
                  <Icon name="times-circle" size={22} color="#f00" />
             {/* <Image source={require('../assets/pending.png')} style={{height:30,width:30}}/> */}
             </View>
               </DataTable.Cell>
               </View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }
                </DataTable.Row>

            </DataTable>      
            <Text></Text>     

            {
               boreHoleNumForLog.includes(values.bore_hole_numer) ? ( boreHoleNumForStep.includes(values.bore_hole_numer) ? (boreHoleNumForStepRec.includes(values.bore_hole_numer) ? ( boreHoleNumForVes .includes(values.bore_hole_numer) ? ( boreHoleNumForConstDesTes.includes(values.bore_hole_numer) ? ( boreHoleNumForConstTesRec.includes(values.bore_hole_numer) ? <View style={{justifyContent:'center',alignItems:'center'}}><Button title='Send Data'
               onPress={()=>
              {
                const getBoreHoleNum=values.bore_hole_numer;
                // sendData(getBoreHoleNum);
                sendData(getBoreHoleNum)
              }}
               
               /></View> : <Text></Text>):<Text></Text> ) :<Text></Text>): <Text></Text> ): <Text></Text> ) :<Text></Text>
            }
            
            <Text></Text>
            <Text></Text>
            </View>
            
                 )
                 
                    )
                    
                }


<View style={styles. screensButtons}>
<Pressable
onPress={()=>{setModalVis(true)}}
style={({pressed})=>({backgroundColor:pressed?'#837083':'#4DB6AC',
height:90,
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
<View style={styles.button}>
<Text style={{fontSize:28,fontWeight:'bold',color:'white'}}>+</Text>
<Text style={styles.text}>Add New BoreHoleNumber</Text>
</View>
</Pressable>
</View>


<Text></Text>
</ScrollView>

<Modal visible={modalVis}
transparent
animationType='fade' >

        <View style={{marginTop:'23%',backgroundColor: 'rgba(0, 0, 0, 0.8)',height:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{height:250,width:'100%',alignItems:'center'}}>
                    <Text></Text>
                <Text style={styles.boreNumText}>Enter Borehole Number</Text>
                <Text></Text>
                    <TextInput placeholder="EX:DWD1234" autoCapitalize="characters" style={styles.input} value={newBoreHoleNum} onChangeText={setNewBoreHoleNum}/>
                    
                    <Text></Text>

                    <View style={{flexDirection:'row'}}>

                    <Button
                    title='cancel'
                    onPress={()=>
                    {
                        setModalVis(false)
                        setNewBoreHoleNum('');
                    }}
                    />
                  
                    <Text style={{opacity:0}}>..................</Text>

                    <Button
                    onPress={()=>
                    {

                        if(newBoreHoleNum==='')
                        {
                          setEnterBoreholeNum(true);
                          setTimeout(()=>
                          {
                            setEnterBoreholeNum(false);
                          },1000)
                        }
                        else
                        {
                          db.transaction(tx=>
                            {
                              tx.executeSql('SELECT bore_hole_numer from BoreHoleNumbers ',[],
                              (_, { rows }) => {
                                // Get all values from the column and check if drillPip is exists
                                const bore_hole_num_Values = rows._array.map((row) => row.bore_hole_numer);
                                if (bore_hole_num_Values.includes(newBoreHoleNum)) {
                                  setBoreHoleNumAlrExist(true);
                                  setTimeout(()=>
                                  {
                                    setBoreHoleNumAlrExist(false);
                                  },1000)
                                     setNewBoreHoleNum('');
                                  }
                                  else
                                  {
                                    tx.executeSql("INSERT INTO BoreHoleNumbers"
                                    +"(bore_hole_numer) VALUES(?)",
                                                [newBoreHoleNum],
                                                (tx,result)=>
                                                {
                                                   setBoreHoleNumAdded(true);
                                                   setTimeout(()=>
                                                   {
                                                      setBoreHoleNumAdded(false)
                                                   },1000)
                                                    navigation.navigate('Choose Screen')
                                                    setNewBoreHoleNum('')
                                                    setModalVis(false);
                                                },
                                                (tx,error)=>
                                                {
                                                    Alert.alert('FAIL','something went wrong');
                                                    console.log(error);
                                                }
                                          )
                                  }
                                }
                              )                            
        
                            })
                      
                        }
                           
                    }}
                    title='Sumbit'
                    
                    />
                   
                    </View>


                    </View>
                    </View>
                    
                    
            </Modal>


            <Modal visible={boreHoleNumAlrExist} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/ExcelMark.png')} style={{height:70,width:70}}/>
            <Text
            style={{fontSize:18,color:'yellow',fontWeight:'bold'}}
            >Borehole Number Already Exist</Text>
            </View>
                  </Modal>


               
                  <Modal visible={boreHoleNumAdded} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
           <Image source={require('../assets/dataSaveRight1.png')} style={{height:60,width:60}}/>
            <Text
            style={{fontSize:23,color:'#1af9ad',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
            >Boreholenumber Added</Text>
            </View>
                  </Modal>

                  <Modal visible={enterBorehole} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.4)'}}>        
           <Image source={require('../assets/dataAlreadyExistLocal.png')} style={{height:40,width:40}}/>
            <Text
            style={{fontSize:18,color:'#bef6e3',fontWeight:'bold'}}
            >Please Enter Borehole Number</Text>
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

            <Modal visible={savedForLogDeep} transparent animationType='fade' >  
                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                   <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
                    <Text
                    style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                    >Log For Deep Well Data Sended Succefully....</Text>
                    </View>
                          </Modal>
              
                <Modal visible={savedForStepTest} transparent animationType='fade' >  
                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                   <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
                    <Text
                    style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                    >StepTest Data Sended Succefully....</Text>
                    </View>
                          </Modal>

                          <Modal visible={savedForStepTestRecovery} transparent animationType='fade' >  
                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                   <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
                    <Text
                    style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                    >StepTestRecovery Data Sended Succefully....</Text>
                    </View>
                          </Modal>

                          <Modal visible={savedForVesMaster} transparent animationType='fade' >  
                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                   <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
                    <Text
                    style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                    >vesMaster Data Sended Succefully....</Text>
                    </View>
                          </Modal>

                          <Modal visible={savedForConstDesTest} transparent animationType='fade' >  
                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                   <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
                    <Text
                    style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                    >Constant Discharge Table Data Sended Succefully....</Text>
                    </View>
                          </Modal>

                          <Modal visible={savedForConstTestRecovery} transparent animationType='fade' >  
                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                   <Image source={require('../assets/blueTick.png')} style={{height:40,width:40}}/>
                    <Text
                    style={{fontSize:18,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                    >Constant Test Recovery Data Sended Succefully....</Text>
                    </View>
                          </Modal>


                          <Modal visible={boreHoleNumNotFound} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         > Borehole Number Not Found</Text>
                         </View>
                               </Modal>

                          <Modal visible={errorForLogDeep} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >LogForDeepWell Data Already Exists On this Borehole Number</Text>
                         </View>
                               </Modal>


                          <Modal visible={errorForStepTest} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >StepTest Data Already Exists On this Borehole Number</Text>
                         </View>
                               </Modal>

                               
                          <Modal visible={errorForStepTestRecovery} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >StepTestRecovery Data Already Exists On this Borehole Number</Text>
                         </View>
                               </Modal>

                               <Modal visible={errorForVesMaster} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >Vesmaster Data Already Exists On this Borehole Number</Text>
                         </View>
                               </Modal>

                               <Modal visible={errorForConstDesTest} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >Constant Discharge Table Data Already Exists On this Borehole Number</Text>
                         </View>
                               </Modal>

                               <Modal visible={errorForConstTestRecovery} transparent animationType='fade' >  
                     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
                        <Image source={require('../assets/ExcelMark.png')} style={{height:40,width:40}}/>
                         <Text
                         style={{fontSize:15,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
                         >Constant Test Recovery Table Data Already Exists On this Borehole Number</Text>
                         </View>
                               </Modal>
            

   <Modal visible={sendingData} transparent animationType='fade' >  
   <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
    <Text></Text>
       <Image source={require('../assets/logo-removebg-preview.png')} style={{
             position: 'absolute',
             top: '46%',
             left: '45%',
             width: 50,
             height: 50,
      }} />
       <ActivityIndicator size="large" color="#fff" style={{}}/>
       <Text></Text>
       <Text
       style={{fontSize:25,color:'#fff',fontFamily:'PoltawskiNowy-VariableFont_wght'}}
       >Sending.....</Text>
       </View>

             </Modal>
                  <Modal visible={loadingForTrFa} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>        
        <View style={{position: 'relative'}}>
        <Image source={require('../assets/logo-removebg-preview.png')} style={{height: 50, width: 50}} />
        <ActivityIndicator size={50} color="#fff" style={{marginTop:-48}}/> 
      </View>
    
            </View>
                  </Modal>


                  <Modal visible={myLoad} transparent animationType='fade' >  
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.6)'}}>        
        <Image source={require('../assets/logo-removebg-preview.png')} style={{
           position: 'absolute',
           top: '47%',
           left: '45%',
           width: 50,
           height: 50,
        }} /> 
        <ActivityIndicator size={90} color="#fff" style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }]}}/>  
            </View>
                  </Modal>


                 

                  <Modal visible={visible} transparent animationType='fade' > 
                  <View style={styles.modalContainer}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={6}
          />
          <TouchableOpacity style={styles.button}
          onPress={()=>
          {
            setVisible(false)
          }}
          >
            <Text style={styles.buttonText}>BACK</Text>
          </TouchableOpacity>
        </View>

                  </Modal>

                 </View>

        
    )
}
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
const styles=StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.8)'
  },
  item: {
    padding: 3,
    width:'14%',
    marginVertical: 8,
    marginHorizontal: 5,
    elevation: 2,
  },
  itemText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4DB6AC',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginBottom: 10,
  },
    headText:{
        fontSize:18,
        fontFamily:'OpenSans-Medium',
        color:'black'
    },
    titles:{
        borderWidth:1,
        borderColor:'grey',
        width:'20%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#b3eff7'
        
    },
    fieldText:{
      fontSize:15,
      fontFamily:'PoltawskiNowy-VariableFont_wght'
    },
    fieldTextForFalse:
    {
      color:'#23e9c5',
      fontSize:15,
      fontWeight:'bold'
    },
    fields:{
      borderWidth:1,
      borderColor:'grey',
      width:'20%',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#effafc',
       
    },
    fieldForFalse:
    {
      width:'20%',
      alignItems:'center',
      justifyContent:'center',
        borderWidth:1,
        borderTopColor:'transparent',
        borderRightColor:'transparent',
        borderLeftColor:'transparent',
        borderBottomColor:'skyblue',
        backgroundColor:'#effafc',
    },
    fieldsHead:{
      borderWidth:1,
      borderColor:'grey',
      width:'50%',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#effafc',
    },
    screensButtons:{
        flex:1,
        marginTop:30,
        alignItems:'center',
    },
    button:{
        alignItems:'center',
        padding:10,
        justifyContent:'center',
        width:'40%'
    },
    text:{
    fontSize:15,
    color:'#e4e9f0',
    fontFamily: 'PoltawskiNowy-VariableFont_wght'
    },
    input:{
        borderWidth:0.6,
        borderRadius:10,
        borderTopEndRadius:10,
        borderTopLeftRadius:10,
        width:'60%',
        
    },
    boreNumText:
    {
        fontSize:20,
        fontFamily:'SpaceMono-Bold',
        color:'#20ddfa'
    },
})


export default DashBoard;