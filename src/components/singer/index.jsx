import React, { Component } from 'react'
import './index.less'
import Loading from '@/common/loading'
import BScroll from 'better-scroll'
import { getSingerList } from '@/api/singer'
import { CODE_SUCCESS } from '@/api/config'
import * as SingerModel from '@/model/singer'
import LazyLoad, { forceCheck } from 'react-lazyload'
import Detail from '@/containers/Detail'
import { Route } from 'react-router-dom'

class Singer extends Component {
    constructor(props) {
        super(props);
        this.types = [
            { key: 'all_all', name: '全部' },
            { key: 'cn_man', name: '华语男' },
            { key: 'cn_woman', name: '华语女' },
            { key: 'cn_team', name: '华语组合' },
            { key: 'k_man', name: '韩国男' },
            { key: 'k_woman', name: '韩国女' },
            { key: 'k_team', name: '韩国组合' },
            { key: 'j_man', name: '日本男' },
            { key: 'j_woman', name: '日本女' },
            { key: 'j_team', name: '日本组合' },
            { key: 'eu_man', name: '欧美男' },
            { key: 'eu_woman', name: '欧美女' },
            { key: 'eu_team', name: '欧美组合' },
            { key: 'other_other', name: '其它' }
        ]
        this.indexs = createIndexs()

        this.state = {
            loading: true,
            typeKey: 'all_all',
            indexKey: 'all',
            singers: []
        }
    }

    componentDidMount() {
        // 初始化歌手分类总宽
        let navTypeListDOM = this.refs.navTypeList
        let navTypeElems = navTypeListDOM.querySelectorAll('li')
        let navTotalWidth = 0
        Array.from(navTypeElems).forEach(li => {
            navTotalWidth += li.offsetWidth
        })
        navTypeListDOM.style.width = `${navTotalWidth}px`;

        // 初始化歌手字母索引总宽
        let navIndexListDOM = this.refs.navIndexList
        let navIndexElems = navIndexListDOM.querySelectorAll('li')
        let navIndexTotalWidth = 0
        Array.from(navIndexElems).forEach(li => {
            navIndexTotalWidth += li.offsetWidth
        })
        navIndexListDOM.style.width = `${navIndexTotalWidth}px`;

        const options = {
            click: true,
            probeType: 3,
            fade: false,
            scrollX: true,
            scrollY: false
        }
        this.typesScroll = new BScroll(this.refs.typesView, options)
        this.indexsScroll = new BScroll(this.refs.indexsView, options)

        this.getSingers()
    }

    getSingers = () => {
        // 获取歌手列表
        getSingerList(1, `${this.state.typeKey}_${this.state.indexKey}`).then(res => {
            if (res && res.code === CODE_SUCCESS) {
                let singers = res.data.list.map(item => (
                    new SingerModel.Singer(
                        item.Fsinger_id,
                        item.Fsinger_mid,
                        item.Fsinger_name,
                        `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    )
                ))
                this.setState({
                    loading: false,
                    singers
                }, () => {
                    const options = {
                        click: true,
                        probeType: 3,
                        fade: false
                    }
                    this.singerScroll = new BScroll('.singer-area', options)
                    this.singerScroll.on('scroll', (pos) => {
                        forceCheck()
                    })
                })
            }
        })
    }

    // 选择歌手类型
    selectType = (typeKey) => {
        return () => {
            this.setState({
                typeKey,
                loading: true,
                singers: []
            }, () => {
                this.getSingers()
            })
        }
    }

    // 选择歌手首字母
    selectIndex = (indexKey) => {
        return () => {
            this.setState({
                indexKey,
                loading: true,
                singers: []
            }, () => {
                this.getSingers()
            })
        }
    }

    // 歌手详情
    toDetail = (url) => () => {
        this.props.history.push({
            pathname: url
        })
    }


    render() {
        const { match } = this.props
        const { loading, typeKey, indexKey, singers } = this.state
        let types = this.types.map(item => (
            <li className={`${typeKey === item.key ? 'active ' : ''}item`} key={item.key} onClick={this.selectType(item.key)}>
                {item.name}
            </li>
        ))
        let indexs = this.indexs.map(item => (
            <li className={`${indexKey === item.key ? 'active ' : ''}item`} key={item.key} onClick={this.selectIndex(item.key)}>
                {item.name}
            </li>
        ))
        let singer_s = singers.map(item => (
            <li className='singer' key={item.id} onClick={this.toDetail(`${match.url}/${item.mId}`)}>
                <div className='img'>
                    <LazyLoad>
                        <img src={item.img} alt={item.name} width='100%' height='100%'
                            onError={e => {
                                e.currentTarget.src = require('@/assets/img/music.png')
                            }}
                        />
                    </LazyLoad>
                </div>
                <div className='name'>
                    {item.name}
                </div>
            </li>
        ))
        return (
            <div className='singer-wrapper'>
                <div className='nav-area'>
                    <div className='view' ref='typesView'>
                        <ul className='list' ref='navTypeList'>
                            {types}
                        </ul>
                    </div>
                    <div className='view' ref='indexsView'>
                        <ul className='list' ref='navIndexList'>
                            {indexs}
                        </ul>
                    </div>
                </div>
                <div className='singer-area'>
                    <ul className='single-list'>
                        {singer_s}
                    </ul>
                </div>
                <Route path={`${match.url}/:id`} component={Detail} />
                <Loading show={loading} title='正在加载...' />
            </div>
        );
    }
}

// 生成歌手字母索引对象
const createIndexs = () => {
    let indexs = [{ key: 'all', name: '热门' }]
    for (let i = 65; i < 91; i++) {
        indexs.push({
            key: String.fromCharCode(i),
            name: String.fromCharCode(i)
        });
    }
    return indexs
}

export default Singer;