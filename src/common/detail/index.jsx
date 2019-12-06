import React, { Component } from 'react'
import './index.less'
import MusicHeader from '@/common/music-header'
import Bscroll from 'better-scroll'
import Loading from '@/common/loading'
import getDetailInfo from '@/api/detail'
import { CODE_SUCCESS } from '@/api/config'
import * as AlbumModel from '@/model/album'
import * as RankingModel from '@/model/ranking'
import * as SingerModel from '@/model/singer'
import * as SongModel from '@/model/song'
import ReactDOM from 'react-dom'
import { getSongVKey } from '@/api/song'
import { CSSTransition } from 'react-transition-group'

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            show: false,
            album: {},
            songs: [],
            type: '',   // 父级页面类型
            name: ''    // 详情页类别名称
        }
    }

    componentDidMount() {
        this.setState({
            show: true  //开始动画进入
        })
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg)
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer)
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + 'px'
        let arr = this.props.match.path.split('/') 
        const type = arr[arr.length - 2]    // 获取父级路由类型
        this.setState({
            type
        })
        // 获取信息
        getDetailInfo(type, this.props.match.params.id).then((res) => {
            if (res && res.code === CODE_SUCCESS) {
                let detailHandle = this.detailHandle(type, res)
                this.setState({
                    loading: false,
                    album: detailHandle.base,
                    songs: detailHandle.songs,
                    name: detailHandle.name
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

    detailHandle = (type, res) => {
        let data = {}
        let songs = []
        switch (type) {
            case 'recommend':
                data.base = AlbumModel.createAlbumByDetail(res.data)
                res.data.list.forEach(item => {
                    let song = SongModel.createSong(item)
                    this.getSongUrl(song, item.songmid)
                    songs.push(song)
                })
                data.songs = songs
                data.name = '专辑'
                return data
            case 'album':
                data.base = AlbumModel.createAlbumByDetail(res.data)
                res.data.list.forEach(item => {
                    let song = SongModel.createSong(item)
                    this.getSongUrl(song, item.songmid)
                    songs.push(song)
                })
                data.songs = songs
                data.name = '专辑'
                return data
            case 'ranking':
                data.base = RankingModel.createRankingByDetail(res.topinfo)
                res.songlist.forEach(item => {
                    if (item.data.pay.payplay === 1) { return }
                    let song = SongModel.createSong(item.data);
                    this.getSongUrl(song, item.data.songmid);
                    songs.push(song);
                })
                data.songs = songs
                data.name = '排行榜'
                return data
            case 'singer':
                data.base = SingerModel.createSingerByDetail(res.data)
                res.data.list.forEach(item => {
                    if (item.musicData.pay.payplay === 1) { return }
                    let song = SongModel.createSong(item.musicData);
                    this.getSongUrl(song, song.mId);
                    songs.push(song);
                })
                data.songs = songs
                data.name = '歌曲'
                return data
            default:
                return data
        }
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
        if (songs.length > 0) {
            this.props.setSongs(songs)
            this.props.changeCurrentSong(songs[0])
            this.props.showMusicPlayer(true)
        }
    }

    render() {
        const { album, name, type } = this.state
        const trecommendBoolean = type === 'recommend' || type === 'album'
        const rankingBoolean = type === 'ranking'
        const singerBoolean = type === 'singer'
        let songs = this.state.songs.map((song, index) => {
            return (
                <div className='song' key={song.id} onClick={this.selectSong(song)}>
                    {
                        rankingBoolean ? <div className={`song-index${index + 1} song-index`}>{index + 1}</div> : null
                    }
                    <div className='song-info'>
                        <div className='song-name'>{song.name}</div>
                        <div className='song-singer'>{song.singer}</div>
                    </div>
                </div>
            )
        })
        return (
            <CSSTransition in={this.state.show} timeout={300} classNames='translate' >
                <div className='album-wrapper'>
                    <MusicHeader title={album.title} headerBackEvent={() => {
                        this.setState({
                            show: false
                        }, () => {
                            // 防止返回造成闪屏现象
                            setTimeout(() => {
                                window.history.back()
                            }, 295)
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
                                <div className='song-count'>{name} 共{songs.length}首</div>
                                <div className='song-list'>
                                    {songs}
                                </div>
                                {
                                    !singerBoolean ?
                                        <div className='info'>
                                            <h1 className='titlle'>{trecommendBoolean ? name : ''}简介</h1>
                                            <p className='content'>
                                                {album.desc}
                                            </p>
                                        </div> : null
                                }

                            </div>
                        </div>
                        <Loading title='正在加载...' show={this.state.loading} />
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Detail 