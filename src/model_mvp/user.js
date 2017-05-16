import api from './_api'

export var sendCode = async (values)=>{
    let {phone} = values
    console.log("models/user sendCode",{phone})
    let tokenRes = await api(`/api/auth/get_token`,{})
    localStorage.token = tokenRes.token
    let codeRes =  await api(`/api/auth/get_code?token=${localStorage.token}`,{phone})
    return codeRes
}
export var login = async (values)=>{
    let {phone,code,password} = values
    console.log("models/user login",{phone,code})
    var userRes = await api(`/api/auth/login_dash?token=${localStorage.token}`,{phone,code,password})
    localStorage.user = JSON.stringify(userRes.data.item)
    return userRes
}
export var logout = async ()=>{
    console.log("models/user logout")
    var userRes = await api(`/api/auth/logout?token=${localStorage.token}`,{})
    localStorage.clear()
    return userRes
}
export var check = async ()=>{
    console.log("models/user check")
    var userRes = await api(`/api/auth/account?token=${localStorage.token}`,{})
    if(userRes.status == 'success'){
        localStorage.user = JSON.stringify(userRes.data.item)
    }else{
        localStorage.clear()
    }
}

export var updateById = async (_id,options)=>{
    var userRes = await api(`/api/User/updateById?token=${localStorage.token}`,{id:_id,item:options})
    localStorage.user = JSON.stringify(userRes.data.item)
    return userRes
}


export var fetch = async  ({filter={},orderBy='createAt',limit=50,startPos=0})=>{
    var _Res = await api(`/api/User/fetch?token=${localStorage.token}`,{filter,orderBy,limit,startPos})
    return _Res
}
