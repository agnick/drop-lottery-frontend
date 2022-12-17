import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import convertEth from "../scripts/converter"
import { networkConfig } from "../utils/helper-config"
import Link from "next/link"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const casinoAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numTickets, setNumTickets] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [ticketsAmount, setTicketsAmount] = useState("0")
    const [ethUsdPrice, setEthUsdPrice] = useState("0")
    const [userEthBalance, setUserEthBalance] = useState("0")
    const [transactionSucceed, setTransactionSucceed] = useState(false)
    const [isTxPending, setIsTxPending] = useState(false)
    const [playerTickets, setPlayerTickets] = useState("0")
    const [contractBalance, setContractBalance] = useState("0")

    if (typeof window !== "undefined") {
        const ticketsInput = document.getElementById("tickets-amount") || null
        if (ticketsInput) {
            ticketsInput.oninput = () => {
                setTicketsAmount(ticketsInput.value)
            }
        }
    }

    const dispatch = useNotification()

    const {
        runContractFunction: enter,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "enter",
        params: {
            ticketsAmount: ticketsAmount,
        },
        msgValue: entranceFee * ticketsAmount,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfTickets } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "getNumberOfTickets",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getTicketsAmountByAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "getTicketsAmountByAddress",
        params: {
            player: account,
        },
    })

    const { runContractFunction: getContractBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: casinoAddress,
        functionName: "getContractBalance",
        params: {},
    })

    async function updateUI() {
        if (casinoAddress) {
            const ethUsdPriceFromAPI = (await convertEth()).toString()
            const entranceFeeFromCall = (await getEntranceFee()).toString()
            const numTicketsFromCall = (await getNumberOfTickets()).toString()
            const recentWinnerFromCall = (await getRecentWinner()).toString()
            const playerTicketsFromCall = (await getTicketsAmountByAddress()).toString()
            const contractBalanceFromCall = (await getContractBalance()).toString()
            setEthUsdPrice(ethUsdPriceFromAPI)
            setEntranceFee(entranceFeeFromCall)
            setNumTickets(numTicketsFromCall)
            setRecentWinner(recentWinnerFromCall)
            setPlayerTickets(playerTicketsFromCall)
            setContractBalance(contractBalanceFromCall)
        }
    }

    async function checkEthBalance(account) {
        let balance = await window.ethereum
            .request({ method: "eth_getBalance", params: [account] })
            .catch((error) => {
                console.log(error)
            })
        return balance
    }

    async function setBalance() {
        const ethBalanceFromMetamask = await checkEthBalance(account)
        setUserEthBalance(parseFloat(parseInt(ethBalanceFromMetamask) / 10 ** 18).toFixed(2))
    }

    async function setJackpot() {
        if (casinoAddress) {
            const contractBalanceFromCall = (await getContractBalance()).toString()
            setContractBalance(contractBalanceFromCall - contractBalanceFromCall * 0.05)
        }
    }

    useEffect(() => {
        if (account || (account && transactionSucceed)) {
            updateUI()
            setBalance()
            setJackpot()
        }
    }, [account, transactionSucceed, chainId])

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, chainId])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        setIsTxPending(false)
        updateUI()
        setTransactionSucceed(true)
    }

    const handleError = async function () {
        handleErrorNotification()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
        })
    }

    const handleErrorNotification = function () {
        dispatch({
            type: "info",
            message: "Sorry, something went wrong...",
            title: "Tx Notification",
            position: "topR",
            status: "warning",
        })
    }

    return (
        <div className="container mt-16 flex justify-between md:flex-col sm:mt-8">
            {casinoAddress ? (
                <>
                    <div className="flex flex-col">
                        <img
                            src="/svgs/buyTickets.svg"
                            alt="buy-ticket"
                            className="h-[150px] w-[400px] lg:h-[130px] lg:w-[200px] md:h-[100px] md:w-[160px] sm:mx-auto"
                        ></img>
                        <div className="flex justify-between rounded-[20px] border-4 border-light-coral p-4 lg:w-[500px] sm:w-auto sml:h-[150px]">
                            <input
                                type="number"
                                min="1"
                                id="tickets-amount"
                                className="border-none bg-inherit font-whyteInktrap text-5xl font-normal leading-[60px] text-misty-rose focus:ring-0 lg:text-3xl lg:leading-[40px] md:w-[200px] sml:w-[100px]"
                            />
                            <div className="flex flex-col gap-1">
                                <div className="text-right font-whyteInktrap text-4xl font-medium text-misty-rose lg:text-2xl">
                                    {parseFloat((entranceFee * ticketsAmount) / 10 ** 18).toFixed(
                                        3
                                    )}{" "}
                                    ETH
                                </div>
                                <div className="text-right font-whyteInktrap text-xl font-medium text-misty-rose lg:text-base">
                                    ~$
                                    {parseFloat(
                                        (entranceFee * ticketsAmount * ethUsdPrice) / 10 ** 18
                                    ).toFixed(2)}{" "}
                                </div>
                                <div className="text-right font-whyteInktrap text-xl font-medium text-misty-rose lg:text-base">
                                    your balance:{" "}
                                    {userEthBalance !== "NaN"
                                        ? userEthBalance
                                        : "no balance on this chain"}{" "}
                                    ETH
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between lg:justify-start sm:flex-col">
                            <button
                                className="mt-10 h-[70px] w-[300px] rounded-[20px] bg-coral-gradient text-center font-whyteInktrap text-4xl font-medium text-misty-rose md:h-[50px] md:w-[250px] md:text-2xl sm:mx-auto sm:mt-4"
                                onClick={async () => {
                                    const tx = await enter({
                                        onSuccess: handleSuccess,
                                        onError: handleError,
                                    })
                                    if (tx && chainId !== 31337 && window !== "undefined") {
                                        setIsTxPending(true)
                                        window.localStorage.setItem(
                                            "txLink",
                                            networkConfig[chainId]["checkTransaction"] + tx.hash
                                        )
                                    }
                                }}
                                disabled={isLoading || isFetching}
                            >
                                {isLoading || isFetching ? (
                                    <div className="spinner-border mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                                ) : (
                                    "buy"
                                )}
                            </button>
                            <div className="mt-10 font-whyteInktrap text-xl font-medium text-misty-rose lg:ml-6 lg:text-base md:ml-3 md:text-sm sm:mt-2 sm:ml-0 sm:text-center sm:text-sm sml:text-xs">
                                {typeof window !== "undefined" && isTxPending ? (
                                    <div>
                                        <p>Transaction is pending...</p>
                                        <a
                                            href={
                                                window.localStorage.getItem("txLink")
                                                    ? window.localStorage.getItem("txLink")
                                                    : "#"
                                            }
                                            target="_blank"
                                            className="underline"
                                        >
                                            See transaction on etherscan.com
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mt-10 font-whyteInktrap text-7xl font-medium text-misty-rose md:mt-6 md:text-4xl sm:text-3xl">{`your tickets -> ${playerTickets}`}</div>
                        <div className="mt-3 font-whyteInktrap text-xl font-medium text-misty-rose md:mt-2 md:text-sm">{`total number of tickets play -> ${numTickets}`}</div>
                        <div className="mt-3 font-whyteInktrap text-xl font-medium text-misty-rose md:mt-2 md:text-sm">
                            {`your rough chances to win % ->
                    ${
                        parseFloat((playerTickets / numTickets) * 100).toFixed(2) === "NaN"
                            ? "0"
                            : parseFloat((playerTickets / numTickets) * 100).toFixed(2)
                    }`}
                        </div>
                        <div className="text-shadow mt-7 font-whyteInktrap text-3xl font-medium text-misty-rose md:mt-4 md:text-xl sm:text-base sml:mt-3 sml:text-xs">
                            {`recent winner ->
                    ${
                        recentWinner !== "0x0000000000000000000000000000000000000000"
                            ? recentWinner
                            : "this is the fisrt era!"
                    }`}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <div className="mt-12 font-whyteInktrap text-7xl font-medium text-misty-rose lg:text-5xl sm:text-center sml:mt-3 sml:text-3xl">
                                jackpot
                            </div>
                            <div className="text-shadow mt-4 text-right font-whyteInktrap text-5xl font-medium text-misty-rose lg:mt-2 lg:text-3xl md:text-left sm:mt-2 sm:text-center sml:mt-1 sml:text-xl">
                                {parseFloat(contractBalance / 10 ** 18).toFixed(2)} ETH
                            </div>
                            <div className="text-shadow mt-4 text-right font-whyteInktrap text-3xl font-medium text-misty-rose lg:mt-2 lg:text-xl md:text-left sm:mt-2 sm:text-center sml:mt-1 sml:text-base">
                                ~$
                                {parseFloat((contractBalance / 10 ** 18) * ethUsdPrice).toFixed(2)}
                            </div>
                        </div>
                        <div className="text-shadow mt-4 text-right font-whyteInktrap text-5xl font-medium text-misty-rose underline lg:mt-2 lg:text-3xl md:text-left sm:mt-2 sm:hidden sm:text-center sml:mt-1 sml:text-xl">
                            <Link
                                href={{
                                    pathname: "/rules",
                                    query: { dynamic: "param" },
                                    hash: "hash",
                                }}
                            >
                                rules
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-shadow mt-4 text-right font-whyteInktrap text-3xl font-medium text-misty-rose">
                    Sorry, this network is not supported, please switch to Mainnet!
                </div>
            )}
        </div>
    )
}
