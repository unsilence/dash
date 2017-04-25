import * as service from './../services';

export var navRecomOption = function (nav) {

    nav.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        const categoryMap = yield call(service["getCategoryMap"], 'Category');  // 获取类型的数据
        const navMap = yield call(service["NavService"].fetch, {page});
        // 无条件的
        const navmanages = yield call(service["fetchNavPage"], 'Recommend', { "rtype": "5" },{page});
        const rd = { data: navmanages.data.data.list, total: navmanages.data.data.count, page: parseInt(page) ,categoryMap : categoryMap ,navMap : navMap}
        yield put({ type: 'save22', payload: rd });
    }

    nav.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.rtype = '5';
        let navmanages = yield call(service['getRecommendMap'], 'Recommend',);
        values.order = Object.keys(navmanages).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    nav.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    nav.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    nav.effects.addNav = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id ,values})
        // let navmanages = yield call(service['getNavMap'], 'Recommend',);
        // values.order = Object.keys(navmanages).length + 1;
        yield call(service['NavService'].insert, values);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } })
    }
}