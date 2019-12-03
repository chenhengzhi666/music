import * as actionType from './actionType'
import localStorage from '@/util/storage'

//需要存储的初始状态数据
const initialState = {
    showStatus: false,  //播放界面显示状态
    song: localStorage.getCurrentSong(),  //当前歌曲
    songs: localStorage.getSongs()  //歌曲列表
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionType.SHOW_PLAYER:    //显示或隐藏播放状态
            return {
                ...state,
                showStatus: action.showStatus
            }
        case actionType.CHANGE_SONG:    //切换当前歌曲
            localStorage.setCurrentSong(action.song)
            return {
                ...state,
                song: action.song
            }
        case actionType.SET_SONGS:  //设置歌曲列表
            localStorage.setSongs(action.songs)
            return {
                ...state,
                songs: action.songs
            }
        case actionType.REMOVE_SONG:    //删除歌曲
            let newSongs = Object.assign({}, state).songs.filter((song) => song.id !== action.id)
            localStorage.setSongs(newSongs)
            return{
                ...state,
                songs: newSongs
            }
        default:
            return state
    }
}

export default reducer