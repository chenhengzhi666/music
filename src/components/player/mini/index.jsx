import React, { Component } from 'react'
import './index.less'
import Progress from '@/common/progress'

class MiniPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    miniPalyOrPause = (e) => {
        e.stopPropagation()
        this.props.playOrPause()
    }

    nextSong = (e) => {
        e.stopPropagation()
        this.props.nextSong()
    }

    render() {
        let { showStatus, song, playStatus, progress, showPlayer } = this.props
        let playerImg = song.img || require('@/assets/img/default_play_bg.jpg')
        let playButtonClass = playStatus ? 'icon-pause' : 'icon-play'
        let miniImgStyle = {
            WebkitAnimationPlayState: playStatus ? 'running' : 'paused',
            animationPlayState: playStatus ? 'running' : 'paused'
        }
        return (
            <div className='mini-layer-wrapper' onClick={showPlayer} style={showStatus ? { display: 'none' } : {}}>
                <div className='rotate mini-player-img' style={miniImgStyle} ref='miniImg'>
                    <img src={playerImg} alt={song.name} />
                </div>
                <div className='mini-player-content'>
                    <div className='progress-wrapper'>
                        <Progress
                            disableButton={true}
                            disableClick={true}
                            progress={progress}
                        />
                    </div>
                    <span className='song'>{song.name}</span>
                    <span className='singer'>{song.singer}</span>
                </div>
                <div className='player-btns'>
                    <i className={playButtonClass + ' iconfont'} onClick={this.miniPalyOrPause}></i>
                    <i className='iconfont icon-next' onClick={this.nextSong}></i>
                </div>
            </div>
        )
    }
}

export default MiniPlayer