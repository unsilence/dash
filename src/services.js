function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
async function request(url, dt) {
    // console.log("POST", url, dt)
    const response = await fetch(url, { method: "POST", body: JSON.stringify(dt) });
    checkStatus(response);
    const data = await response.json();
    const ret = { data };
    // console.log(url, "RETRUN:", data)
    return ret;
}
['Address', 'Order', 'Nav', 'Recommend', 'Category', 'Customer',
'Order', 'Country', 'Brand', 'Color', 'User', 'Serial', 'Case',
'Attribute', 'Spu', 'Sku', 'Stock', 'Test', 'System', "Recoms/Historyrecom","Casemanages/Historyrecoms"].map(cls => {
    exports[cls + 'Service'] = {
        fetch({ page = 1, limit = 10, filter = {} }) {
            return request(`/api/${cls}/fetch?token=${localStorage.token}`, { orderBy: { cnum: -1 }, limit: limit, startPos: limit * (page - 1), filter });
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
exports['getDataService'] = async (v, opt) => {
    return request(`/api/${v}/fetch?token=${localStorage.token}`, { filter: opt });
}


exports['checkAccount'] = async () => {
    console.log('check', localStorage)
    var rt = await request(`/api/auth/account_dash?token=${localStorage.token}`, {})
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

['Color', 'Country', 'Brand', 'Serial', 'Category', 'Attribute', 'Recommend', 'Nav', 'Order', 'Case', 'System', "Sku"].map(v => {
    exports[`get${v}Map`] = async function (v) {
        let result = await request(`/api/${v}/fetch?token=${localStorage.token}`, { orderBy: { cnum: -1 }, limit: 10000000, startPos: 0 })
        let list = result.data.data.list
        let map = getMapByList(list)
        window.sessionStorage.brandMap = JSON.stringify(map)
        return map;
    }
});

// 这里在接口层面可以加本地存储
function getMapByListCnum(list) {
    let tempMap = {}
    list.map(item => {
        tempMap[item.cnum.toString()] = item;
    })
    return tempMap
}

['Color', 'Country', 'Brand', 'Serial', 'Category', 'Attribute', 'Recommend', 'Nav', 'Order', 'Case', 'System', "Sku"].map(v => {
    exports[`get${v}MapCnum`] = async function (v) {
        let result = await request(`/api/${v}/fetch?token=${localStorage.token}`, { orderBy: { cnum: -1 }, limit: 10000000, startPos: 0 })
        let list = result.data.data.list
        let map = getMapByListCnum(list)
        window.sessionStorage.brandMap = JSON.stringify(map)
        return map;
    }
});




//带分页 有条件查询
['Recommend', 'Banner', 'CaseManage', 'HotProduct', 'Nav', 'Order', 'Projectinfo', 'Case', 'System'].map(v => {
    exports[`fetch${v}Page`] = async function (v, filter, page, limit = 10, orderBy = { cnum: -1 }) {
        return await request(`/api/${v}/fetch?token=${localStorage.token}`, { filter: filter, page, limit, startPos: limit * (page - 1), orderBy});
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
            return [await request(`/api/${v}/addItem?token=${localStorage.token}`, { item })];
        }
    }
});

['Sku', 'Stock'].map(v => {
    exports[`update${v}Data`] = async function (v, datas) {
        if (Array.isArray(datas)) {
            let data = []
            for (let item of datas) {
                let id = item._id;
                let resPos = await request(`/api/${v}/updateById?token=${localStorage.token}`, { id, item });
                data.push(resPos);
            }
            return data;
        }
        else {
            let item = datas;
            let id = item._id;
            return [await request(`/api/${v}/updateById?token=${localStorage.token}`, { id, item })];
        }
    }
});

['Sku', 'Stock'].map(v => {
    exports[`delete${v}Data`] = async function (v, datas) {
        if (Array.isArray(datas)) {
            let data = []
            for (let item of datas) {
                let id = item._id;
                let resPos = await request(`/api/${v}/deleteById?token=${localStorage.token}`, { id });
                data.push(resPos);
            }
            return data;
        }
        else {
            let item = datas;
            let id = item._id;
            return [await request(`/api/${v}/deleteById?token=${localStorage.token}`, { id })];
        }
    }
});
