export interface CocoTag {
  url: string;
  name: string;
  slug: string;
}

export interface CocoImage {
	id: number;
	url: string; // api url
	name: string;
	tags: string;
	svg: string | null; // svg url
	svgContent: string | null;
	coloredSvg: string | null; // svg url
	coloredSvgContent: string | null;
	strokeColor: string | null;
	fillColor: string | null;
	gif: string | null; // git url
	coloredGif: string | null; // git url
}

export interface CocoImageList {
  count: number;
  next: string | null;
  previous: string | null;
  results: CocoImage[]
}

async function fetchGET(url: string): Promise<T> {
	try {
		const response = await fetch(
      url
    );
		if (!response.ok) {
			throw new Error(
				`Unable to Fetch Data, Please check URL
         or Network connectivity!!`
			);
		}
		return await response.json();
	} catch (error) {
		throw new Error(`Some Error Occured: ${error}`);
	}
}

export default {
  // Tags
  getTags: async () => await fetchGET<CocoTag>(
    `https://cocomaterial.com/api/tags/`
  ),
  // Vectors
  getLatestCocoImages: async (params: {page: int}) => await fetchGET<CocoImageList>(
    `https://cocomaterial.com/api/vectors/?page=${params.page}&page_size=39&ordering=-uploaded`
  ),
  getCocoImagesByTags: async (params: {tags: string, page: int}) => await fetchGET<CocoImageList>(
    `https://cocomaterial.com/api/vectors/?page=${params.page}&page_size=39&tags=${params.tags}`
  ),
  getCocoImagesBySimilarity: async (params: {similarity: string, page: int}) => await fetchGET<CocoImageList>(
    `https://cocomaterial.com/api/vectors/?page=${params.page}&page_size=39&similarity=${params.similarity}`
  ),
};
