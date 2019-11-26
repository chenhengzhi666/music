import { connect } from 'react-redux'
import { showPlayer, changeSong, setSongs } from '@/redux/action'
import Album from '@/components/album'

const mapDispatchToProps = (dispatch) => ({
    showMusicPlayer: (status) =>{
        dispatch(showPlayer(status))
    },
    changeCurrentSong: (song) => {
        dispatch(changeSong(song))
    },
    setSongs: (songs) => {
        dispatch(setSongs(songs))
    }
})

export default connect(null, mapDispatchToProps)(Album)