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
['Category', 'Customer', 'Order', 'Country','Brand', 'Color', 'User', 'Serial','Case','Attribute'].map(cls => {
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
})
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
