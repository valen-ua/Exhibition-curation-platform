import axios from 'axios'

const baseURL = "https://api.wellcomecollection.org/catalogue/v2"
const wellcomeCollectionApi = axios.create({
    baseURL
})

export const fetchArtworks = (page: number, limit: 10) => {
    return wellcomeCollectionApi.get(`/images?limit=${limit}&page=${page}`).then(({data}) => {
        console.log(data.results)
        return data.results

    })
}

export const wellcomeSearchResults = (query: string) => {
    return wellcomeCollectionApi.get(`/images?query=${query}`).then(({data}) => {
        console.log(data.results)
        return data.results
    })
}

export const fetchWellcomeIndividualArtwork = (artworkId: string) => {
    console.log("artworkId passed to fetchWellcomeIndividualArtwork:", artworkId);
    return axios.get(`https://api.wellcomecollection.org/catalogue/v2/images/${artworkId}`).then(({data}) => {
      console.log("API response:", data);
      return data;
    });
  };

export default wellcomeCollectionApi