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

        const skus = yield call(service['getDataService'], 'Sku', { "spu_num": { "$in": pids } });

        let skuNums = new Set();
        skus.data.data.list.forEach(s => {
            skuNums.add(s._id);
        })

        skuNums = Array.from(skuNums);

        const stocks = yield call(service['getDataService'], 'Stock', { "sku_num": { "$in": skuNums } });

        let numContent = {}
        //会进行状态过滤
        stocks.data.data.list.forEach(v => {
            if (!numContent.hasOwnProperty(v._id)) {
                numContent[v.sku_num] = 0;
            }
            numContent[v.sku_num]++;
        });

        console.log(numContent);

        products.data.data.list.forEach(p => {
            skus.data.data.list.forEach(s => {
                if (s.spu_num === p._id) {
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
            sku.spu_num = spu.data.data.item._id;
            sku.unique_num = pad(index + 1, 2);
        })
        let skusRet = yield call(service['insertSkuData'], 'Sku', skus);
        let stocks = [];

        skusRet.map(sku => { return sku.data.data.item })
            .map((v, index) => { return { name: v.name, sku_num: v._id, tempNum: v.count } })
            .forEach(item => {
                for (let i = 0; i < skus[index].count; i++) {
                    item.unique_num = pad((i + 1), 3);
                    stocks.push(item);
                }
            });

        yield call(service['insertStockData'], 'Stock', stocks);

        //生成skus
        const page = yield select(state => state['spus'].page);
        yield put({ type: 'fetch', payload: { page } });
    }

    spu.effects.remove = function* ({ payload: { id } }, { call, put, select }) {

        const skus = yield call(service['getDataService'], 'Sku', { "spu_num": { "$in": [id] } });
        let skuIds = skus.data.data.list.map(v => { return v._id });
        const stocks = yield call(service['getDataService'], 'Stock', { "sku_num": { "$in": skuIds } });

        let statusStocks = stocks.data.data.list.filter(v => { return v.status !== '' })
        if (statusStocks.length === 0) {
            yield call(service['SpuService'].remove, id);
            const page = yield select(state => state['spus'].page);
            yield put({ type: 'fetch', payload: { page } });
        }
    }

}