import axios from 'axios'

const baseURL = "https://api.wellcomecollection.org/catalogue/v2/"
const wellcomeCollectionApi = axios.create({
    baseURL
})

export const fetchArtworks = (page: number, limit: 10) => {
    return wellcomeCollectionApi.get(`/images?limit=${limit}&page=${page}`).then(({data}) => {
        return data.results

    })
}

export default wellcomeCollectionApi