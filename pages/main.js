import Head from "next/head"
import styles from "../styles/Home.module.css"
import LotteryEntrance from "../components/LotteryEntrance"
import MainHeader from "../components/MainHeader"
import MainFooter from "../components/MainFooter"

export default function Main() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Drop Lottery</title>
                <meta name="description" content="Drop lottery!" />
                <link rel="icon" href="/svgs/ethereumIcon.svg" />
            </Head>
            <MainHeader />
            <LotteryEntrance />
            <MainFooter />
        </div>
    )
}
