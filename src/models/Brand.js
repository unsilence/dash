import * as service from './../services';

export var brandOption = function (recom) {

    recom.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的
        const brands = yield call(service["BrandService"].fetch, { page });
        const countryMap = yield call(service["getCountryMap"], 'Country');
        const categoryMap = yield call(service["getCategoryMap"], 'Category');
        const rd = { data: brands.data.data.list, total: brands.data.data.count, countryMap:countryMap,categoryMap: categoryMap ,page: parseInt(page) }
        yield put({ type: 'save22', payload: rd });
    }
}