
async function getData() {
    const data = await fetch("../../data.json");
    const response = await data.json()
    return response
}

const data = await getData()

console.log(data)