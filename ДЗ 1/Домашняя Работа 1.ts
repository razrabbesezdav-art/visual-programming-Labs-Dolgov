//Задание 1
interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

function createUser(id: number, name: string, isActive: boolean = false, email?: string){
    const newUser: User = {id, name, email, isActive};

    return newUser;
}

//Задание 2
interface Book {
    title: string;
    author: string;
    year?: number;
    genre: 'fiction' | 'non-fiction';
}

function createBook (book : Book) : Book{
    return book;
}

//Задание 3
function calcArea(shape: 'circle', radius: number) : number;
function calcArea(shape: 'square', size: number) : number;

function calcArea(shape: 'circle' | 'square', ...params: number[]) : number{
    if(shape == 'circle'){
        const radius = params[0];
        return Math.PI * radius * radius;
    }else{
        const size = params[0];
        return size * size;
    }
}

//Задание 4
type Status = 'active' | 'inactive' | 'new'

function getStatusColor(status : Status) : string{
    if(status == 'active'){
        return 'green';
    }else if(status == 'inactive'){
        return 'yellow';
    }else{
        return 'red';
    }
}

//Задание 5
type stringFormater = (str : string, uppercase? : boolean) => string;

const capitalizeFirstLetter: stringFormater = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const trimAndMaybeUppercase: stringFormater = (str, uppercase = false) => {
  let result = str.trim();
  if (uppercase) {
    result = result.toUpperCase();
  }
  return result;
};

//Задание 6

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

//Задание 7
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}
