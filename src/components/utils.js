/**
   * 格式化服务端数据
   * @param {*} data 
   */
function getFormatData(data) {
  let rst = [];
  if (data) {
    data.forEach(v => {
      !v.parentId && rst.push({ "value": v._id, "label": v.name, "_id": v._id, 'key': v._id });
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
          v.children ? v.children.push({ "value": item._id, "label": item.name, "_id": item._id, 'key': item._id }) : (v.children = [{ "value": item._id, "label": item.name, "_id": item._id, 'key': item._id }]);
        } else {
          return getParent(item, v.children);
        }
      })
    }
  }
  return rst;
};

exports['getFormatData'] = getFormatData;

/**
 * 获得格式化的颜色数据
 * @param {*} serials 
 * @param {*} colors 
 */
function getColorSerialFormatData(serials, colors) {
  let rst = [];
  serials.forEach(v => {
    rst.push({ "value": v._id, "label": v.name, "_id": v._id, 'key': v._id });
  })

  colors.forEach(c => {
    getParent(c, rst);
  });
  function getParent(item, elems) {
    elems.forEach(v => {
      if (v._id === item.seriesId) {
        v.children ? v.children.push({ "value": item._id, "label": item.name, "_id": item._id, 'key': item._id }) : (v.children = [{ "value": item._id, "label": item.name, "_id": item._id, 'key': item._id }]);
      }
    })
  };

  return rst;
}
exports['getColorSerialFormatData'] = getColorSerialFormatData;