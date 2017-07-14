import * as service from './../services';

export var hotproductsHistoryOption = function (hotHis) {

    hotHis.effects.fetch = function* ({ payload: { page ,rpage,searchWords} }, { call, put }) {
        // 获取历史推荐 的数据
        const historyMap = yield call(service["fetchRecommendPage"], 'Recommend', {"itype": "4","is_online": false, "is_history": true  },page,10);
        const rd = { data:{historyList:historyMap.data.data.list} ,
                     total: {historyCount:historyMap.data.data.count},
                     page: parseInt(page) }
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }
    hotHis.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}
