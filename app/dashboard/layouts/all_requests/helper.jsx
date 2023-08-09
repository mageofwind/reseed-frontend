const fixText = (text) => text.replaceAll("_", " ")

const verifyArrJson = (data) => {
    if (Array.isArray(data)) return "array"
    if (typeof data === "object" && data !== null) return "object"
    return "any"
}

const getCategories = (data) => {
    //console.log("data", data)
    let verify = verifyArrJson(data)
    //console.log("dog", verify)

    if (verify === "array") return data
    if (verify === "object") return Object.keys(data)
    if (verify === "any") return []
}

const Helper = {
    getCategories, verifyArrJson, fixText
}
export default Helper