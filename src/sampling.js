//
// 修改抽样算法，以前以uid作为抽样的key，在大于100抽样率下会呈现正态分布
// 改用random可以规避这个问题
//

// (function (n) {
//     const guid = function () {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//             let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
//             return v.toString(16);
//         });
//     };

//     const parseGuid = function (uid) {
//         let num = 0;
//         for (let i = 0, len = uid.length; i < len; i++) {
//             num += uid.charCodeAt(i);
//         }
//         return num;
//     };

//     let arr = [];

//     for (let i = 0, n = n || 1000000; i++ < n;) {
//         // arr.push(parseGuid(guid()) % 100);
//         arr.push(Math.floor(Math.random() * 100));
//     }

//     let map = {};
//     arr.forEach(function (num) {
//         if (!map[num]) {
//             map[num] = 0;
//         }
//         map[num]++;
//     });
//     console.log(map);

// })();

export default function (wpo) {
  const map = {}
  wpo.sampling = function (mod, isApi) {
    if (mod === 1) {
      return 1 // 100%
    }

    // api采样率使用动态api
    if (isApi) {
      return Math.floor(Math.random() * mod)
    }

    if (typeof map[mod] === 'number') {
      return map[mod]
    }

    //
    // 抽样算法改为Math.random
    //

    map[mod] = Math.floor(Math.random() * mod)
    return map[mod]
  }
}
