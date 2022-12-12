import { contractAddresses, abi, fireDate } from "../constants"
import { ethers } from "ethers"
import { useEffect } from "react"
import { useMoralis } from "react-moralis"
import dayjs from "dayjs"

export default function Timer() {
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const casinoAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const provider = new ethers.providers.WebSocketProvider(
        `wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_SOCKET}`
    )
    const CasinoV1 = new ethers.Contract(
        "0x67FfF2Dc4b12c03590edc216639226862855116F",
        abi,
        provider
    )
    const countDownDate = new Date(fireDate["fireDate"]).getTime()

    function saveData() {
        const body = {
            fireDate: dayjs().add(2, "minutes"),
        }
        fetch("/api/writeData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
    }

    CasinoV1.on("WinnerPicked", () => {
        saveData()
    })

    useEffect(() => {
        const countdown = setInterval(function () {
            const now = new Date().getTime()
            const gap = countDownDate - now

            const second = 1000
            const minute = second * 60
            const hour = minute * 60
            const day = hour * 24

            let textDay = Math.floor(gap / day)
            let textHour = Math.floor((gap % day) / hour)
            let textMinute = Math.floor((gap % hour) / minute)
            let textSecond = Math.floor((gap % minute) / second)

            if (textDay < 0 && textHour < 0 && textMinute < 0 && textSecond < 0) {
                textDay = 0
                textHour = 0
                textMinute = 0
                textSecond = 0
            }

            if (typeof window !== "undefined") {
                document.getElementById(
                    "timer"
                ).innerText = `${textDay}:${textHour}:${textMinute}:${textSecond}`
            }

            if (typeof window !== "undefined") {
                if (document.getElementById("timer").innerText === "0:0:0:0") {
                    document.getElementById("timer").innerText = "processing..."
                }
            }

            if (gap < 0) {
                clearInterval(countdown)
            }
        }, 1000)
    }, [])

    return <div id="timer"></div>
}
