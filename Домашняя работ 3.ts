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
        }
        rowobject[keys[keyIndex]] = processValue(currentWord)
        answer.push(rowobject);
    }
    return answer;
}

const result = csvToJSON(["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"], ";");
console.table(result);