import axios from 'axios'

const baseURL = "https://api.wellcomecollection.org/catalogue/v2/"
const wellcomeCollectionApi = axios.create({
    baseURL
})

export const fetchArtworks = () => {
    return wellcomeCollectionApi.get("/works").then(({data}) => {
        console.log(data.results)
        return data.results

    })
}

export default wellcomeCollectionApi