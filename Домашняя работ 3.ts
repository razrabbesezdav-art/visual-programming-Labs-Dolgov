import { readFile, writeFile } from 'node:fs/promises';
function processValue(val: string): string | number {
    if (val === "") return "";
    let num = Number(val);
    return isNaN(num) ? val : num;
}

function csvToJSON(input: string[], delimiter: string){
    let keys: string[] = [];
    let number_of_key: number = 0;
    keys[0] = "";
    for (let i: number = 0; i < input[0].length; i++){
        if (input[0][i] === delimiter){
            number_of_key++;
            keys[number_of_key]="";
        }else{
            keys[number_of_key] += input[0][i]; 
        }
    }
    let answer: any[] = [];
    for (let i: number = 1; i<input.length; i++){
        let rowobject: Record<string, any> = {};
        let currentWord = "";
        let keyIndex = 0;

        for (let j = 0; j < input[i].length; j++){
            if(input[i][j] === delimiter){
                rowobject[keys[keyIndex]] = processValue(currentWord);
                currentWord = "";
                keyIndex++;
            }else{
                currentWord += input[i][j];
            }
            if (keyIndex >= keys.length && input[i] != null){
                throw new Error("Error");
            }
        }
        rowobject[keys[keyIndex]] = processValue(currentWord)
        answer.push(rowobject);
    }
    return answer;
}

async function  formatCSVFileToJSONFile(input: string, output: string, delimiter: string): Promise<void> {
    try{
        const fileContent = await readFile(input, 'utf-8');
         let lines: string[] = [];
         let currentLineIndex = 0;
         lines[0] = "";

        for(let i = 0; i < fileContent.length; i++){
            if(fileContent[i] === '\n'){
                currentLineIndex ++;
                lines[currentLineIndex] = "";
            }else if(fileContent[i] !== '\n'){
                lines[currentLineIndex] += fileContent[i];
            }
        }

        if(lines[lines.length - 1] === ""){
            lines.pop()
        }

        const jsonResult = csvToJSON(lines, delimiter);

        await writeFile(output, JSON.stringify(jsonResult, null, 2));
    } catch (error){
        throw new Error("Error");
    }
}

