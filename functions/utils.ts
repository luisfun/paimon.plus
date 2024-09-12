export const compress = (obj: object | Response) => {
  const readableStream = obj instanceof Response ? obj.body : new Blob([JSON.stringify(obj)]).stream()
  if (!readableStream) return new Blob()
  return new Response(readableStream.pipeThrough(new CompressionStream('deflate-raw'))).blob()
}

export const decompress = <T extends object = object>(blob: Blob): Promise<T> =>
  new Response(blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))).json()

export const ResponseOctet = class extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, { ...init, headers: { ...init?.headers, 'Content-Type': 'application/octet-stream' } })
  }
}

/*
const compressed = await compress({ a: 'hey!' })
const decompressed = await decompress(compressed)

const compressedResponse = await compress(new Response('hey!'))
const sendResponse = new ResponseOctet(compressedResponse)
*/
