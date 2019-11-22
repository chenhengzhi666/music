import React, { Component } from 'react'
import './index.less'
import Swiper from 'swiper'
import BScroll from 'better-scroll'
import 'swiper/dist/css/swiper.css'
import { getCarousel, getNewAlbum } from '@/api/recommend'
import { CODE_SUCCESS } from '@/api/config'
import * as AlbumModel from '@/model/album'
import Loading from '@/common/loading'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { Route } from 'react-router-dom'
import Album from '@/components/album'


class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderList: [],
            newAlbums: [],
            loading: true
        }
    }

    componentDidMount() {
        if(!this.props.match.isExact) {
            this.setState({
                loading: false
            })
        }
        // 获取轮播图
        getCarousel().then(res => {
            if (res && res.code === CODE_SUCCESS) {
                this.setState({
                    sliderList: res.data.slider
                }, () => {
                    if (!this.sliderSwiper) {
                        //初始化轮播图
                        this.sliderSwiper = new Swiper('.slider-container', {
                            loop: true,
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false,
                            pagination: '.swiper-pagination'
                        })
                    }
                })
            }
        })

        // 获取最新专辑
        getNewAlbum().then(res => {
            if (res && res.code === CODE_SUCCESS) {
                //根据发布时间降序排列
                let albumList = res.albumlib.data.list;
                albumList.sort((a, b) => {
                    return new Date(b.public_time).getTime() - new Date(a.public_time).getTime();
                })
                this.setState({
                    newAlbums: albumList,
                    loading: false
                }, () => {
                    const options = {
                        click: true,
                        probeType: 3,
                        fade: false
                    }
                    // 设置滚动效果
                    this.albumScroll = new BScroll(this.refs.albumScroll, options)
                    this.albumScroll.on('scroll', pos => {
                        // 当滚动时候，触发专辑图片懒加载
                        forceCheck()
                    })
                })
            }
        })
    }

    albumDetail = (url) => () => {
        this.props.history.push({
            pathname: url
        })
    }

    render() {
        let { match } = this.props
        let albums = this.state.newAlbums.map(item => {
            //通过函数创建专辑对象
            let album = AlbumModel.createAlbumByList(item);
            return (
                <div className='album' key={album.mId} onClick={this.albumDetail(`${match.url}/${album.mId}`)}>
                    <div className='left'>
                        <LazyLoad>
                            <img src={album.img} width='100%' height='100%' alt={album.name} />
                        </LazyLoad>
                    </div>
                    <div className='right'>
                        <div className='album-name'>
                            {album.name}
                        </div>
                        <div className='singer-name'>
                            {album.singer}
                        </div>
                        <div className='time'>
                            {album.publicTime}
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <div className='recommend-wrapper'>
                <div className='recommend' ref='albumScroll'>
                    <div className='scroll-view'>
                        <div className='slider-container'>
                            <div className='swiper-wrapper'>
                                {
                                    this.state.sliderList.map(slider => (
                                        <div className='swiper-slide' key={slider.id}>
                                            <a className='slider-nav' href={slider.linkUrl}>
                                                <img src={slider.picUrl} width='100%' height='100%' alt='推荐' />
                                            </a>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='swiper-pagination'></div>
                        </div>
                        <div className='album-container' style={this.state.loading ? {display:'none'}: {}}>
                            <h1 className='title'>最新专辑</h1>
                            <div className='album-list'>
                                {albums}
                            </div>
                        </div>
                    </div>
                </div>
                <Loading show={this.state.loading} title='正在加载...' />
                <Route path={`${match.url}/:id`} component={Album} />
            </div>
        );
    }
}

export default Recommend;