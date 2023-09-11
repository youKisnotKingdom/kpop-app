export function saveImgData({ commit }, data) {
    const nameImgDict = {};
    nameImgDict.name = data.name;
    const reader = new FileReader();
    reader.readAsDataURL(data.imgFile);
    reader.onload = () => {
        nameImgDict.img = reader.result
        commit('setImgData', nameImgDict);
    };
  }