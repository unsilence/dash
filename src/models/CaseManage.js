import * as service from './../services';

export var caseManageOption = function (banner) {

    banner.effects.fetch = function* ({ payload: { page,rpage,searchWords } }, { call, put }) {
        // 已发布的数据请求
        const publish = yield call(service["fetchCaseManagePage"], 'Recommend', {"itype": "3" ,"is_history":false,"is_online":true},page,5,{ "rank": -1, "update_at": 1 });

        // 资源池数据请求
        let filter = {};
        if(searchWords && searchWords !== ''){
            filter["title"] ={"$regex":searchWords};
        }
        const resource = yield call(service["fetchCaseManagePage"], 'Recommend', Object.assign({},{"itype": "3" ,"is_history":false,"is_online":false},filter),rpage,5);
        const rd = {
            data: {
                p: { data: publish.data.data.list, total: publish.data.data.count, page: parseInt(page) },
                r: { data: resource.data.data.list, total: resource.data.data.count, page: parseInt(rpage) }
            },
            searchWords:searchWords
        }
        yield put({ type: 'save22', payload: rd });
    }

    banner.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '3';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    banner.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    banner.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}
