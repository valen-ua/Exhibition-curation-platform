import axios from 'axios'

const baseURL = "https://api.artic.edu/api/v1"
const chicagoArtInstituteApi = axios.create({
    baseURL
})

export const fetchArtworksFromChicago = () => {
    return chicagoArtInstituteApi.get("/artworks").then(({data}) => {
        return data.data

    })
}

export default chicagoArtInstituteApi