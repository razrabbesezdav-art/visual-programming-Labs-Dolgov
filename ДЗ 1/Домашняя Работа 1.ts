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

const user: User = createUser(1, "Vlad", "e@email.com", true);

console.log(user.id, user.name, user.email, user.isActive);

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

const book1: Book = createBook({title: "Tales", author: "Unknown", year: 1900, genre :'fiction'});

console.log(book1)

const book2: Book = createBook({title: "Tales", author: "Unknown", genre :'non-fiction'});

console.log(book2)

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

const area1 : number = calcArea("circle", 2);

console.log(area1);

const area2 : number = calcArea('square', 2);

console.log(area2);

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

const status1 : string = getStatusColor('active');

console.log(status1);

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

console.log(capitalizeFirstLetter("hello world"));
console.log(trimAndMaybeUppercase("Hello World"));
console.log(trimAndMaybeUppercase("Hello World", true));

//Задание 6

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

const numbers = [10, 20, 30];
const firstNumber = getFirstElement(numbers);
console.log(`First number: ${firstNumber}`);

const strings = ["apple", "banana", "cherry"];
const firstString = getFirstElement(strings);
console.log(`First string: ${firstString}`);

const emptyArr: number[] = [];
const firstOfEmpty = getFirstElement(emptyArr);
console.log(`First of empty array: ${firstOfEmpty}`);


//Задание 7
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}


const users: User[] = [
  createUser(1, "Alice", "3", true),
  createUser(2, "Bob", "2", true),
  createUser(3, "Charlie", "1", true)
];

const foundUser = findById(users, 2);
console.log(`Found user: ${foundUser?.name}`);

const notFoundUser = findById(users, 99);
console.log(`Found user with id 99: ${notFoundUser}`);


