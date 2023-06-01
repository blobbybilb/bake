function bake(
  config: {
    server: string
    paths: string[]
    outputDir: string
    copyStatic: boolean
  },
) {
  config.server = (config.server.endsWith("/"))
    ? config.server.slice(0, -1)
    : config.server

  config.outputDir = (config.outputDir.endsWith("/"))
    ? config.outputDir.slice(0, -1)
    : config.outputDir

  console.log(config)

  //   if (config.outputDir.startsWith("/")) {
  //     throw new Error("outputDir must be a relative path")
  //   }

  //   Deno.removeSync(config.outputDir, { recursive: true })
  Deno.mkdirSync(config.outputDir, { recursive: true })

  for (let path of config.paths) {
    path = path.startsWith("/") ? path : "/" + path
    path = path.endsWith("/") ? path.slice(0, -1) : path
    savePage(config.server + path, config.outputDir + path)
  }
}

async function savePage(url: string, path: string) {
  const respBody = await (await fetch(url)).text()
  await Deno.writeFile(path + "/index.html", new TextEncoder().encode(respBody))
}

bake({
  server: "http://localhost:8000/",
  paths: ["/"],
  outputDir: "output",
  copyStatic: true,
})

export default { bake }
