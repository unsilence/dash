import * as service from './../services';

export var hotProductsOption = function (hotProduct) {

    hotProduct.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的
        const hotproducts = yield call(service["fetchHotProductPage"], 'Recommend', { page, itype: '4' });
        const categorys = yield call(service["getCategoryMap"],"Category");
        console.log(categorys);
        const categoryMap = {};
        Object.values(categorys).forEach(v => {
            if(!v.father_num){
                categoryMap[v._id] = []; 
            }else{
                if(categoryMap[v.father_num] !== undefined){
                    categoryMap[v.father_num].push(v._id)
                }else{
                    categoryMap[v.father_num] = [];
                    categoryMap[v.father_num].push(v._id)
                }
            }
        })
        console.log(categoryMap);
        const rd = { data: hotproducts.data.data.list, total: hotproducts.data.data.count, page: parseInt(page) , categoryMap }
        yield put({ type: 'save22', payload: rd });
    }

    hotProduct.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '4';
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['RecommendService'].insert, values);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    hotProduct.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    hotProduct.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}