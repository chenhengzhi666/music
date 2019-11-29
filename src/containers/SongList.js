import {connect} from 'react-redux'
import SongList from '@/components/player/list'
import {removeSong, changeSong} from '@/redux/action'

const mapStateToProps = (state) => ({
    songs: state.songs,
    currentSong: state.song
})

const mapDispatchToProps = (dispatch) => ({
    removeSong: (id) => {
        dispatch(removeSong(id))
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SongList)
