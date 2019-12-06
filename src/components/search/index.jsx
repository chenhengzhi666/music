import React, { Component } from 'react'
import './index.less'
import Loading from '@/common/loading'
import BScroll from 'better-scroll'
import { getHotKey, search } from "@/api/search"
import { CODE_SUCCESS } from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"
import Detail from '@/containers/Detail'
import {Route} from 'react-router-dom'
import {getSongVKey} from "@/api/song"

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotKeys: [],
            singer: {},
            album: {},
            songs: [],
            w: '',
            loading: false
        }
    }

    componentWillMount() {
        // 获取热歌
        getHotKey().then(res => {
            if (res && res.code === CODE_SUCCESS) {
                this.setState({
                    hotKeys: res.data.hotkey
                });
            }
        })
    }

    // 输入时
    inputChange = (e) => {
        e.currentTarget.value ?
            this.setState({
                w: e.currentTarget.value
            }) : this.cancel()
    }

    // 选中热门时
    selectHot = (w) => {
        return () => {
            this.search(w)
        }
    }

    // 点击取消时
    cancel = () => {
        this.setState({
            w: '',
            songs: [],
            album: {},
            singer: {}
        })
    }

    // 查询歌曲
    search = (w) => {
        this.setState({
            loading: true,
            w
        }, () => {
            search(w).then(res => {
                if (res && res.code === CODE_SUCCESS) {
                    let zhida = res.data.zhida;
                    let type = zhida.type;
                    let singer = {};
                    let album = {};
                    switch (type) {
                        // 0：表示歌曲
                        case 0:
                            break;
                        // 1：表示歌手
                        case 1:
                            let zhiDaSinger = zhida.zhida_singer;
                            singer = SingerModel.createSingerBySearch(zhiDaSinger);
                            singer.songNum = zhiDaSinger.songNum;
                            singer.albumNum = zhiDaSinger.albumNum;
                            break;
                        // 2: 表示专辑
                        case 2:
                            let zhiDaAlbum = zhida.zhida_album;
                            album = AlbumModel.createAlbumBySearch(zhiDaAlbum);
                            break;
                        default:
                            break;
                    }

                    let songs = [];
                    res.data.song.list.forEach((data) => {
                        if (data.pay.payplay === 1) { return }
                        songs.push(SongModel.createSong(data));
                    });
                    this.setState({
                        album,
                        singer,
                        songs,
                        loading: false
                    }, () => {
                        const options = {
                            click: true,
                            fade: false,
                            probeType: 3
                        }
                        this.resultScroll = new BScroll('.result-area', options)
                    });
                }
            })
        })
    }

    // 专辑详情
    toAlbumDetail = (url) => {
        return () => {
            this.props.history.push({
                pathname: url
            })
        }
    } 

    // 歌手详情
    toSingerDetail = (url) => {
        return () => {
            this.props.history.push({
                pathname: url
            })
        }
    } 

    // 获取歌曲vkey
    toSongVkey = (song) => {
        return () => {
            getSongVKey(song.mId).then(res => {
                if(res && res.code === CODE_SUCCESS && res.data.items) {
                    let item = res.data.items[0];
                    song.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;

                    this.props.setSongs([song]);
                    this.props.changeCurrentSong(song);
                }
            })
        }
    }

    render() {
        const { hotKeys, w, loading, album, singer, songs } = this.state
        const {match} = this.props
        let hotList = hotKeys.map((item, index) => (
            index < 10 ?
                <li className='hot' key={item.n} onClick={this.selectHot(item.k)}>
                    {item.k}
                </li> : null

        ))
        let song_s = songs.map(item => (
            <li className='item song' key={item.id} onClick={this.toSongVkey(item)}>
                <div className='left'>
                    <i className='iconfont icon-music1'></i>
                </div>
                <div className='right'>
                    <p className='name'>{item.name}</p>
                    <p className='singer'>{item.singer}</p>
                </div>
            </li>
        ))

        return (
            <div className='search-wrapper'>
                <div className='search-area'>
                    <div className='search-box-wrapper'>
                        <i className='iconfont icon-search'></i>
                        <form className='input-form' action='javascript(0):return true' onSubmit={e => { e.preventDefault() }}>
                            <input type='search' placeholder='搜索歌手、歌曲、专辑'
                                onChange={this.inputChange}
                                onKeyDown={
                                    e => {
                                        if (e.keyCode === 13) {
                                            e.currentTarget.blur()
                                            this.search(e.currentTarget.value)
                                        }
                                    }
                                }
                                value={w}
                            />
                        </form>

                        {
                            w ? <div className='cancel-btn' onClick={this.cancel}>取消</div> : null
                        }
                    </div>
                </div>
                {
                    !w ?
                        <div className='hot-search-area'>
                            <h2 className='title'>热门搜索</h2>
                            <ul className='hot-list'>
                                {hotList}
                            </ul>
                        </div> : null
                }
                <div className='result-area'>
                    <ul className='result-view'>
                        {/* 专辑 */}
                        {
                            album.id ?
                                <li className='item album' onClick={this.toAlbumDetail(`${match.url}/album/${album.mId}`)}>
                                    <div className='left'>
                                        <img src={album.img} alt={album.title} width='100%' />
                                    </div>
                                    <div className='right'>
                                        <p className='name'>{album.title}</p>
                                        <p className='singer'>{album.singer}</p>
                                    </div>
                                </li> : null
                        }
                        {/* 歌手 */}
                        {
                            singer.id ?
                                <li className='item singer' onClick={this.toSingerDetail(`${match.url}/singer/${singer.mId}`)}>
                                    <div className='left'>
                                        <img src={singer.img} alt={singer.name} width='100%' />
                                    </div>
                                    <div className='right'>
                                        <p className='name'>{singer.name}</p>
                                        <p className='singer'>{singer.singer}</p>
                                    </div>
                                </li> : null
                        }
                        {/* 歌曲 */}
                        {song_s}
                    </ul>
                    <Loading show={loading} title='正在加载...' />
                </div>
                <Route path={`${match.url}/singer/:id`} component={Detail} />
                <Route path={`${match.url}/album/:id`} component={Detail} />
            </div>
        );
    }
}

export default Search;