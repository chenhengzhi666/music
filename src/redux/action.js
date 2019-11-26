import * as actionType from './actionType'

const showPlayer = (showStatus) => ({
    type: actionType.SHOW_PLAYER,
    showStatus
})

const changeSong = (song) => ({
    type: actionType.CHANGE_SONG,
    song
})

const removeSong = (id) =>({
    type: actionType.CHANGE_SONG,
    id
})

const setSongs = (songs) => ({
    type: actionType.SET_SONGS,
    songs
})

export { showPlayer, changeSong, removeSong, setSongs }
