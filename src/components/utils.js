/**
   * 格式化服务端数据
   * @param {*} data 
   */
function  getFormatData(data) {
    let rst = [];
    if (data) {
      data.forEach(v => {
        !v.parentId && rst.push({ "value": v._id, "label": v.name, "_id": v._id });
      })

      data.forEach(v => {
        v.parentId && getParent(v, rst);
      })
      function getParent(item, elems) {
        if (!elems) {
          return;
        }
        elems.forEach(v => {
          if (v._id === item.parentId) {
            v.children ? v.children.push({ "value": item._id, "label": item.name, "_id": item._id }) : (v.children = [{ "value": item._id, "label": item.name, "_id": item._id }]);
          } else {
            return getParent(item, v.children);
          }
        })
      }
    }
    return rst;
  };

 exports['getFormatData'] = getFormatData;