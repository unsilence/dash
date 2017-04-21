import * as service from './../services';

export var navRecomOption = function (nav) {

    nav.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        
        // const existNav = yield call(service['fetchNavManagePage'].fetch,{})
        // const allCategory = yield call(service['CategoryService'].fetch)

        // 无条件的
        const navmanages = yield call(service["fetchNavPage"], 'Nav', { "rtype": "5" },{page});
        const rd = { data: navmanages.data.data.list, total: navmanages.data.data.count, page: parseInt(page) }
        yield put({ type: 'save22', payload: rd });
    }

    nav.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.rtype = '5';
        let navmanages = yield call(service['getNavMap'], 'Nav',);
        values.order = Object.keys(navmanages).length + 1;
        yield call(service['NavService'].insert, values);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    nav.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['NavService'].remove, id);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    nav.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['NavService'].update, id, values);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}