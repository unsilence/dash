import * as service from './../services';

export var addBannerOption = function (banner) {

    banner.effects.fetch = function* ({ payload: { page, rpage,searchWords} }, { call, put }) {
        // 无条件的
        const publish = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "1", "is_online": true, "is_history": false }, page, 5, { "rank": -1, "update_at": 1 });

        //获取已发布的数据

        // 获取资源池数据
          let filter = {};
        if(searchWords && searchWords !== ''){
            filter["title"] ={"$regex":searchWords};
        }
        const resource = yield call(service["fetchRecommendPage"], 'Recommend', Object.assign({ "itype": "1", "is_online": false, "is_history": false },filter), rpage, 5);

        const rd = {
            data: {
                p: { data: publish.data.data.list, total: publish.data.data.count, page: parseInt(page) },
                r: { data: resource.data.data.list, total: resource.data.data.count, page: parseInt(rpage) }
            },
            searchWords:searchWords
        }
        yield put({ type: 'save22', payload: rd });
    }

    banner.effects.add = function* ({ payload: { id, values ,searchWords} }, { call, put, select }) {
        values.itype = '1';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['banners'].list.p.page);
        const rpage = yield select(state => state['banners'].list.r.page);
        yield put({ type: 'fetch', payload: { page, rpage ,searchWords} });
    }
    banner.effects.remove = function* ({ payload: { id ,searchWords} }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['banners'].list.p.page);
        const rpage = yield select(state => state['banners'].list.r.page);
        yield put({ type: 'fetch', payload: { page, rpage ,searchWords} });
    }
    banner.effects.patch = function* ({ payload: { id, values ,searchWords} }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['banners'].list.p.page);
        const rpage = yield select(state => state['banners'].list.r.page);
        yield put({ type: 'fetch', payload: { page, rpage ,searchWords} });
    }


    banner.effects.uptop = function* ({ payload: { record ,searchWords} }, { call, put, select }) {
        const publish = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "1", "is_online": true, "is_history": false, 'rank': { "$gte": record.rank } }, 1, 1);
        if (publish.data.data.list.length > 0) {
            let tempOne = publish.data.data.list[0].rank + 1;

            yield call(service['RecommendService'].update, record._id, { rank: tempOne });
        }
        const page = yield select(state => state['banners'].list.p.page);
        const rpage = yield select(state => state['banners'].list.r.page);
        yield put({ type: 'fetch', payload: { page, rpage,searchWords } });
    }

    banner.effects.upbottom = function* ({ payload: { record ,searchWords} }, { call, put, select }) {
        console.log('upbottom-----', record)
        const publish = yield call(service["fetchRecommendPage"], 'Recommend', { "itype": "1", "is_online": true, "is_history": false, 'rank': { "$lte": record.rank } }, 1, 1);

        console.log(publish, '------------')

        if (publish.data.data.list.length > 0) {
            let tempOne = publish.data.data.list[0].rank - 1;

            yield call(service['RecommendService'].update, record._id, { rank: tempOne });
        }

        const page = yield select(state => state['banners'].list.p.page);
        const rpage = yield select(state => state['banners'].list.r.page);
        yield put({ type: 'fetch', payload: { page, rpage ,searchWords} });
    }
}
