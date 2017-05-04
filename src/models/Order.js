import * as service from './../services';

export var editOrderOption = function (orders) {

    orders.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的 ProjectInfo
        const orders = yield call(service["fetchOrderPage"], 'Order', {},{page});
        let list = orders.data.data.list;  // 请求回来
        let pids = list.map(v =>{return v.projectInfoId})  // 一个加载已有订单的项目信息ID 数组
        const infos = yield call(service["getDataService"], 'Projectinfo', {_id:{'$in':pids}});  // 请求回对象订单项目ID 的数组数据
        const infoList = [];
        let  infoMap = {};
        infos.data.data.list.forEach(v => {infoMap[v._id] = v});
        console.log(infoMap);
        list.forEach(v => {v.schedule = infoMap[v.projectInfoId].schedule;
                            v.address = infoMap[v.projectInfoId].address;
                            v.designerName = infoMap[v.projectInfoId].designerName;
                            v.area = infoMap[v.projectInfoId].area;
                            v.days = infoMap[v.projectInfoId].days;
                            v.designerDepartment = infoMap[v.projectInfoId].designerDepartment;
                            v.designerPhone = infoMap[v.projectInfoId].designerPhone;
                            v.name = infoMap[v.projectInfoId].name;
                            v.userId = infoMap[v.projectInfoId].userId;
                            v.doorTime = infoMap[v.projectInfoId].doorTime;
                            });
        // console.log(ProjectInfoData);
        const rd = { data: list, total: orders.data.data.count, page: parseInt(page)}
        yield put({ type: 'save22', payload: rd });
    }

    orders.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        // values.rtype = '1';
        let recommendRes = yield call(service['getOrderMap'], 'Order');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['OrderService'].insert, values);
        const page = yield select(state => state['orders'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    // orders.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
    //     console.log('remove', { id })
    //     yield call(service['RecommendService'].remove, id);
    //     const page = yield select(state => state['banners'].page);
    //     yield put({ type: 'fetch', payload: { page } });
    // }
    orders.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['OrderService'].update, id, values);
        const page = yield select(state => state['Order'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    orders.effects.addPerject = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log(values);
        yield call(service['ProjectinfoService'].insert, values);
        const page = yield select(state => state['orders'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}