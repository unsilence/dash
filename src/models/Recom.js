import * as service from './../services';

export var recommendOption = function (recom) {

    recom.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的
        const recoms = yield call(service["fetchRecomPage"], 'Recommend', {"rtype": "2" },{page});
        const rd = { data: recoms.data.data.list, total: recoms.data.data.count, page: parseInt(page) }
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }

    recom.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.rtype = '2';
        let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    recom.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    recom.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['recoms'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}