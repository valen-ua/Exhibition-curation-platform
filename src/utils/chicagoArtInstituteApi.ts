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

export const fetchChicagoIndividualArtwork = (artworkId: string) => {
    console.log("artworkId passed to fetchChicagoIndividualArtwork:", artworkId);
    return axios.get(`https://api.artic.edu/api/v1/artworks/${artworkId}`).then(({data}) => {
        console.log(data)
        return data
    })
}

export default chicagoArtInstituteApi