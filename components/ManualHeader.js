import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
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
        <nav className="container flex items-center justify-between pt-3 sml:flex-col sml:justify-center sml:gap-6">
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
            <a
                href="#"
                className="justify-self-center lg:h-[100px] lg:w-[300px] md:h-[100px] md:w-[270px] sm:h-[80px] sm:w-[200px]"
            >
                <img src="/svgs/drop.svg" alt="logo"></img>
            </a>
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
        </nav>
    )
}
