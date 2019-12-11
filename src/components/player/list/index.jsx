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

    removeSong = (item, index, currentSongIndex) => {
        return (e) => {
            e.stopPropagation()
            if(index !== currentSongIndex) {
                this.props.removeSong(item.id)
            }
        }
        
    }

    render() {
        let { listStatus, currentSongIndex, songs, hideSongList } = this.props
        let songList = songs.length > 0 && songs.map((item, index) => (
            <li key={item.id} className={(index === currentSongIndex ? 'forbid ' : '') + 'item'} onClick={() => this.props.changeCurrentSong(item)}>
                <p className='name-singer'>
                <span className='name'><i className='song-index'>{index + 1}</i>{item.name}</span><span className='singer'> - {item.singer}</span>
                </p>
                <i className='iconfont icon-remove' onClick={this.removeSong(item, index, currentSongIndex)}></i>
            </li>
        ))
        return (
            <CSSTransition
                in={listStatus}
                timeout={500}
                classNames='lists'
                onEnter={() => {
                    this.songListWrapperDOM.style.display = 'block'
                    let f = currentSongIndex >= 4 ? currentSongIndex - 4 : 0
                    this.listScroll.scrollTo(0, - 40 * f, 500)
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