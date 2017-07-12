import * as service from './../services';

export var recommendHistoryOption = function (recomHis) {

    recomHis.effects.fetch = function* ({ payload: { page ,rpage,searchWords} }, { call, put }) {
        // 获取历史推荐 的数据
        const historyMap = yield call(service["fetchRecommendPage"], 'Recommend', {"itype": "2","is_online": false, "is_history": true  },page,10,{ "rank": -1, "update_at": 1 });
        const rd = { data:{historyList:historyMap.data.data.list} ,
                     total: {historyCount:historyMap.data.data.count},
                     page: parseInt(page) }
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }

    recomHis.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '2';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    recomHis.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    recomHis.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}
