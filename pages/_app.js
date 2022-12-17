import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { HashRouter as Roater, Route, Switch, Link } from "react-router-dom"

function MyApp({ Component, pageProps }) {
    return (
        <Roater>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </Roater>
    )
}

export default MyApp
