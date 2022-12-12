const fs = require("fs")

export default async function writeData(req, res) {
    if (req.method === "POST") {
        fs.writeFileSync("./constants/fireDate.json", JSON.stringify(req.body))
        return res.status(200).json({})
    }
}
