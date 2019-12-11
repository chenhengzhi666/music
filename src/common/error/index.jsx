import React, { Component } from 'react'
import './index.less'
import { CSSTransition } from 'react-transition-group'

class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            title: ''
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }

    showError = (title = '') => {
        this.setState({
            show: true,
            title
        }, () => {
            setTimeout(() => {
                this.setState({
                    show: false
                })
            }, 1800)
        })
    }

    render() {
        return (
            <CSSTransition
                in={this.state.show}
                timeout={500}
                classNames='errors'
                unmountOnExit
            >
                <div className='error-wrapper'>
                    <div className='error'>
                        <i className='iconfont icon-remove'></i>
                        <div className='title'>{this.state.title || '加载失败'}</div>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default Error;