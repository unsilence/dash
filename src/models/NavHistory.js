import * as service from './../services';

export var navproductsHistoryOption = function (nav) {

    nav.effects.fetch = function* ({ payload: {id,page} }, { call, put }) {
        // 已发布的数据
        const navmanages = yield call(service["fetchNavPage"], 'Recommend', { "itype": "5"  , "is_online":false ,"is_history":true},page,10);
        // 资源池中的数据
        const rd = {
            data : navmanages.data.data.list , total : navmanages.data.data.count , page: parseInt(page)
        }
        yield put({ type: 'save22', payload: rd });
    }

    nav.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}
