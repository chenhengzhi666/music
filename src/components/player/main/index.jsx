import React, { Component } from 'react'
import './index.less'
import ReactDOM from 'react-dom'
import { Song } from '@/model/song'
import MusicHeader from '@/common/music-header'
import MiniPlayer from '../mini'
import Progress from '@/common/progress'
import { CSSTransition } from 'react-transition-group'
import Error from '@/common/error'
import SongList from '@/containers/SongList'

class Player extends Component {
    constructor(props) {
        super(props)
        this.currentSong = new Song(0, '', '', '', 0, '', '')
        this.currentIndex = 0

        //播放模式： list-列表 single-单曲 shuffle-随机
        this.playModes = ['list', 'single', 'shuffle']

        this.state = {
            currentTime: 0, // 当前播放秒数
            playProgress: 0,    // 播放进度
            playStatus: false,  // 播放状态
            dragProgress: 0 //拖拽进度
        }
    }

    componentDidMount() {
        this.audioDOM = ReactDOM.findDOMNode(this.refs.audio)
        this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg)
        this.playerDOM = ReactDOM.findDOMNode(this.refs.player)
        this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg)

        this.audioDOM.addEventListener('canplay', () => {
            this.audioDOM.play()
            this.setState({
                playStatus: true
            })

        }, false)

        this.audioDOM.addEventListener('timeupdate', () => {
            if (this.state.playStatus && this.audioDOM) {
                let progress = this.audioDOM.currentTime / this.audioDOM.duration
                this.setState({
                    currentTime: this.audioDOM.currentTime,
                    playProgress: !isNaN(progress) ? progress : 0
                })
            }
        }, false)

        this.audioDOM.addEventListener('error', () => { 
            this.setState({
                playStatus: false
            })
            this.ErrorComponent.showError('歌曲加载失败')
        }, false)
    }


    /**
     * 播放或暂停
     */
    playOrPause = () => {
        // let audioDOM = ReactDOM.findDOMNode(this.refs.audio)
        if (this.state.playStatus === false) {
            // 表示第一次播放
            if (this.first === undefined && !this.audioDOM.src) {
                this.audioDOM.src = this.currentSong.url
                this.first = true
            }
            this.audioDOM.play().then(() => {
                this.setState({
                    playStatus: true
                })
            }).catch(err => {
                this.setState({
                    playStatus: false
                })
                this.ErrorComponent.showError('歌曲加载失败')
            })
            
        } else {
            this.audioDOM.pause()

            this.setState({
                playStatus: false
            })
        }
    }

    // 下一首
    nextSong = (index) => {
        return () => {
            let {playSongs, changeCurrentSong} = this.props
            if(playSongs.length > index + 1) {
                changeCurrentSong(playSongs[index + 1])
            }else if(playSongs.length === index + 1) {
                changeCurrentSong(playSongs[0])
            }
        }
    }

    // 上一首
    prevSong = (index) => {
        return () => {
            let {playSongs, changeCurrentSong} = this.props
            if(index > 0) {
                changeCurrentSong(playSongs[index - 1])
            }else if(index === 0) {
                changeCurrentSong(playSongs[playSongs.length - 1])
            }
        }
    }

    /* 播放器显示状态 */
    playerStatus = (status) => {
        return () => {
            this.props.showMusicPlayer(status)
        }
    }

    // 点击进度条
    progressClick = (progress) => {
        if (!this.state.playStatus) {
            this.playOrPause()
        }
        let currentTime = this.currentSong.duration * progress
        let audioDOM = this.audioDOM
        audioDOM.currentTime = currentTime
        audioDOM.play()
    }

    // 拖拽进度条
    handleDrag = (progress) => {
        if (this.audioDOM.duration > 0) {
            this.audioDOM.pause()
            this.setState({
                playStatus: false,
                playProgress: progress
            })
        } else {
            this.setState({
                playProgress: progress
            })
        }
    }

    // 拖拽结束
    handleDragEnd = () => {
        let currentTime = this.currentSong.duration * this.state.playProgress
        this.setState({
            currentTime
        }, () => {
            this.audioDOM.currentTime = currentTime
            if (!this.audioDOM.duration) {
                // 第一次进入播放界面进行滑动
                this.playOrPause()
            } else {
                this.audioDOM.play()
                this.setState({
                    playStatus: true
                })
            }
        })
    }

    render() {
        let { currentSong, showStatus, playSongs, showSongList, currentSongIndex } = this.props
        let { currentTime, playProgress, playStatus } = this.state
        let imgStyle = {
            WebkitAnimationPlayState: playStatus ? 'running' : 'paused',
            animationPlayState: playStatus ? 'running' : 'paused'
        }
        //从redux中获取当前播放歌曲
        if (currentSong && currentSong.url) {
            //当前歌曲发发生变化
            if (this.currentSong.id !== currentSong.id) {
                this.currentSong = currentSong
                if (this.audioDOM !== undefined) {
                    this.audioDOM.src = currentSong.url
                    //加载资源，ios需要调用此方法
                    this.audioDOM.load()
                }

            }
        }
        let song = this.currentSong
        let playBg = song.img ? song.img : require('@/assets/img/default_play_bg.jpg')
        //播放按钮样式
        let playButtonClass = playStatus ? 'icon-pause' : 'icon-play'
        // song.playStatus = playStatus
        return (
            <div className='player-container'>
                <CSSTransition
                    in={showStatus}
                    timeout={500}
                    classNames='player-transition'
                    onEnter={() => {
                        this.playerDOM.style.display = 'block'
                    }}
                    onExited={() => {
                        this.playerDOM.style.display = 'none'
                    }} >
                    <div className='player-wrapper' ref='player' >
                        <MusicHeader title={song.name} headerBackEvent={this.playerStatus(false)} />
                        <div className='singer'>
                            <div className='name'>{song.singer}</div>
                        </div>
                        <div className='singer-middle'>
                            <div className='singer-img rotate' ref='singerImg' style={imgStyle}>
                                <img src={playBg} alt={song.name} />
                            </div>
                        </div>
                        <div className='player-operation'>
                            <div className='operation-wrapper'>
                                <div className='progress-wrapper'>
                                    <span className='current-time'>{getTime(currentTime)}</span>
                                    <Progress
                                        disableButton={false}
                                        disableClick={false}
                                        progress={playProgress}
                                        progressClick={this.progressClick}
                                        onDrag={this.handleDrag}
                                        onDragEnd={this.handleDragEnd}
                                    />
                                    <span className='total-time'>{getTime(song.duration)}</span>
                                </div>
                                <div className='play-wrapper'>
                                    <div className='play-model-button'>
                                        <i className='icon-music iconfont'></i>
                                    </div>
                                    <div className='previous-button' onClick={this.prevSong(currentSongIndex)}>
                                        <i className='icon-previous iconfont'></i>
                                    </div>
                                    <div className='play-button' onClick={this.playOrPause}>
                                        <i className={playButtonClass + ' iconfont'}></i>
                                    </div>
                                    <div className='next-button' onClick={this.nextSong(currentSongIndex)}>
                                        <i className='icon-next iconfont'></i>
                                    </div>
                                    <div className='play-list-button' onClick={showSongList}>
                                        <i className='icon-playlist-play iconfont'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <audio ref='audio'></audio>
                        <div className='player-bg' ref='playerBg' style={{ backgroundImage: `url(${playBg})` }}></div>
                    </div>
                </CSSTransition>

                <MiniPlayer
                    showStatus={showStatus}
                    song={song}
                    showPlayer={this.playerStatus(true)}
                    progress={playProgress}
                    playStatus={playStatus}
                    playOrPause={this.playOrPause}
                    nextSong={this.nextSong(currentSongIndex)}
                />

                <Error onRef={ref => this.ErrorComponent = ref} />
            </div>

        )
    }
}

function getTime(second) {
    second = Math.floor(second)
    let minute = Math.floor(second / 60)
    second = second - minute * 60
    return minute + ':' + second.toString().padStart(2, '0')
}

export default Player