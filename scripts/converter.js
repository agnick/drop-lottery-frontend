const axios = require("axios")
const api_key = process.env.NEXT_PUBLIC_XRAPID_API_KEY
export default async function convertEth() {
    const options = {
        method: "GET",
        url: "https://coingecko.p.rapidapi.com/simple/price",
        params: { ids: "ethereum", vs_currencies: "usd" },
        headers: {
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": "coingecko.p.rapidapi.com",
        },
    }
    try {
        const response = await axios.request(options)
        return response.data.ethereum.usd
    } catch (error) {
        console.log(error)
    }
}
