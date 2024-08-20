export const onRequestGet: PagesFunction<unknown, "uid"> = (ctx) => {
  return new Response(ctx.params.uid.toString())
}
