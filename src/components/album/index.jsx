import React, { Component } from 'react'
import './index.less'
import MusicHeader from '@/common/music-header'
import Bscroll from 'better-scroll'
import Loading from '@/common/loading'
import { getAlbumInfo } from '@/api/recommend'
import { CODE_SUCCESS } from '@/api/config'
import * as AlbumModel from '@/model/album'
import * as SongModel from '@/model/song'
import ReactDOM from 'react-dom'
import { getSongVKey } from '@/api/song'
import { CSSTransition } from 'react-transition-group'

class Album extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            show: false,
            album: {},
            songs: [],
            refreshScroll: false
        }
    }

    componentDidMount() {
        this.setState({
            show: true  //开始动画进入
        })
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg)
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer)
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + 'px'
        // 获取专辑信息
        getAlbumInfo(this.props.match.params.id).then((res) => {
            if (res && res.code === CODE_SUCCESS) {
                let album = AlbumModel.createAlbumByDetail(res.data)
                album.desc = res.data.desc

                let songList = res.data.list
                let songs = []
                songList.forEach(item => {
                    let song = SongModel.createSong(item)
                    this.getSongUrl(song, item.songmid)
                    songs.push(song)
                })
                this.setState({
                    loading: false,
                    album: album,
                    songs: songs
                }, () => {
                    const options = {
                        click: true,
                        probeType: 3,
                        fade: false
                    }
                    this.detailScroll = new Bscroll(this.refs.detailScroll, options)

                    let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg)
                    let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg)
                    this.detailScroll.on('scroll', (pos) => {
                        if (pos.y < 0) {
                            if (Math.abs(pos.y) + 55 > albumBgDOM.offsetHeight) {
                                albumFixedBgDOM.style.display = 'block'
                            } else {
                                albumFixedBgDOM.style.display = 'none'
                            }
                        } else {
                            let transform = `scale(${1 + pos.y * 0.004}, ${1 + pos.y * 0.004})`
                            albumBgDOM.style['webkitTransform'] = transform
                            albumBgDOM.style['transform'] = transform
                        }
                    })
                })
            }
        })
    }

    // 获取歌曲url
    getSongUrl(song, mId) {
        getSongVKey(mId).then((res) => {
            if (res && res.code === CODE_SUCCESS) {
                if (res.data.items) {
                    let item = res.data.items[0]
                    song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                }
            }
        })
    }

    // 选择播放歌曲
    selectSong = (song) => () => {
        this.props.setSongs([song]);
        this.props.changeCurrentSong(song);
    }

    // 播放全部
    playAll = () => {
        const songs = this.state.songs
        if(songs.length > 0) {
            this.props.setSongs(songs)
            this.props.changeCurrentSong(songs[0])
            this.props.showMusicPlayer(true)
        }
    }

    render() {
        let album = this.state.album
        let songs = this.state.songs.map((song) => {
            return (
                <div className='song' key={song.id} onClick={this.selectSong(song)}>
                    <div className='song-name'>{song.name}</div>
                    <div className='song-singer'>{song.singer}</div>
                </div>
            )
        })
        return (
            <CSSTransition in={this.state.show} timeout={300} classNames='translate' onExited={() => {
                window.history.back()
            }}>
                <div className='album-wrapper'>
                    <MusicHeader title={album.name} headerBackEvent={() => {
                        this.setState({
                            show: false
                        })
                    }} />
                    <div className='poster' >
                        <div ref='albumBg' className='album-img' style={{ backgroundImage: `url(${album.img})` }}></div>
                        <div ref='albumFixedBg' className='album-fixed-img' style={{ backgroundImage: `url(${album.img})` }}></div>
                        <div className='play-wrapper' ref='playButtonWrapper'>
                            <div className='play-button' onClick={this.playAll}>
                                <i className='iconfont icon-play'></i>
                                <span>播放全部</span>
                            </div>
                        </div>

                    </div>
                    <div ref='albumContainer' className='album-container'>
                        <div className='detail-view' ref='detailScroll' style={this.state.loading ? { display: 'none' } : {}}>
                            <div className='detail-wrapper'>
                                <div className='song-count'>专辑 共{songs.length}首</div>
                                <div className='song-list'>
                                    {songs}
                                </div>
                                <div className='info'>
                                    <h1 className='titlle'>专辑简介</h1>
                                    <p className='content'>
                                        {album.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Loading title='正在加载...' show={this.state.loading} />
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Album 