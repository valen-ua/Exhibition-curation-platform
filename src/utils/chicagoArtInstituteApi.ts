import axios from 'axios'

const baseURL = "https://api.artic.edu/api/v1"
const chicagoArtInstituteApi = axios.create({
    baseURL
})

export const fetchArtworksFromChicago = (page: number, limit: number) => {
    return chicagoArtInstituteApi.get(`/artworks?page=${page}&limit=${limit}`).then(({data}) => {
        console.log(data.data)
        return data.data

    })
}

export const chicagoSearchResults = (query: string) => {
    return chicagoArtInstituteApi.get(`/artworks/search?q=${query}`).then(({data}) => {
        console.log(data.data)
        return data.data
    })
   
}

export default chicagoArtInstituteApi