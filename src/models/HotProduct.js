import * as service from './../services';

export var hotProductsOption = function (hotProduct) {

    hotProduct.effects.fetch = function* ({ payload: { id,page } }, { call, put }) {
        // 无条件的
        const hotCategory = yield call(service["getSystemMap"],"System")
        let hotList = {};
        let ids;
        Object.values(hotCategory).forEach(v => {
            if(v.key == "hot"){
                hotList[v._id] = JSON.parse(v.value);
                ids = JSON.parse(v.value);
            }
        })
        console.log(hotList);
        let _id ;
        id ? _id = id : _id = ids[0];
        console.log(_id);
        const hotproducts = yield call(service["fetchHotProductPage"], 'Recommend', { itype: '4' , category_num : _id},{page});
        const categoryMap = yield call(service["getCategoryMap"],"Category");
        console.log(categoryMap);
        console.log(hotproducts);
        console.log(hotCategory);
        const rd = { data: hotproducts.data.data.list, total: hotproducts.data.data.count, page: parseInt(page) ,categoryMap , hotList}
        yield put({ type: 'save22', payload: rd });
    }

    hotProduct.effects.add = function* ({ payload: { id, values , categoryId } }, { call, put, select }) {
        values.itype = '4';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: {  id : categoryId ,page } });
    }
    hotProduct.effects.remove = function* ({ payload: { id ,categoryId} }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page , id : categoryId} });
    }
    hotProduct.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    hotProduct.effects.addCategory = function* ({ payload: { id, values } }, { call, put, select }) {
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        // yield call(service['RecommendService'].insert, values);
        yield call(service['SystemService'].insert, values);
        const page = 1;
        yield put({ type: 'fetch', payload: { page } });
    }
    hotProduct.effects.hotpatch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['SystemService'].update, id, values);
        const page = 1;
        yield put({ type: 'fetch', payload: { page } });
    }
}