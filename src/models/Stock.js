import * as service from './../services';

export var stockOption = function (stock) {

    stock.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的
        const stocks = yield call(service["StockService"].fetch, { page });
        
        let skuIds = stocks.data.data.list.map(v => { return v.sku_num});
        const skus = yield call(service['getDataService'], 'Sku', { "_id": { "$in": skuIds } });
        let skusMap = {};
        skus.data.data.list.forEach(v => { skusMap[v._id] = v});

        
        let spuIds = skus.data.data.list.map(v => { return v.spu_num});
        let spusMap = {};
        const spus = yield call(service['getDataService'], 'Spu', { "_id": { "$in": spuIds } });
        spus.data.data.list.forEach(v => { spusMap[v._id] = v});

        const countryMap = yield call(service["getCountryMap"], 'Country');
        const categoryMap = yield call(service["getCategoryMap"], 'Category');
        const rd = { data: stocks.data.data.list, total: stocks.data.data.count, skusMap,spusMap, countryMap:countryMap,categoryMap: categoryMap ,page: parseInt(page) }
        yield put({ type: 'save22', payload: rd });
    }
}