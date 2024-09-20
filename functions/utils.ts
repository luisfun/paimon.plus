export const compress = (obj: object) =>
  new Response(new Blob([JSON.stringify(obj)]).stream().pipeThrough(new CompressionStream('deflate-raw'))).blob()

export const decompress = <T extends object = object>(blob: Blob): Promise<T> =>
  new Response(blob.stream().pipeThrough(new DecompressionStream('deflate-raw'))).json()

/*
const compressed = await compress({ a: 'hey!' })
const decompressed = await decompress(compressed)
*/
