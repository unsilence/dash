import * as service from './../services';
import { pad } from './utils';

export var addSpuOption = function (spu) {

    spu.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        const categoryMap = yield call(service["getCategoryMap"], 'Category');
        const serialMap = yield call(service["getSerialMap"], 'Serial');
        const colorMap = yield call(service["getColorMap"], 'Color');
        const countryMap = yield call(service["getCountryMap"], 'Country');
        const brandMap = yield call(service["getBrandMap"], 'Brand');
        const attributeMap = yield call(service["getAttributeMap"], 'Attribute');
        const products = yield call(service["SpuService"].fetch, { page });

        const pids = products.data.data.list.map(p => {
            return p._id;
        });

        const skus = yield call(service['getDataService'], 'Sku', { "spuId": { "$in": pids } })

        products.data.data.list.forEach(p => {
            skus.data.data.list.forEach(s => {
                if (s.spuId === p._id) {
                    p.doneSkus ? p.doneSkus.push(s) : p.doneSkus = [s];
                }
            })
        })

        const rd = {
            data: products.data.data.list,
            total: products.data.data.count,
            page: parseInt(page),
            categoryMap: categoryMap,
            serialMap: serialMap,
            colorMap: colorMap,
            countryMap: countryMap,
            brandMap: brandMap,
            attributeMap: attributeMap,
        }
        yield put({ type: 'save22', payload: rd });
    }

    spu.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id }, values, service)
        let spu = yield call(service['insertSpuData'], 'Spu', values);
        let skus = values.skus;

        skus.forEach((sku, index) => {
            sku.name = spu.data.data.item.name;
            sku.spuId = spu.data.data.item._id;
            sku.skuNum = pad(index + 1, 2);
        })
        let skusRet = yield call(service['insertSkuData'], 'Sku', skus);
        let stocks = [];

        skusRet.map(sku => { return sku.data.data.item })
            .map(v => { return { name: v.name, skuId: v._id, tempNum: v.count } })
            .forEach(item => {
                for (let i = 0; i < item.tempNum; i++) {
                    item.stockNum = pad((i + 1), 3);
                    stocks.push(item);
                }
            });

        yield call(service['insertStockData'], 'Stock', stocks);

        //生成skus
        const page = yield select(state => state['spus'].page);
        yield put({ type: 'fetch', payload: { page } });
    }

}