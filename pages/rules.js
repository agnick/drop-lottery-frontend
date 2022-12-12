import Head from "next/head"
import styles from "../styles/Home.module.css"
import MainFooter from "../components/MainFooter"
import Rules from "../components/Rules"

export default function Main() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Drop Lottery</title>
                <meta name="description" content="Drop lottery!" />
                <link rel="icon" href="/svgs/ethereumIcon.svg" />
            </Head>
            <Rules />
        </div>
    )
}
