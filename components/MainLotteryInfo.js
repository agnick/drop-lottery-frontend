import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import convertEth from "../scripts/converter"
import Timer from "./Timer"

export default function MainLotteryInfo() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const casinoAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [contractBalance, setContractBalance] = useState("0")
    const [ethUsdPrice, setEthUsdPrice] = useState("0")

    const { runContractFunction: getContractBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "getContractBalance",
        params: {},
    })

    async function updateUI() {
        const ethUsdPriceFromAPI = (await convertEth()).toString()
        const contractBalanceFromCall = (await getContractBalance()).toString()
        setEthUsdPrice(ethUsdPriceFromAPI)
        setContractBalance(contractBalanceFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, chainId])

    if (typeof window !== "undefined") {
        window.addEventListener("resize", function () {
            const rules = this.document.getElementById("horRules")
            if (window.innerWidth < 992) {
                rules.classList.remove("hidden")
            } else {
                rules.classList.add("hidden")
            }
        })
    }

    return (
        <div className="lg:mt-15 container lg:mt-14">
            <div className="flex justify-between lg:flex-col lg:justify-self-center">
                <ul className="flex-col">
                    <li className="font-whyteInktrap text-7xl font-medium text-light-coral lg:justify-items-center lg:text-center lg:text-6xl sm:text-5xl">
                        time left
                    </li>
                    <li className="text-shadow mt-2 font-whyteInktrap text-8xl font-medium text-misty-rose lg:text-center lg:text-7xl sm:text-5xl">
                        <Timer />
                    </li>
                    <li className="font-whyteInktrap text-7xl font-medium text-light-coral lg:text-center lg:text-6xl sm:text-5xl">
                        play to win
                    </li>
                    <li className="text-shadow mt-5 font-whyteInktrap text-8xl font-medium text-misty-rose lg:text-center lg:text-7xl sm:text-6xl">
                        $
                        {parseFloat(
                            ethers.utils.formatEther(contractBalance) * ethUsdPrice
                        ).toFixed(2)}
                    </li>
                    <li className="mt-10 hidden" id="horRules">
                        <img
                            src="/svgs/horizontalRules.svg"
                            alt="rules"
                            className="sm:mt-[100px] "
                        ></img>
                    </li>
                    <li className="lg:mt-15 mt-10 lg:flex lg:flex-col lg:items-center lg:justify-center md:mt-[80px] sm:mt-[130px]">
                        <a href="/main">
                            <button className="h-[80px] w-[400px] rounded-[20px] bg-coral-gradient text-center font-whyteInktrap text-5xl font-medium text-misty-rose lg:h-[70px] lg:w-[300px] lg:text-3xl">
                                play
                            </button>
                        </a>
                    </li>
                </ul>
                <div>
                    <img
                        src="/svgs/rules.svg"
                        alt="play-rules"
                        className="top-0 right-0 h-[650px] w-[900px] justify-self-start lgst:h-[600px] lgst:w-[700px] lg:hidden"
                    />
                </div>
            </div>
        </div>
    )
}
