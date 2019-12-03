import React, { Component } from 'react'
import './index.less'
import { getRankingList } from '@/api/ranking'
import { CODE_SUCCESS } from '@/api/config'
import * as RankingModel from "@/model/ranking"
import Loading from '@/common/loading'
import BScroll from 'better-scroll'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { Route } from 'react-router-dom'
import Detail from '@/containers/Detail'

class Ranking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rankingList: []
        }
    }

    componentDidMount() {
        if(!this.props.match.isExact) {
            this.setState({
                loading: false
            })
        }
        getRankingList().then(res => {
            if (res && res.code === CODE_SUCCESS) {
                let topList = res.data.topList.map(item => (
                    !(/MV/i.test(item.topTitle)) && RankingModel.createRankingByList(item)
                ))
                this.setState({
                    loading: false,
                    rankingList: topList.filter(item => item !== false)
                }, () => {
                    const options = {
                        click: true,
                        probeType: 3,
                        fade: false
                    }
                    this.rankingScroll = new BScroll(this.refs.rankingScroll, options)
                    this.rankingScroll.on('scroll', (pos) => {
                        forceCheck()
                    })
                })
            }
        })
    }

    toDetail = (url) => () => {
        this.props.history.push({
            pathname: url
        });
    }

    render() {
        const { loading, rankingList } = this.state
        let { match } = this.props;
        let list = rankingList.map(item => (
            <li className='item' key={item.id} onClick={this.toDetail(`${match.url}/${item.id}`)}>
                <div className='item-left-wrapper'>
                    <LazyLoad>
                        <img src={item.img} alt={item.title} width='100%' height='100%' />
                    </LazyLoad>
                </div>
                <div className='item-right-wrapper'>
                    <h2 className='title'>{item.title}</h2>
                    <div className='top-song'>
                        {
                            item.songs.map((song, index) => (
                                <div className='song' key={`song${index}`}>

                                    <p className='name-singer'>
                                        <span className='index'>{index + 1}</span>
                                        <span className='name'>{song.name}&nbsp;-&nbsp;</span>
                                        <span className='singer'>{song.singer}</span>
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </li>
        ))
        return (
            <div className='ranking-wrapper'>
                <div className='ranking-content'>
                    <div className='scroll-view' ref='rankingScroll'>
                        <ul className='ranking-list'>
                            {list}
                        </ul>
                    </div>
                </div>
                <Loading show={loading} title='正在加载...' />
                <Route path={`${match.url}/:id`} component={Detail} />
            </div>
        );
    }
}

export default Ranking;