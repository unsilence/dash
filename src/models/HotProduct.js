import * as service from './../services';

export var hotProductsOption = function (hotProduct) {

    hotProduct.effects.fetch = function* ({ payload: { id,page, rpage,searchWords } }, { call, put }) {
        const hotCategory = yield call(service["getSystemMap"],"System")
        let hotList = {};
        let ids;
        Object.values(hotCategory).forEach(v => {
            if(v.key === "hot"){
                hotList[v._id] = JSON.parse(v.value);
                ids = JSON.parse(v.value);
            }
        })
        const categoryMap = yield call(service["getCategoryMap"],"Category");
        let _id ;
        id ? _id = id : _id = (ids&&ids.length > 0 ? ids[0] : null);
        // 已发布数据请求的过滤对象
        let filter = { itype: '4',"is_online" : true , "is_history" : false};
        if(_id){
            filter['category_num'] = _id;
        }
        // 资源池数据请求的过滤对象
        let historyFilter = {"itype" : "4" , "is_online" : false , "is_history" : false };
        if(_id){
          historyFilter['category_num'] = _id;
        }
        // 获取 已上线的热品推荐数据请求
        const hotproducts = yield call(service["fetchHotProductPage"], 'Recommend', filter,page,5);
        let historyFilterSearchWord = {};
        if(searchWords && searchWords !== ''){
            historyFilterSearchWord["title"] ={"$regex":searchWords};
        }
        // 获取资源池中的 热品推荐数据请求
        const resource = yield call(service["fetchHotProductPage"], 'Recommend', Object.assign({},historyFilter,historyFilterSearchWord) ,rpage,5);

        const rd = {
            data: {
                p: { data: hotproducts.data.data.list, total: hotproducts.data.data.count, page: parseInt(page) },
                r: { data: resource.data.data.list, total: resource.data.data.count, page: parseInt(rpage) }
            },
            searchWords:searchWords,
            categoryMap,
            hotList
        }
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
    hotProduct.effects.patch = function* ({ payload: { id, values,categoryId,ppage,rpage,searchWords } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['RecommendService'].update, id, values);
        // const page = yield select(state => state['recommends'].page);
        yield put({ type: 'fetch', payload: { id : categoryId,page : ppage , rpage, searchWords} });
    }
    hotProduct.effects.addCategory = function* ({ payload: { id, values,ppage,rpage,searchWords,categoryId} }, { call, put, select }) {
        // let recommendRes = yield call(service['getRecommendMap'], 'Recommend');
        // values.order = Object.keys(recommendRes).length + 1;
        // yield call(service['RecommendService'].insert, values);
        yield call(service['SystemService'].insert, values);
        const page = 1;
        yield put({ type: 'fetch', payload: {id:categoryId, page: ppage,rpage,searchWords } });
    }
    hotProduct.effects.hotpatch = function* ({ payload: { id, values,ppage,rpage,searchWords,categoryId } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['SystemService'].update, id, values);
        const page = 1;
        yield put({ type: 'fetch', payload: { id:categoryId,page: ppage,rpage,searchWords} });
    }
}
