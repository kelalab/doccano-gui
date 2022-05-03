import * as csv from 'csvtojson';
import { readFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import unzipper from 'unzipper';

const __dirname = dirname(fileURLToPath(import.meta.url));
let _csv = csv.default;

export const readCSV = async () => {
  const json = await _csv({
    delimiter: ';',
  }).fromFile(path.join(__dirname, 'luokiteltavat_lauseet-v2.csv'));
  return json;
};

export const readZip = async (password) => {
  try {
    const directory = await unzipper.Open.file('luokiteltavat_lauseet-v2.zip');
    const extracted = await directory.files[0].buffer(password);
    const json = await _csv({ delimiter: ';' }).fromString(
      extracted.toString(),
    );
    return json;
  } catch (e) {
    console.log(e);
  }
};

export default readCSV;
