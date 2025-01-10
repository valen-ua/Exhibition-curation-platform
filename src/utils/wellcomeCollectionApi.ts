import axios from 'axios'

const baseURL = "https://api.wellcomecollection.org/catalogue/v2/"
const wellcomeCollectionApi = axios.create({
    baseURL
})

export const fetchArtworks = () => {
    return wellcomeCollectionApi.get("/images").then(({data}) => {
        return data.results

    })
}

export default wellcomeCollectionApi