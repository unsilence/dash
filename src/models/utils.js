import * as service from './../services';
export var generate = (name, serviceName) => {
    return {
        namespace: name,
        state: {
            list: [],
            total: null,
        },
        reducers: {
            save22(state, { payload: { data: list, total, page, serialMap, categoryMap, colorMap, countryMap, brandMap, attributeMap ,isHasId ,skuProjectList,skuPropsList,skuattributeIDs ,_list ,hotList ,navList} }) {
                page = page || 1
                return { ...state, list, total, page, serialMap, categoryMap, colorMap, countryMap, brandMap, attributeMap ,isHasId,skuProjectList,skuPropsList,skuattributeIDs ,_list,hotList,navList};
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

export var pad = function (tbl) {
  return function (num, n) {
    return (0 >= (n = n - num.toString().length)) ? num : (tbl[n] || (tbl[n] = Array(n + 1).join(0))) + num;
  }
}([]);