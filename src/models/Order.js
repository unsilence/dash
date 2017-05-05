import * as service from './../services';

export var editOrderOption = function (orders) {

    orders.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的 ProjectInfo
        const orders = yield call(service["fetchOrderPage"], 'Order', {},{page});
        let list = orders.data.data.list;  // 请求回来订单的数组列表

        let skuIds = new Set();
        list.map(v => {v.skuNumList.map(t => {skuIds.add(t.skuNum)})});  // 得到suk列表的id数组
        let pids = list.map(v =>{return v.projectInfoId})  // 一个加载已有订单的项目信息ID 数组
        const infos = yield call(service["getDataService"], 'Projectinfo', {_id:{'$in':pids}});  // 请求回对象订单项目ID 的数组数据
        const skuInOrderList = yield call(service["getDataService"], 'Order', {'skuNumList.skuNum':{'$in':skuIds}});  

        const infoInOrderList = yield call(service["getDataService"], 'Projectinfo',{_id:{'$in':skuInOrderList.data.data.list.map(v => {return v.projectInfoId})}});
        //取出sku相关信息
        //sku对应的spu 的信息
        //获取 属性相关信息 Attribute
        const skuList = yield call(service["getDataService"], 'Sku', {_id:{'$in':skuIds}}); // 根据skuid数组请求回的sku列表数据
        const categoryMap = yield call(service["getCategoryMap"], 'Category');

        const skuProjectList = infoInOrderList.data.data.list;
        const skuPropsList  = skuList.data.data.list;

        let setIds = new Set();
        skuPropsList.forEach(p => {
            setIds.add(p.spuId);
        });
        const _pids = Array.from(setIds);
        const spus = yield call(service['getDataService'], 'Spu', { "_id": { "$in": _pids } })
        let colorIDs = {};
        skuPropsList.forEach(p => {
            spus.data.data.list.forEach(s => {
                if (p.spuId === s._id) {
                    p.spu = s;
                }
            })
        })

        //获取 属性相关信息 Attribute
        let attributeArr = new Set();
        skuPropsList.forEach(p => {
            p.attributes.forEach(v => {
                attributeArr.add(v.attributeID);
            })
        })
        const attributeIDs = Array.from(attributeArr); 
        const skuattributeList = yield call(service['getDataService'], 'Attribute', { "_id": { "$in": attributeIDs } })
        const skuattributeIDs = skuattributeList.data.data.list;

        skuPropsList.forEach(p => {
            p.attributes.forEach(v => {
               skuattributeIDs.forEach(t => {
                if(t.name === "颜色" && v.attributeID === t._id){
                    colorIDs[v.attributeID] = JSON.parse(v.value);
                }
               }) 
            })
        })
        
        const colorMap = yield call(service["getColorMap"], 'Color');
        let tempArr = [];
        skuattributeIDs.forEach(v => {
            if(colorIDs[v._id] !== undefined){
                colorIDs[v._id].forEach(p => {
                    tempArr.push(colorMap[p]);
                })
                v.colors = tempArr;
            }
        })
        console.log(skuattributeIDs);
        console.log(colorMap);
        console.log(colorIDs);
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
        const rd = { data: list, total: orders.data.data.count, page: parseInt(page) , skuProjectList , skuPropsList ,categoryMap ,skuattributeIDs}
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