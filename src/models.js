import * as service from './services';

let generate = (name, serviceName) => {
  console.log(name, serviceName, '-----------------generate')
  return {
    namespace: name,
    state: {
      list: [],
      total: null,
    },
    reducers: {
      save22(state, { payload: { data: list, total, page, serialMap, categoryMap, colorMap, countryMap, brandMap, attributeMap } }) {
        page = page || 1
        return { ...state, list, total, page, serialMap, categoryMap, colorMap, countryMap, brandMap, attributeMap };
      },
    },
    effects: {
      *fetch({ payload: { page } }, { call, put }) {
        const d = yield call(service[serviceName].fetch, { page });
        const rd = { data: d.data.data.list, total: d.data.data.count, page: parseInt(page) }
        yield put({ type: 'save22', payload: rd });
      },
      *remove({ payload: { id } }, { call, put, select }) {
        console.log('remove', { id })
        yield call(service[serviceName].remove, id);
        const page = yield select(state => state[name].page);
        yield put({ type: 'fetch', payload: { page } });
      },
      *patch({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service[serviceName].update, id, values);
        const page = yield select(state => state[name].page);
        yield put({ type: 'fetch', payload: { page } });
      },
      *add({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service[serviceName].insert, values);
        const page = yield select(state => state[name].page);
        yield put({ type: 'fetch', payload: { page } });
      }
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if (pathname === '/' + name) {
            if (localStorage.token.length > 10) {
              dispatch({ type: 'fetch', payload: query });
            } else {
              history.push('/login')
            }
          }
        });
      },
    },
  }
}
['Category', 'Customer', 'Order', 'Country', 'Brand', 'Color', 'User', 'Serial', 'Case', 'Attribute', 'Spu', 'Sku', 'Stock', 'Test'].map(cls => {
  exports[cls + 'Model'] = generate(cls.toLowerCase() + 's', cls + 'Service')
})
exports['login'] = function () { return service.login() }
exports['checkAccount'] = function () { return service.checkAccount() }
exports['logout'] = function () { return service.logout() }

/**-----------------------------自定义------------------------- */
exports["ColorModel"].effects.fetch = function* ({ payload: { page } }, { call, put }) {
  const colors = yield call(service["ColorService"].fetch, { page });
  const serialMap = yield call(service["getSerialMap"], 'Serial');
  const rd = { data: colors.data.data.list, total: colors.data.data.count, page: parseInt(page), serialMap: serialMap };
  yield put({ type: 'save22', payload: rd });
}

exports["AttributeModel"].effects.fetch = function* ({ payload: { page } }, { call, put }) {
  const attributes = yield call(service["AttributeService"].fetch, { page });
  const categoryMap = yield call(service["getCategoryMap"], 'Category');
  const rd = { data: attributes.data.data.list, total: attributes.data.data.count, page: parseInt(page), categoryMap: categoryMap }
  yield put({ type: 'save22', payload: rd });
}

exports["CategoryModel"].effects.fetch = function* ({ payload: { page } }, { call, put }) {
  const categoryMap = yield call(service["getCategoryMap"], 'Category');
  const categories = yield call(service["CategoryService"].fetch, { page });
  const rd = { data: categories.data.data.list, total: categories.data.data.count, page: parseInt(page), categoryMap: categoryMap }
  yield put({ type: 'save22', payload: rd });
}

exports["BrandModel"].effects.fetch = function* ({ payload: { page } }, { call, put }) {
  const categoryMap = yield call(service["getCategoryMap"], 'Category');
  const brands = yield call(service["BrandService"].fetch, { page });
  const rd = { data: brands.data.data.list, total: brands.data.data.count, page: parseInt(page), categoryMap: categoryMap }
  yield put({ type: 'save22', payload: rd });
}

exports['SpuModel'].effects.fetch = function* ({ payload: { page } }, { call, put }) {
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

  const skus = yield call(service['getSkuBySpuIdService'],{"spuId":{"$in":pids}})

  products.data.data.list.forEach(p => {
    skus.data.data.list.forEach(s => {
      if(s.spuId === p._id)
      {
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

exports['SpuModel'].effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
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
    for(let i = 0;i < item.tempNum;i ++){
      item.stockNum = pad((i+1),3);
      stocks.push(item);
    }
  });

  yield call(service['insertStockData'], 'Stock', stocks);

  //生成skus
  const page = yield select(state => state['spus'].page);
  yield put({ type: 'fetch', payload: { page } });
}

exports['SkuModel'].effects.add = function* ({ payload: { product, values } }, { call, put, select }) {
  console.log('patch', { product }, values, service)
  let skus = values.skus;
  skus.forEach((sku, index) => {
    sku.name = product.name;
    sku.spuId = product._id;
    sku.skuNum = pad(index + 1, 2);
  })
  let skusRet = yield call(service['insertSkuData'], 'Sku', skus);
  let stocks = [];

  skusRet.map(sku => { return sku.data.data.item })
  .map(v => { return { name: v.name, skuId: v._id, tempNum: v.count } })
  .forEach(item => {
    for(let i = 0;i < item.tempNum;i ++){
      let obj = Object.assign({},item);
      obj.stockNum = pad((i+1),3);
      stocks.push(obj);
    }
  });

  yield call(service['insertStockData'], 'Stock', stocks);

  //生成skus
  const page = yield select(state => state['spus'].page);
  yield put({ type: 'fetch', payload: { page } });
}


exports['SkuModel'].effects.fetch = function* ({ payload: { page } }, { call, put }) {
  const categoryMap = yield call(service["getCategoryMap"], 'Category');
  const serialMap = yield call(service["getSerialMap"], 'Serial');
  const colorMap = yield call(service["getColorMap"], 'Color');
  const countryMap = yield call(service["getCountryMap"], 'Country');
  const brandMap = yield call(service["getBrandMap"], 'Brand');
  const attributeMap = yield call(service["getAttributeMap"], 'Attribute');
  const skus = yield call(service["SkuService"].fetch, { page });

  const pids = skus.data.data.list.map(p => {
    return p.spuId;
  });

  const spus = yield call(service['getSpuByIdService'],{"_id":{"$in":pids}})

  skus.data.data.list.forEach(p => {
    spus.data.data.list.forEach(s => {
      if(p.spuId === s._id)
      {
        p.spu = s;
      }
    })
  })

  const rd = {
    data: skus.data.data.list,
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

export var pad = function (tbl) {
  return function (num, n) {
    return (0 >= (n = n - num.toString().length)) ? num : (tbl[n] || (tbl[n] = Array(n + 1).join(0))) + num;
  }
}([]); 