export function setImgData ( state, payload ) {
    state.imgData[payload.name] = payload.img
}

export function removeImgData( state ) {
    state.imgData = {}
}

export function setEditorData (state, editorData) {
    state.editors[editorData.group] = editorData.content
}