import * as service from './../services';

export var recommendHistoryOption = function (user) {

    user.effects.fetch = function* ({ payload: {id} }, { call, put }) {
        // 获取历史推荐 的数据
        const historyMap = yield call(service["UserService"], {filter : {"cnum":user.cnum}});
        const rd = { data:{historyList:historyMap.data.data.list} ,
                     total: {historyCount:historyMap.data.data.count},
                     page: parseInt(page) }
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }

    user.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '2';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    user.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    user.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}
