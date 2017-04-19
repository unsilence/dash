import * as service from './../services';
import {pad} from './utils';

export var addSkuOption = function (sku) {
    sku.effects.add = function* ({ payload: { product, values, message } }, { call, put, select }) {
        console.log('patch', { product }, values, service)

        // 判断 是更新，还是 新添加 
        let skus = values.skus;

        // 这里还需要一步操作，判断当前value 中是否已经生成过，如果生成过如何处理。
        //todo....
        // 1、获取包含productId的所有SKU ，获取sku 对应的单品 做一下判断

        // 2、判断有当前skus是否包含 values.skus 中的数据

        let existSkus = yield call(service['getDataService'], 'Sku', { "spuId": product._id });

        let list = existSkus.data.data.list;

        //判断状态
        let existIds = list.map(v => { return v._id });
        let existStocks = yield call(service['getDataService'], 'Stock', { 'skuId': { "$in": existIds } });//今后还需要加条件 

        let modifySkus = [];
        let addSkus = [];
        let stocks = [] // 添加到服务器端的数据
        let reduceStock = [];
        skus.forEach(s => {
            let attIdsStr = s.attributes.map(a => { return a.attributeID + a.value }).sort().join('');
            let exist = false;
            list.forEach(l => {
                let lattIdsStr = l.attributes.map(a => { return a.attributeID + a.value }).sort().join('');
                if (attIdsStr === lattIdsStr) {
                    // modifySkus.push(l);
                    //设置其他属性。。。。。
                    Object.keys(s).forEach(k => {
                        if (k !== 'attributes')
                            l[k] = s[k];
                    })
                    modifySkus.push(l);
                    exist = true;
                }
            });
            !exist && addSkus.push(s);
        });

        let modifySkusRet = yield call(service['updateSkuData'], 'Sku', modifySkus);
        modifySkus.length && message.success(`开始更新Sku${modifySkus.length}条`);

        let tempRetData = modifySkusRet.map(msk => { return msk.data.data.item });

        tempRetData.forEach(sku => {
            let tempStocks = existStocks.data.data.list.filter(v => { return v.skuId === sku._id });
            let optionNum = sku.count - tempStocks.length
            if (optionNum > 0)//添加
            {
                //删除 sku.count - tempStocks.length 个数据
                for (let i = 0; i < optionNum; i++) {
                    stocks.push({ name: sku.name, skuId: sku._id, stockNum: pad((i + sku.count), 3) });
                }
            }
            else if (optionNum < 0) {//需要删除
                for (let i = 0; i < Math.abs(optionNum); i++) {
                    reduceStock.push(tempStocks[i]);
                }
            }
        })

        let deleteData = yield call(service['deleteStockData'], 'Stock', reduceStock);
        deleteData.length && message.success(`删除Stock${deleteData.length}条`);

        let filterToData = addSkus.filter(m => { return !Number.isNaN(m.count) && m.count !== 0 && m.count !== '' })
        filterToData.forEach((sku, index) => {
            sku.name = product.name;
            sku.spuId = product._id;
            sku.distinctWords = (sku.distinctWords && sku.distinctWords.indexOf(product._id) !== -1) ? sku.distinctWords : sku.distinctWords + sku.spuId;
            sku.categoryId = product.categoryId;
            sku.skuNum = pad(modifySkus.length + index + 1, 2);
        })
        let skusRet = yield call(service['insertSkuData'], 'Sku', filterToData);

        skusRet.length && message.success(`插入Sku${skusRet.length}条`);

        skusRet.map(sku => { return sku.data.data.item })
            .map(v => { return { name: v.name, skuId: v._id, tempNum: v.count } })
            .forEach(item => {
                for (let i = 0; i < item.tempNum; i++) {
                    let obj = Object.assign({}, item);
                    obj.stockNum = pad((i + 1), 3);
                    stocks.push(obj);
                }
            });

        let retStock = yield call(service['insertStockData'], 'Stock', stocks);
        retStock.length && message.success(`插入Stock${retStock.length}条`);
        //生成skus
        const page = yield select(state => state['spus'].page);
        yield put({ type: 'fetch', payload: { page } });
    }

    sku.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        const categoryMap = yield call(service["getCategoryMap"], 'Category');
        const serialMap = yield call(service["getSerialMap"], 'Serial');
        const colorMap = yield call(service["getColorMap"], 'Color');
        const countryMap = yield call(service["getCountryMap"], 'Country');
        const brandMap = yield call(service["getBrandMap"], 'Brand');
        const attributeMap = yield call(service["getAttributeMap"], 'Attribute');
        const skus = yield call(service["SkuService"].fetch, { page });
        let skuList = skus.data.data.list;
        let setIds = new Set();
        skuList.forEach(p => {
            setIds.add(p.spuId);
        });
        const pids = Array.from(setIds);

        const spus = yield call(service['getDataService'], 'Spu', { "_id": { "$in": pids } })

        skuList.forEach(p => {
            spus.data.data.list.forEach(s => {
                if (p.spuId === s._id) {
                    p.spu = s;
                }
            })
        })

        const rd = {
            data: skuList,
            total: skus.data.data.count,
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
}