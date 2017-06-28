import * as service from './../services';

export var addBannerOption = function (banner) {

    banner.effects.fetch = function* ({ payload: { page, historyPage } }, { call, put }) {
        // 无条件的
        const publish = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "1" ,"is_online": true, "is_history": false}, { page});

        //获取已发布的数据

        // 获取资源池数据
        const resource = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "1" ,"is_online": false, "is_history": false }, { page: historyPage});

        const rd = {
            data: {
                p: { data: publish.data.data.list, total: publish.data.data.count, page: parseInt(page) },
                r: { data: resource.data.data.list, total: resource.data.data.count, page: parseInt(historyPage) }
            }
        }
        yield put({ type: 'save22', payload: rd });
    }

    banner.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '1';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['banners'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    banner.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['banners'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    banner.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['banners'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}