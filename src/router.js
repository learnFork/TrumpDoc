import React from 'react'
import './index.css'

import { HashRouter as Router, Route } from 'react-router-dom'
import { Layout, Icon } from 'antd'
import { connect } from 'react-redux'

import SiderRenderer from './views/sider'
import PageRenderer from './views/page'
import Cover from './views/cover/index'
import GlobalLoading from './views/global-spin'

const { Header, Content, Footer, Sider } = Layout

const skin = window.$trumpDoc.skin === 'dark' ? '#000c17' : 'white'
document.body.style.backgroundColor = skin
const trumpDoc = window.$trumpDoc

class App extends React.Component {
    state = {
        siderCollapsed: false
    }

    componentDidMount() {
        if (window.location.hash !== '#/' && window.$trumpDoc) {
            this.props.dispatch({
                type: 'toDocs'
            })
        }

        window.addEventListener('resize', this.resize)
        this.resize()
    }

    toggle = () => {
        this.setState(
            {
                siderCollapsed: !this.state.siderCollapsed
            },
            () => {
                this.props.dispatch({
                    type: 'fetchMenu',
                    payload: !this.state.siderCollapsed
                })
            }
        )
    }

    resize = () => {
        if (window.innerWidth < 700) {
            this.setState({
                siderCollapsed: true
            })
        } else {
            this.setState(
                {
                    siderCollapsed: false
                },
                () => {
                    this.props.dispatch({
                        type: 'fetchMenu',
                        payload: false
                    })
                }
            )
        }
    }

    renderContent = () => {
        return (
            <Layout>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0
                    }}
                    collapsedWidth="0"
                    collapsed={this.state.siderCollapsed}
                    onCollapse={(collapsed, type) => {
                        this.props.dispatch({
                            type: 'fetchMenu',
                            payload: collapsed
                        })
                    }}
                >
                    <div className="logo">{window.$trumpDoc.repo}</div>
                    <SiderRenderer />
                </Sider>
                <Layout
                    className="trump-layout"
                    style={{
                        marginLeft: this.state.siderCollapsed ? 0 : 200
                    }}
                >
                    <Header style={{ background: skin, padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={
                                this.state.siderCollapsed
                                    ? 'menu-unfold'
                                    : 'menu-fold'
                            }
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{
                            // margin: '24px 16px 0',
                            overflow: 'initial'
                        }}
                    >
                        <div
                            className="root-wapper"
                            style={{ backgroundColor: skin }}
                        >
                            <GlobalLoading />
                            <Route path="/home" component={PageRenderer} />
                        </div>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                            backgroundColor: skin,
                            color: trumpDoc.skin === 'dark' ? 'white' : 'black'
                        }}
                    >
                        ZhiHu@ZhengFang
                    </Footer>
                </Layout>
            </Layout>
        )
    }

    renderCover = () => {
        console.log('渲染')
        return (
            <div>
                <Route exact path="/" component={Cover} />
            </div>
        )
    }

    render() {
        return (
            <Router>
                {this.props.cover ? this.renderCover() : this.renderContent()}
            </Router>
        )
    }
}

const mapStateToProps = state => {
    return state.page
}

const AppContainer = connect(mapStateToProps)(App)

export default () => {
    return (
        <div className="rootWrapper">
            <AppContainer />
        </div>
    )
}
