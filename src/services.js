function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
async function request(url, dt) {
    console.log("POST", url, dt)
    const response = await fetch(url, { method: "POST", body: JSON.stringify(dt) });
    checkStatus(response);
    const data = await response.json();
    const ret = { data };
    console.log(url, "RETRUN:", data)
    return ret;
}
['Category', 'Customer', 'Order', 'Country', 'Brand', 'Color', 'User', 'Serial', 'Case', 'Attribute', 'Spu', 'Sku', 'Stock', 'Test'].map(cls => {
    exports[cls + 'Service'] = {
        fetch({ page = 1 }) {
            return request(`/api/${cls}/fetch?token=${localStorage.token}`, { orderBy: { cnum: -1 }, limit: 10, startPos: 10 * (page - 1) });
        },
        update(id, item) {
            return request(`/api/${cls}/updateById?token=${localStorage.token}`, { id, item });
        },
        insert(item) {
            return request(`/api/${cls}/addItem?token=${localStorage.token}`, { item });
        },
        remove(id) {
            return request(`/api/${cls}/deleteById?token=${localStorage.token}`, { id });
        }
    }
});

/**根据spuid 获得skus */
exports['getSkuBySpuIdService'] = async (opt)=> {
    return request(`/api/Sku/fetch?token=${localStorage.token}`, opt);
}

/**根据id 获取spu */
exports['getSpuByIdService'] = async (opt)=> {
    return request(`/api/Spu/fetch?token=${localStorage.token}`, opt);
}

exports['checkAccount'] = async () => {
    console.log('check', localStorage)
    var rt = await request(`/api/auth/account?token=${localStorage.token}`, {})
    return rt
}
exports['login'] = async () => {
    console.log('login')
    var rt = await request(`/api/auth/login?token=${localStorage.token}`, { name: '123', password: '456' })
    localStorage.token = rt.data.data.token
    localStorage.user = JSON.stringify(rt.data.data.item)
    return rt
}
exports['logout'] = async () => {
    localStorage.clear()
    return;
}
// 这里在接口层面可以加本地存储
function getMapByList(list) {
    let tempMap = {}
    list.map(item => {
        tempMap[item._id.toString()] = item;
    })
    return tempMap
}

['Color', 'Country', 'Brand', 'Serial', 'Category', 'Attribute'].map(v => {
    exports[`get${v}Map`] = async function (v) {
        let result = await request(`/api/${v}/fetch?token=${localStorage.token}`, { orderBy: { cnum: -1 }, limit: 100000, startPos: 0 })
        let list = result.data.data.list
        let map = getMapByList(list)
        window.sessionStorage.brandMap = JSON.stringify(map)
        return map;
    }
});


['Spu', 'Sku', 'Stock'].map(v => {
    exports[`insert${v}Data`] = async function (v, datas) {
        if (Array.isArray(datas)) {
            let data = []
            for (let item of datas) {
                let resPos = await request(`/api/${v}/addItem?token=${localStorage.token}`, { item })
                data.push(resPos);
            }
            return data;
        }
        else {
            let item = datas;
            return await request(`/api/${v}/addItem?token=${localStorage.token}`, { item });
        }
    }
});
