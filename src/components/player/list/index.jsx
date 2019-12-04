import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import BScroll from 'better-scroll'
import './index.less'
class SongList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.songListWrapperDOM = this.refs.songListWrapper
        const options = {
            click: true,
            probeType: 3,
            fade: false
        }
        this.listScroll = new BScroll(this.refs.list, options)
    }
    componentDidUpdate() {
        this.listScroll.refresh()
    }
    render() {
        let { listStatus, currentSongIndex, songs, currentSong, hideSongList, removeSong } = this.props
        let songList = songs.length > 0 && songs.map((item, index) => (
            <li key={item.id} className='item'>
                <p className='name-singer'>
                    <span className='name'>{item.name}</span><span className='singer'> - {item.singer}</span>
                </p>
                <i className={(index === currentSongIndex ? 'forbid ' : '') + 'iconfont icon-delect'} onClick={() => index === currentSongIndex ? {} : removeSong(item.id)}></i>
            </li>
        ))
        return (
            <CSSTransition
                in={listStatus}
                timeout={500}
                classNames='lists'
                onEnter={() => {
                    this.songListWrapperDOM.style.display = 'block'
                }}
                onExited={() => {
                    this.songListWrapperDOM.style.display = 'none'
                }}
            >
                <div className='song-list-wrapper' ref='songListWrapper' onClick={hideSongList}>
                    <div className='song-list' onClick={(e) => { e.stopPropagation() }}>
                        <div className='title'>
                            <span className='name'>播放列表（{songList.length}）</span>
                            <span className='close' onClick={hideSongList}>关闭</span>
                        </div>
                        <div className='scrollView' ref='list'>
                            <ul className='list'>
                                {songList}
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default SongList;