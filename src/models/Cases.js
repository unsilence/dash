import * as service from './../services';

export var casesOption = function (cases) {

    cases.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的
        const cases = yield call(service["fetchCasePage"], 'Case', {},{page});
        const skus = yield call(service["getSkuMap"], 'Sku');
        let skuList = [];
        for(let sku in skus){
            skuList.push(skus[sku]);
        }
        const rd = { data: cases.data.data.list, total: cases.data.data.count, page: parseInt(page) ,skuList}
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }

    cases.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        let caseMap = yield call(service['getCaseMap'], 'Case');
        values.order = Object.keys(caseMap).length + 1;
        yield call(service['CaseService'].insert, values);
        const page = yield select(state => state['cases'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    cases.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['CaseService'].remove, id);
        const page = yield select(state => state['cases'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    cases.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['CaseService'].update, id, values);
        const page = yield select(state => state['cases'].page);
        yield put({ type: 'fetch', payload: { page } });
    }

    // cases.effects.fetchSkuId = function* ({ payload: { id } }, { call, put }) {
    //     // 无条件的
    //     const cases = yield call(service["getDataService"], 'Sku', {"cnum":id});
    //     const rd = { fetchSku: cases.data.data.list}
    //     console.log(rd);
    //     yield put({ type: 'save22', payload: rd });
    // }
}