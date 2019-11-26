import React, { Component } from 'react'
import './index.less'
import Progress from '@/common/progress'

class MiniPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        let {showStatus, currentSong} = this.props
        let playerImg = currentSong.img || require('@/assets/img/default_play_bg.jpg')
        return (
            <div className='mini-layer-wrapper' style={showStatus ? {display:'none'} : {}}>
                <div className='mini-player-img'>
                    <img src={playerImg} alt={currentSong.name}/>
                </div>
                <div className='mini-player-content'>
                    <div className='progress-wrapper'>
                        <Progress
                            disableButton={true} 
                            disableClick={true}
                        />
                    </div>
                    <span className='song'>{currentSong.name}</span>
                    <span className='singer'>{currentSong.singer}</span>
                </div>
                <div className='player-btns'>
                    <i className='iconfont icon-play'></i>
                    <i className='iconfont icon-next'></i>
                </div>
            </div>
        );
    }
}
 
export default MiniPlayer;