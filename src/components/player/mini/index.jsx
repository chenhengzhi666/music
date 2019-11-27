import React, { Component } from 'react'
import './index.less'
import Progress from '@/common/progress'

class MiniPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    miniPalyOrPause = (e) => {
        e.stopPropagation()
        this.props.playOrPause()
    }

    render() { 
        let {showStatus, currentSong} = this.props
        let playerImg = currentSong.img || require('@/assets/img/default_play_bg.jpg')
        let playButtonClass = this.props.playStatus ? "icon-pause" : "icon-play";
        return (
            <div className='mini-layer-wrapper' onClick={this.props.showPlayer} style={showStatus ? {display:'none'} : {}}>
                <div className='mini-player-img'>
                    <img src={playerImg} alt={currentSong.name}/>
                </div>
                <div className='mini-player-content'>
                    <div className='progress-wrapper'>
                        <Progress
                            disableButton={true} 
                            disableClick={true}
                            progress={this.props.progress}
                        />
                    </div>
                    <span className='song'>{currentSong.name}</span>
                    <span className='singer'>{currentSong.singer}</span>
                </div>
                <div className='player-btns'>
                    <i className={playButtonClass + ' iconfont'} onClick={this.miniPalyOrPause}></i>
                    <i className='iconfont icon-next'></i>
                </div>
            </div>
        );
    }
}
 
export default MiniPlayer;