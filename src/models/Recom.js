import * as service from './../services';

export var recommendOption = function (recom) {

    recom.effects.fetch = function* ({ payload: { page ,rpage,searchWords} }, { call, put }) {
        // 无条件的
        const recoms = yield call(service["fetchRecommendPage"], 'Recommend', {"itype": "2","is_online": true, "is_history": false  },page,5,{ "rank": -1, "update_at": 1 });
        // 获取非历史  资源池里的数据
        const resource = yield call(service["fetchRecommendPage"], 'Recommend', {"itype": "2","is_online": false, "is_history": false  },rpage,5,{ "rank": -1, "update_at": 1 });
        const rd = { data:{updata:recoms.data.data.list, resourcesData:resource.data.data.list,page:parseInt(page),rpage:parseInt(rpage)} ,
                     total: {updata:recoms.data.data.count,resourcesData:resource.data.data.count},
                   }
        console.log(rd);
        yield put({ type: 'save22', payload: rd });
    }

    recom.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '2';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
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

    recom.effects.uptop = function* ({ payload: { record ,searchWords} }, { call, put, select }) {
        const publish = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "2", "is_online": true, "is_history": false, 'rank': { "$gte": record.rank } }, 1, 1);
        if (publish.data.data.list.length > 0) {
            let tempOne = publish.data.data.list[0].rank + 1;

            yield call(service['RecommendService'].update, record._id, { rank: tempOne });
        }
        const page = yield select(state => state['recoms'].list.page);
        const rpage = yield select(state => state['recoms'].list.rpage);
        yield put({ type: 'fetch', payload: { page, rpage,searchWords } });
    }

    recom.effects.upbottom = function* ({ payload: { record ,searchWords} }, { call, put, select }) {
        console.log('upbottom-----', record)
        const publish = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "2", "is_online": true, "is_history": false, 'rank': { "$lte": record.rank } }, 1, 1);

        console.log(publish, '------------')

        if (publish.data.data.list.length > 0) {
            let tempOne = publish.data.data.list[0].rank - 1;

            yield call(service['RecommendService'].update, record._id, { rank: tempOne });
        }

        const page = yield select(state => state['recoms'].list.page);
        const rpage = yield select(state => state['recoms'].list.rpage);
        yield put({ type: 'fetch', payload: { page, rpage ,searchWords} });
    }
}
