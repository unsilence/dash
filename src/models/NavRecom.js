import * as service from './../services';

export var navRecomOption = function (nav) {

    nav.effects.fetch = function* ({ payload: {id,page, rpage,searchWords} }, { call, put }) {
        // 请求导航栏分类的数据
        const navCategory = yield call(service["getSystemMap"],"System");
        let navList = [];  // 导航栏数据数组
        let isHasId = {};
        Object.values(navCategory).forEach(v => {
            if(v.key === "nav"){
                navList = JSON.parse(v.value);
                isHasId["isHasId"] = v._id;
            }
        });
        let categoryId;
        if(navList.length > 0){
            id ? categoryId = id : categoryId = navList[0].categoryId;
        }
        isHasId["inInfo"] = categoryId;
        // id_ ? id_ : id_ = 1;
        // console.log(id_);
        const categoryMap = yield call(service["getCategoryMap"], 'Category');  // 获取类型的数据
        // 已发布的数据
        const navmanages = yield call(service["fetchNavPage"], 'Recommend', { "itype": "5" ,"category_num" : categoryId , "is_online":true ,"is_history":false},page,10);

        let filter = {};
        if(searchWords && searchWords !== ''){
            filter["title"] ={"$regex":searchWords};
        }
        // 资源池中的数据
        const resource = yield call(service["fetchNavPage"], 'Recommend',Object.assign({},{ "itype": "5" ,"category_num" : categoryId , "is_online":false,"is_history":false },filter) ,page,10);
        const rd = {
            data: {
                p: { data: navmanages.data.data.list, total: navmanages.data.data.count, page: parseInt(page) },
                r: { data: resource.data.data.list, total: resource.data.data.count, page: parseInt(rpage) }
            },
            searchWords:searchWords,
            categoryMap,
            navList,
            isHasId
        }
        yield put({ type: 'save22', payload: rd });
    }

    nav.effects.add = function* ({ payload: { id, values ,page ,rpage,searchWords,categoryId } }, { call, put, select }) {
        values.itype = '5';
        yield call(service['RecommendService'].insert, values);
        yield put({ type: 'fetch', payload: { id : categoryId, page ,rpage } });
    }
    nav.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service['RecommendService'].remove, id);
        const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    nav.effects.patch = function* ({ payload: { id, values ,page ,rpage,searchWords,categoryId} }, { call, put, select }) {
        yield call(service['RecommendService'].update, id, values);
        // const page = yield select(state => state['navmanages'].page);
        yield put({ type: 'fetch', payload: {id : categoryId, page ,rpage,searchWords} });
    }
    nav.effects.addNav = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log("添加NAV ============================================"+values)
        // let navmanages = yield call(service['getNavMap'], 'Recommend',);
        // values.order = Object.keys(navmanages).length + 1;
        yield call(service['SystemService'].insert, values);
        const page = 1;
        yield put({ type: 'fetch', payload: { page } })
    }
    nav.effects.patchNav = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['SystemService'].update, id, values);
        const page = 1;
        yield put({ type: 'fetch', payload: { page } });
    }
}
