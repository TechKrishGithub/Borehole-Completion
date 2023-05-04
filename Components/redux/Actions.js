const SET_USER_NAME='SET_USER_NAME';
const SET_PASSWORD='SET_PASSWORD';

const setUser=username=>dispatch=>{
    dispatch({
        type:SET_USER_NAME,
        payload:username,
    });
};

const setPassword=password=>dispatch=>{
    dispatch({
        type:SET_PASSWORD,
        payload:password,
    });
};