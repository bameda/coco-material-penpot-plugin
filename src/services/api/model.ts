export interface CocoTag {
  url: string
  name: string
  slug: string
}

export interface CocoImage {
  id: number
  url: string // api url
  name: string
  tags: string
  svg: string | null // svg url
  svgContent: string | null
  coloredSvg: string | null // svg url
  coloredSvgContent: string | null
  strokeColor: string | null
  fillColor: string | null
  gif: string | null // git url
  coloredGif: string | null // git url
}

export interface CocoImageList {
  count: number
  next: string | null
  previous: string | null
  results: CocoImage[]
}
