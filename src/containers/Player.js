import { connect } from 'react-redux'
import { showPlayer, changeSong } from '@/redux/action'
import Player from '@/components/player'

const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (status) => {
        dispatch(showPlayer(status))
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song))
    }
})

const mapStateToProps = (state) => ({
    showStatus: state.showStatus,
    currentSong: state.song,
    playSongs: state.songs
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)