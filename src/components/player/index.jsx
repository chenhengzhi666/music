import React, { Component } from 'react'
import Player from '@/containers/Player'
import SongList from '@/containers/SongList'
import {connect} from 'react-redux'

/* 考虑到播放列表有很多列表数据，如果放在Player组件中每次更新播放进度都会调用render函数，
对列表进行遍历，影响性能，所以把播放列表组件和播放组件分成两个组件并放到MusicPlayer组件中，
它们之间通过父组件MusicPlayer来进行数据交互 */

class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listStatus: false   // 列表状态
        }
    }

    componentDidMount() {

    }

    // 歌曲列表状态
    songListStatus = (status) => (e) => {
        e.preventDefault()
        this.setState({
            listStatus: status
        })
    }


    render() { 
        let {listStatus} = this.state
        return (
            <div className='music-player'>
                <Player
                    showSongList={this.songListStatus(true)}
                    currentSongIndex={this.props.currentSongIndex}
                />
                <SongList
                    listStatus={listStatus}
                    currentSongIndex={this.props.currentSongIndex}
                    hideSongList={this.songListStatus(false)}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentSongIndex: state.songs.map(song => song.id).indexOf(state.song.id)
})
 
export default connect(mapStateToProps, null)(MusicPlayer);