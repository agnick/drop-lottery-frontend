import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import { contractAddresses } from "../constants"
import Timer from "./Timer"

export default function MainHeader() {
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const casinoAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <nav className="container flex items-center justify-between pt-3 sm:flex-col sml:justify-center sml:gap-6">
            {casinoAddress ? (
                <>
                    <ul className="flex gap-5 md:flex-col md:gap-1 sm:hidden">
                        <li>
                            <a href="https://web.telegram.org/k/">
                                <img
                                    src="/svgs/telegramIcon.svg"
                                    alt="telegram"
                                    className="h-[60px] w-[60px] lg:h-[40px] lg:w-[40px]"
                                ></img>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/agnick">
                                <img
                                    src="/svgs/gitIcon.svg"
                                    alt="github"
                                    className="h-[60px] w-[60px] lg:h-[40px] lg:w-[40px] "
                                ></img>
                            </a>
                        </li>
                    </ul>
                    <div className="flex flex-col gap-1">
                        <div className="bg-rose-gradient bg-clip-text text-center font-whyteInktrap text-4xl font-medium text-transparent lg:text-2xl sm:text-3xl">
                            time left
                        </div>
                        <div className="text-shadow text-center font-whyteInktrap text-6xl font-medium text-misty-rose lg:text-4xl sm:text-5xl">
                            <Timer />
                        </div>
                    </div>
                    <div>
                        {account ? (
                            <div className="h-14 w-[230px] rounded-[20px] bg-misty-rose px-5 py-6 text-center font-whyteInktrap text-[25px] font-medium leading-3 text-light-brown lg:h-8 lg:w-[150px] lg:p-3 lg:text-[20px] md:h-8 md:w-[120px] md:text-[12px]">
                                {account.slice(0, 6)}...{account.slice(account.length - 4)}
                            </div>
                        ) : (
                            <button
                                className="h-14 w-[230px] rounded-[20px] bg-coral-gradient text-center font-whyteInktrap text-[25px] font-medium leading-3 text-misty-rose lg:h-8 lg:w-[150px] lg:text-[20px] md:h-8 md:w-[120px] md:text-[12px]"
                                onClick={async () => {
                                    await enableWeb3()
                                    if (typeof window !== "undefined") {
                                        window.localStorage.setItem("connected", "injected")
                                    }
                                }}
                                disabled={isWeb3EnableLoading}
                            >
                                connect wallet
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div></div>
            )}
        </nav>
    )
}
