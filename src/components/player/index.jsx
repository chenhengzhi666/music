import React, { Component } from 'react'
import './index.less'
import ReactDOM from "react-dom"
import { Song } from "@/model/song"
import MusicHeader from '@/common/music-header'
import MiniPlayer from './mini'

class Player extends Component {
    constructor(props) {
        super(props);
        this.currentSong = new Song(0, "", "", "", 0, "", "");
        this.currentIndex = 0;

        //播放模式： list-列表 single-单曲 shuffle-随机
        this.playModes = ["list", "single", "shuffle"];

        this.state = {
            currentTime: 0,
            playProgress: 0,
            playStatus: false,
            currentPlayMode: 0
        }
    }
    render() {
        let {currentSong, showStatus, playSongs} = this.props
        return (
            <div className='player-container'>
                <div className='player-wrapper' style={showStatus ? {display:'block'} : {}}>
                    <MusicHeader title='主播放器' />
                </div>
                <MiniPlayer
                    showStatus={showStatus}
                    currentSong={currentSong}
                />
            </div>

        );
    }
}

export default Player;