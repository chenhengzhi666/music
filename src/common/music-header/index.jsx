import React, { Component } from 'react'
import './index.less'

class MusicHeader extends Component {
    handleClick() {
        window.history.back()
    }

    render() {
        return (
            <div className="music-header">
                <span className="header-back" onClick={this.props.headerBackEvent || this.handleClick}>
                    <i className="iconfont icon-back"></i>
                </span>
                <div className="header-title">
                    {this.props.title}
                </div>
            </div>
        );
    }
}

export default MusicHeader;