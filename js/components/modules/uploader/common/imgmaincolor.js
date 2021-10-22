const COLOR_SIZE = 40 // 单位色块的大小（像素个数，默认40）。以单位色块的平均像素值为作为统计单位
const LEVEL = 32 // 色深，颜色分区参数（0-255），总256，2^8，即8bit，4个通道（rgba），即默认色深4*8bit，32bit

/**
 * 灰度化图片
 * @param {*} imageData 
 */
export function greyTheImage(imageData) {
  const { data } = imageData;
  // imageData有4个通道rgba
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    // 对RGB通道进行加权平均 
    // 人对不同通道颜色敏感值不一样
    // 绿色敏感度高，所以加权值高
    // 蓝色敏感度低，所以加权值低
    const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = a;
  }
  return imageData
}

/**
 * 获取平均色调
 * @param {*} imageData 
 */
function getUniqueColor(imageData) {
  imageData = imageData.data ? imageData.data : imageData
  let res_r = 0
  let res_g = 0
  let res_b = 0
  let res_a = 0
  for (let i = 0; i < imageData.length; i += 1) {
    if (i % 4 === 0) {
      res_r += imageData[i]
    } else if (i % 4 === 1) {
      res_g += imageData[i]
    } else if (i % 4 === 2) {
      res_b += imageData[i]
    } else if (i % 4 === 3) {
      res_a += imageData[i]
    }
  }
  res_r = Math.round(res_r / (imageData.length / 4))
  res_g = Math.round(res_g / (imageData.length / 4))
  res_b = Math.round(res_b / (imageData.length / 4))
  res_a = Math.round(res_a / (imageData.length / 4))
  return `rgba: rgba(${res_r},${res_g},${res_b},${res_a})`
}

/**
 * 获取主色调
 * @param {*} imageData 
 */
export function getMainColor(imageData) {
  imageData = imageData.data ? imageData.data : imageData
  let defRst = {
    rgb: '',
    rgba: '',
    hex: '',
    hexa: '',
    defaultRGB: {}
  }
  if (imageData.length < 4) {
    return defRst
  } else {
    const mapData = getLevelData(imageData)
    const colors = getMostColor(mapData)
    if (!colors) {
      return defRst
    } else {
      const color = getAverageColor(colors)
      return colorStrFormat(color)
    }
  }
}

// 获取每段的颜色数据
// 根据像素数据，按单位色块进行切割
function getLevelData(imageData) {
  const len = imageData.length;
  const mapData = {};
  for (let i = 0; i < len; i += COLOR_SIZE * 4) {
    const blockColor = getBlockColor(imageData, i); // 该区块平均rgba [{r,g,b,a}]数据
    // 获取各个区块的平均rgba数据，将各个通道的颜色进行LEVEL色深降级
    // 根据r_g_b_a 建立map索引
    const key = getColorLevel(blockColor);
    !mapData[key] && (mapData[key] = []);
    mapData[key].push(blockColor);
  }
  return mapData;
}

// 获取单位块的全部色值
// 并根据全部色值，计算平均色值
// 处理最后边界值，小于COLOR_SIZE
function getBlockColor(imageData, start) {
  let data = [],
    count = COLOR_SIZE,
    len = COLOR_SIZE * 4;
  imageData.length <= start + len && (count = Math.floor((imageData.length - start - 1) / 4));
  for (let i = 0; i < count; i += 4) {
    data.push({
      r: imageData[start + i + 0],
      g: imageData[start + i + 1],
      b: imageData[start + i + 2],
      a: imageData[start + i + 3]
    })
  }
  return getAverageColor(data);
}

// 取出各个通道的平均值，即为改色块的平均色值
function getAverageColor(colorArr) {
  const len = colorArr.length;
  let sr = 0, sg = 0, sb = 0, sa = 0;
  colorArr.map(function (item) {
    sr += item.r;
    sg += item.g;
    sb += item.b;
    sa += item.a;
  });
  return {
    r: Math.round(sr / len),
    g: Math.round(sg / len),
    b: Math.round(sb / len),
    a: Math.round(sa / len)
  }
}

function getColorLevel(color) {
  return getLevel(color.r) + '_' + getLevel(color.g) + '_' + getLevel(color.b) + '_' + getLevel(color.a)
}

// 色深降级
function getLevel(value) {
  return Math.round(value / LEVEL)
}

// 根据色块颜色，获取
function getMostColor(colorData) {
  let rst = null, len = 0;
  for (let key in colorData) {
    colorData[key].length > len && (
      rst = colorData[key],
      len = colorData[key].length
    )
  }
  return rst;
}

// 对最终颜色的字符串格式化
/**
 * result:{
 *   hex:'#ffffff',            十六位值
 *   hexa:'#ffffff00',         十六位值带alpha值
 *   rgb:'rgb(0,0,0)',         RGB值
 *   rgba:'rgba(0,0,0,0)'      RGB值带alpha值
 *   defaultRGB: {r: 0, g: 0, b: 0, a: 0} 默认rgba对象
 * }
 */
function colorStrFormat(color) {
  const rgba = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (color.a / 255).toFixed(4).replace(/\.*0+$/, '') + ')';
  const rgb = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
  const hex = '#' + Num2Hex(color.r) + Num2Hex(color.g) + Num2Hex(color.b);
  const hexa = hex + Num2Hex(color.a);
  return {
    rgba: rgba,
    rgb: rgb,
    hex: hex,
    hexa: hexa,
    defaultRGB: color
  }
}

function Num2Hex(num) {
  const hex = num.toString(16) + '';
  if (hex.length < 2) {
    return '0' + hex;
  } else {
    return hex;
  }
}