import type { CocoTag, CocoImageList } from './model'

async function fetchGET<T>(url: string): Promise<T> {
  try {
    const response = await fetch(`https://cocomaterial.com/api/${url}`)
    if (!response.ok) {
      throw new Error(
        `Unable to Fetch Data, Please check URL
         or Network connectivity!!`,
      )
    }
    return await response.json()
  } catch (error) {
    throw new Error(`Some Error Occured: ${error}`)
  }
}

export default {
  // Tags
  getTags: async () => await fetchGET<CocoTag>(`tags`),
  // Vectors
  getLatestCocoImages: async (params: { page: number }) =>
    await fetchGET<CocoImageList>(`vectors/?page=${params.page}&page_size=39&ordering=-uploaded`),
  getCocoImagesByTags: async (params: { tags: string; page: number }) =>
    await fetchGET<CocoImageList>(`vectors/?page=${params.page}&page_size=39&tags=${params.tags}`),
  getCocoImagesBySimilarity: async (params: { similarity: string; page: number }) =>
    await fetchGET<CocoImageList>(
      `vectors/?page=${params.page}&page_size=39&similarity=${params.similarity}`,
    ),
}
