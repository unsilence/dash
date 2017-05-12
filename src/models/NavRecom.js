import * as service from './../services';

export var navRecomOption = function (nav) {

    nav.effects.fetch = function* ({ payload: { page,id } }, { call, put }) {
        const navCategory = yield call(service["getSystemMap"],"System");
        let navList = [];
        let isHasId = {};
        Object.values(navCategory).forEach(v => {
            if(v.key == "nav"){
                navList = JSON.parse(v.value);
                isHasId["isHasId"] = v._id;
            }
        });
        let id_;
        if(navList.length > 0){
            id ? id_ = id : id_ = navList[0].categoryId;
        }
        isHasId["inInfo"] = id_;
        id_ ? id_ : id_ = 1;
        console.log(id_);
        const categoryMap = yield call(service["getCategoryMap"], 'Category');  // 获取类型的数据
        // 无条件的
        const navmanages = yield call(service["fetchNavPage"], 'Recommend', { "itype": "5" ,"category_num" : id_ },{page});
        const rd = { data: navmanages.data.data.list, total: navmanages.data.data.count, page: parseInt(page) ,categoryMap : categoryMap ,isHasId,navList}
        yield put({ type: 'save22', payload: rd });
    }

    nav.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        values.itype = '5';
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