import React, { Component } from 'react'
import './index.less'
import ReactDOM from "react-dom"
import { Song } from "@/model/song"
import MusicHeader from '@/common/music-header'
import MiniPlayer from './mini'
import Progress from '@/common/progress'

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

    componentDidMount() {
        this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
        this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
        this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
        this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg)

        this.audioDOM.addEventListener("canplay", () => {
            this.audioDOM.play();
            // this.startImgRotate();

            this.setState({
                playStatus: true
            });

        }, false);

        this.audioDOM.addEventListener("timeupdate", () => {
            if (this.state.playStatus && this.audioDOM) {
                let progress = this.audioDOM.currentTime / this.audioDOM.duration;
                this.setState({
                    currentTime: this.audioDOM.currentTime,
                    playProgress: !isNaN(progress) ? progress : 0
                });
            }
        }, false);
    }


    /**
     * 播放或暂停
     */
    playOrPause = () => {
        // let audioDOM = ReactDOM.findDOMNode(this.refs.audio);
        if (this.state.playStatus === false) {
            // 表示第一次播放
            if (this.first === undefined && !this.audioDOM.src) {
                this.audioDOM.src = this.currentSong.url;
                this.first = true;
            }
            this.audioDOM.play();
            this.startImgRotate();

            this.setState({
                playStatus: true
            });
        } else {
            this.audioDOM.pause();
            this.stopImgRotate();

            this.setState({
                playStatus: false
            });
        }
    }

    /**
     * 开始旋转图片
     */
    startImgRotate = () => {
        let singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
        if (singerImgDOM.className.indexOf("rotate") === -1) {
            singerImgDOM.classList.add("rotate");
        } else {
            singerImgDOM.style.webkitAnimationPlayState = "running";
            singerImgDOM.style.animationPlayState = "running";
        }
    }
    /**
     * 停止旋转图片
     */
    stopImgRotate = () => {
        let singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg)
        singerImgDOM.style.webkitAnimationPlayState = "paused";
        singerImgDOM.style.animationPlayState = "paused";
    }

    playerStatus = (status) => () => {
        this.props.showMusicPlayer(status)
    }

    render() {
        let { currentSong, showStatus, playSongs } = this.props
        //从redux中获取当前播放歌曲
        if (currentSong && currentSong.url) {
            //当前歌曲发发生变化
            if (this.currentSong.id !== currentSong.id) {
                this.currentSong = currentSong
                if (this.audioDOM !== undefined) {
                    this.audioDOM.src = currentSong.url
                    //加载资源，ios需要调用此方法
                    this.audioDOM.load();
                }

            }
        }
        let song = this.currentSong;
        let playBg = song.img ? song.img : require("@/assets/img/default_play_bg.jpg");
        //播放按钮样式
        let playButtonClass = this.state.playStatus ? "icon-pause" : "icon-play";
        song.playStatus = this.state.playStatus;
        return (
            <div className='player-container'>
                <div className='player-wrapper' ref='player' style={showStatus ? { display: 'block' } : {}}>
                    <MusicHeader title='主播放器' headerBackEvent={this.playerStatus(false)} />
                    <div className='singer'>
                        <div className='name'>{song.name}</div>
                    </div>
                    <div className='singer-middle'>
                        <div className='singer-img' ref='singerImg'>
                            <img src={playBg} alt={song.name} />
                        </div>
                    </div>
                    <div className='player-operation'>
                        <div className='operation-wrapper'>
                            <div className='progress-wrapper'>
                                <span className='current-time'>{getTime(this.state.currentTime)}</span>
                                <Progress
                                    disableButton={false}
                                    disableClick={false}
                                    progress={this.state.playProgress}
                                />
                                <span className='total-time'>{getTime(song.duration)}</span>
                            </div>
                            <div className='play-wrapper'>
                                <div className='play-model-button'>
                                    <i className='icon-music iconfont'></i>
                                </div>
                                <div className='previous-button'>
                                    <i className='icon-previous iconfont'></i>
                                </div>
                                <div className='play-button' onClick={this.playOrPause}>
                                    <i className={playButtonClass + ' iconfont'}></i>
                                </div>
                                <div className='next-button'>
                                    <i className='icon-next iconfont'></i>
                                </div>
                                <div className='play-list-button'>
                                    <i className='icon-playlist-play iconfont'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <audio ref="audio"></audio>
                    <div className='player-bg' ref='playerBg' style={{ backgroundImage: `url(${playBg})` }}></div>
                </div>
                <MiniPlayer
                    showStatus={showStatus}
                    currentSong={currentSong}
                    showPlayer={this.playerStatus(true)}
                    progress={this.state.playProgress}
                    playStatus={this.state.playStatus}
                    playOrPause={this.playOrPause}
                />
            </div>

        );
    }
}

function getTime(second) {
    second = Math.floor(second);
    let minute = Math.floor(second / 60);
    second = second - minute * 60;
    return minute + ":" + second.toString().padStart(2,'0');
}

export default Player;