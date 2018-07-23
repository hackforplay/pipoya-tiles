import * as fs from "fs";
import generate from ".";

console.time("finish");

generate("./input/base.png", "./input/setting.csv").then(json => {
  fs.writeFileSync("./output/tileset.json", json);
  console.timeEnd("finish");
});
