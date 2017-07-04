import * as service from './../services';

export var addHistoryBannerOption = function (historyBanner) {

    historyBanner.effects.fetch = function* ({ payload: { page ,searchWords} }, { call, put }) {

           let filter = {};
        if(searchWords && searchWords !== ''){
            filter["title"] ={"$regex":searchWords};
        }
        // 无条件的
        const recoms = yield call(service["fetchRecommendPage"], 'Recommend', Object.assign({ "itype": "1", "is_online": false, "is_history": true },filter), page, 10);
        const rd = { data: recoms.data.data.list, total: recoms.data.data.count, page: parseInt(page) ,searchWords:searchWords}
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }

    historyBanner.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '2';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['.historybanners'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    historyBanner.effects.remove = function* ({ payload: { id ,searchWords} }, { call, put, select }) {
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['historybanners'].page);
        yield put({ type: 'fetch', payload: { page,searchWords} });
    }
    historyBanner.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['historybanners'].page);
        yield put({ type: 'fetch', payload: { page } });
    }

}