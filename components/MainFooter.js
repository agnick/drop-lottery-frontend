import Link from "next/link"

export default function MainFooter() {
    return (
        <footer className="invisible absolute inset-x-0 bottom-0 mx-[10px] mb-6 flex justify-between sm:visible ">
            <div className="flex gap-1">
                <a href="https://web.telegram.org/k/">
                    <img
                        src="/svgs/telegramIcon.svg"
                        alt="telegram"
                        className="h-[30px] w-[30px]"
                    ></img>
                </a>
                <a href="https://github.com/agnick">
                    <img src="/svgs/gitIcon.svg" alt="github" className="h-[30px] w-[30px]"></img>
                </a>
            </div>
            <div>
                <p className="p-2 font-whyteInktrap text-sm text-misty-rose">Powered by Ethereum</p>
                <div className="text-shadow pr-2 text-right font-whyteInktrap text-sm  text-misty-rose underline">
                    <Link
                        href={{
                            pathname: "/rules",
                            query: { dynamic: "rules" },
                            hash: "hash",
                        }}
                    >
                        rules
                    </Link>
                </div>
            </div>
        </footer>
    )
}
