import * as sharp from "sharp";
import * as fs from "fs";
import { Square } from "@hackforplay/next";

type TileTypes =
  | "Nope"
  | "Ground"
  | "Wall"
  | "Road"
  | "Rug"
  | "Barrier"
  | "Float"
  | "Sky";

const tileTokenMap: { [key: string]: TileTypes } = {
  N: "Nope",
  G: "Ground",
  W: "Wall",
  R: "Road",
  U: "Rug",
  B: "Barrier",
  F: "Float",
  S: "Sky"
};

export default async function generate(inputFile: string, settingFile: string) {
  const size = 32;
  const promises = [];
  let indexCounter = 1000;

  const setting = fs.readFileSync(settingFile, { encoding: "utf8" });

  const input = sharp(inputFile);
  const { width, height } = await input.clone().metadata();
  if (!width) throw new Error("Image width is undefined or zero");
  if (!height) throw new Error("Image height is undefined or zero");
  // from 16x16 into 32x32
  const source = await input.clone().resize(width * 2, height * 2, {
    kernel: "nearest"
  });

  for (const settingRow of setting.split("\n")) {
    const [rowValue, ...tileTypes] = settingRow.split("\t");
    const row = parseInt(rowValue);

    for (const [column, token] of tileTypes.entries()) {
      const type = tileTokenMap[token];

      if (type === "Nope") continue; // Nope
      // トリミングと拡大
      const index = indexCounter++;
      const tileSize: [number, number] = [size, size];
      const imageType: "data-url" = "data-url";
      const promise: Promise<Square> = source
        .clone()
        .extract({
          left: column * size,
          top: row * size,
          width: size,
          height: size
        })
        .toBuffer()
        .then(buffer => ({
          index,
          placement: {
            type
          },
          tile: {
            size: tileSize,
            image: {
              type: imageType,
              src: `data:image/png;base64,${buffer.toString("base64")}`
            },
            author: {
              name: "ぴぽや",
              url: "http://blog.pipoya.net/"
            }
          }
        }));

      promises.push(promise);
    }
  }

  const tileSets = await Promise.all(promises);
  return JSON.stringify({ tileSets }, null, 2);
}
