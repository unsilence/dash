import * as service from './../services';

export var editOrderOption = function (orders) {

    orders.effects.fetch = function* ({ payload: { page } }, { call, put }) {
        // 无条件的 ProjectInfo
        const orders_ = yield call(service["fetchOrderPage"], 'Order', {},{page});  // 取出order 里 所有的order数据
        const categoryMap = yield call(service["getCategoryMap"], 'Category');  // 得到所有的分类
        let list = orders_.data.data.list;  // 请求回来订单的数组列表
        const _list = list;
        let projectIns = list.map(v => v.address_num); 
        console.log(projectIns);
        let projectList = yield call(service["getDataService"],"Address",{"_id" : {"$in" : projectIns}});  // 得到order列表里显示的address属性
        console.log(projectList);
        let skuIds = new Array();
        list.forEach(v => {v.skus.forEach(t => {skuIds.push(t.sku_num)})});  // 得到suk列表的id数组

        // 把和这个sku_num 所有相关联的order取出来
        const addressIds = yield call(service["getDataService"],"Order",{"skus.sku_num" : {"$in" : skuIds}})
        const projectIds = addressIds.data.data.list.map(v => v.address_num);
        console.log(projectIds);
        // 从address里全出和每一个sku相关的所有address
        const addressList = yield call(service["getDataService"],"Address",{"_id" : {"$in" : projectIds}});  // 余sku相关的所有工程
       
        const skuInSkuList = yield call(service["getDataService"], 'Sku', {'_id':{'$in':skuIds}});   // 请求回sku表里面和order 里 sku_num 相同的数据
        console.log(skuInSkuList.data.data.list);
        const _skus = skuInSkuList.data.data.list;
        const spus = _skus.map(v => v.spu_num);

        // 得到sku里的attribu属性
        const attributes = [];
        _skus.forEach(v => {
            v.attributes.forEach(k => {
                attributes.push(k.attribute_num);
            })
        })
        const attributeList = yield call(service["getDataService"],"Attribute",{"_id" : {"$in" : attributes}});
        
        const spuList = yield call(service["getDataService"],"Spu",{"_id" : {"$in" : spus}});
        _skus.forEach( v => {
            spuList.data.data.list.forEach(t => {
                if(v.spu_num == t._id){
                    v.spuProps = t;
                }
            })
            v.attributes.forEach(k => {
                attributeList.data.data.list.forEach(j => {
                    if(k.attribute_num == j._id){
                        k.attributeProps = j;
                    }
                })
            })
        })
        let colors;
        _skus.forEach(v => {
            v.attributes.forEach(k => {
                if(k.attributeProps.name === "颜色"){
                    colors = JSON.parse(k.value.replace(/\\/g,""));
                }
            })
        })
        console.log(colors);
        const colorList = yield call(service["getDataService"],"Color",{"_id" : {"$in" : colors}});
        // const colorMap = yield call(service["getColorMap"], 'Color');  // 得到所有的分类
        console.log(colorList);
        console.log(_skus);
        // 把color属性赋值给每个sku
        _skus.forEach( v => {
            v.attributes.forEach(k => {
                k.colorProps = [];
                if(k.dtype == "array"){
                    JSON.parse(k.value.replace(/\\/g,"")).forEach( j => {
                        colorList.data.data.list.forEach(t => {
                            if(j == t._id){
                                k.colorProps.push(t);
                            }
                        })
                    })
                }
            })
        })
        /* 把address属性赋值给相应的order*/
        list.forEach(v => {
            projectList.data.data.list.forEach(k => {
                if(v.address_num == k._id){
                    v.addressProps = k;
                }
            })
            v.skus.forEach(j => {
                _skus.forEach(a => {
                    if(j.sku_num == a._id){
                        console.log(j.sku_num);
                        j.skuProps = a;
                    }
                })
            }) 
            v.skus.forEach(c => {
                c.orderProps = [];
                addressIds.data.data.list.forEach(d => {
                    d.skus.forEach(f => {
                        if(c.sku_num == f.sku_num){
                            c.orderProps.push(d);
                        }
                    })
                })
            })   
            
            v.skus.forEach(g => {
                g.addressProps = [];
                if(g.orderProps){
                  g.orderProps.forEach(j => {
                    addressList.data.data.list.forEach(l => {
                        if(j.address_num == l._id){
                            g.addressProps.push(l);
                        }
                    })
                  })  
                }
            })
        });
        list.forEach(v => {
            if(!v.addressProps){
                v.addressProps = {}
            }
        })
        console.log(list);
        // skuPropsList.forEach(p => {
        //     setIds.add(p.spuId);
        // });
        // const _pids = Array.from(setIds);
        // const spus = yield call(service['getDataService'], 'Spu', { "_id": { "$in": _pids } })
        // let colorIDs = {};
        // skuPropsList.forEach(p => {
        //     spus.data.data.list.forEach(s => {
        //         if (p.spuId === s._id) {
        //             p.spu = s;
        //         }
        //     })
        // })

        // //获取 属性相关信息 Attribute
        // let attributeArr = new Set();
        // skuPropsList.forEach(p => {
        //     p.attributes.forEach(v => {
        //         attributeArr.add(v.attributeID);
        //     })
        // })
        // const attributeIDs = Array.from(attributeArr); 
        // const skuattributeList = yield call(service['getDataService'], 'Attribute', { "_id": { "$in": attributeIDs } })
        // const skuattributeIDs = skuattributeList.data.data.list;

        // skuPropsList.forEach(p => {
        //     p.attributes.forEach(v => {
        //        skuattributeIDs.forEach(t => {
        //         if(t.name === "颜色" && v.attributeID === t._id){
        //             colorIDs[v.attributeID] = JSON.parse(v.value);
        //         }
        //        }) 
        //     })
        // })
        
        // const colorMap = yield call(service["getColorMap"], 'Color');
        // let tempArr = [];
        // skuattributeIDs.forEach(v => {
        //     if(colorIDs[v._id] !== undefined){
        //         colorIDs[v._id].forEach(p => {
        //             tempArr.push(colorMap[p]);
        //         })
        //         v.colors = tempArr;
        //     }
        // })
        // console.log(skuattributeIDs);
        // console.log(colorMap);
        // console.log(colorIDs);
        // const infoList = [];
        // let  infoMap = {};
        // infos.data.data.list.forEach(v => {infoMap[v._id] = v});
        // console.log(infoMap);
        // list.forEach(v => {v.schedule = infoMap[v.projectInfoId].schedule;
        //                     v.address = infoMap[v.projectInfoId].address;
        //                     v.designerName = infoMap[v.projectInfoId].designerName;
        //                     v.area = infoMap[v.projectInfoId].area;
        //                     v.days = infoMap[v.projectInfoId].days;
        //                     v.designerDepartment = infoMap[v.projectInfoId].designerDepartment;
        //                     v.designerPhone = infoMap[v.projectInfoId].designerPhone;
        //                     v.name = infoMap[v.projectInfoId].name;
        //                     v.userId = infoMap[v.projectInfoId].userId;
        //                     v.doorTime = infoMap[v.projectInfoId].doorTime;
        //                     });
        let skuPropsList;
        let skuattributeIDs;
        const rd = { data:list, total: orders_.data.data.count, page: parseInt(page) , skuPropsList ,categoryMap ,skuattributeIDs,_list}
        yield put({ type: 'save22', payload: rd });
    }

    orders.effects.add = function* ({ payload: { id, values } }, { call, put, select }) {
        // values.rtype = '1';
        // let recommendRes = yield call(service['getOrderMap'], 'Order');
        // values.order = Object.keys(recommendRes).length + 1;
        yield call(service['OrderService'].insert, values);
        const page = yield select(state => state['orders'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    // orders.effects.remove = function* ({ payload: { id } }, { call, put, select }) {
    //     console.log('remove', { id })
    //     yield call(service['RecommendService'].remove, id);
    //     const page = yield select(state => state['banners'].page);
    //     yield put({ type: 'fetch', payload: { page } });
    // }
    orders.effects.patch = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log('patch', { id })
        yield call(service['OrderService'].update, id, values);
        const page = yield select(state => state['orders'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
    orders.effects.addPerject = function* ({ payload: { id, values } }, { call, put, select }) {
        console.log(values);
        yield call(service['AddressService'].insert, values);
        const page = yield select(state => state['orders'].page);
        yield put({ type: 'fetch', payload: { page } });
    }
}