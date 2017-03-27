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
['Category', 'Customer', 'Order', 'Country', 'Brand', 'Color', 'User', 'Serial', 'Case', 'Attribute', 'Product', 'Test'].map(cls => {
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

exports['ProductModel'].effects.fetch = function* ({ payload: { page } }, { call, put }) {
  const categoryMap = yield call(service["getCategoryMap"], 'Category');
  const serialMap = yield call(service["getSerialMap"], 'Serial');
  const colorMap = yield call(service["getColorMap"], 'Color');
  const countryMap = yield call(service["getCountryMap"], 'Country');
  const brandMap = yield call(service["getBrandMap"], 'Brand');
  const attributeMap = yield call(service["getAttributeMap"], 'Attribute');
  const products = yield call(service["ProductService"].fetch, { page });
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

exports['ProductModel'].effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
  console.log('patch', { id },values)
  let spu = yield call(service['insertProductData'],'Product', values);

  console.log(spu,'----------------------spu-----------------');

  const page = yield select(state => state['products'].page);
  yield put({ type: 'fetch', payload: { page } });
}