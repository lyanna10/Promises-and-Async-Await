const central = async (id) => {
  return Promise.resolve(`db${id % 3 + 1}`);
};

const dbs = {
  db1: async (id) => {
    const data = {
      username: `user${id}`,
      website: `https://example.com/user${id}`,
      company: {
        name: `Company ${id}`,
        catchPhrase: `Catch phrase ${id}`,
        bs: `BS ${id}`,
      },
    };
    return Promise.resolve(data);
  },
  db2: async (id) => {
    const data = {
      username: `user${id}`,
      website: `https://example.com/user${id}`,
      company: {
        name: `Company ${id}`,
        catchPhrase: `Catch phrase ${id}`,
        bs: `BS ${id}`,
      },
    };
    return Promise.resolve(data);
  },
  db3: async (id) => {
    const data = {
      username: `user${id}`,
      website: `https://example.com/user${id}`,
      company: {
        name: `Company ${id}`,
        catchPhrase: `Catch phrase ${id}`,
        bs: `BS ${id}`,
      },
    };
    return Promise.resolve(data);
  },
};

const vault = async (id) => {
  const data = {
    name: `User ${id}`,
    email: `user${id}@example.com`,
    address: {
      street: `Street ${id}`,
      suite: `Suite ${id}`,
      city: `City ${id}`,
      zipcode: `Zip ${id}`,
      geo: {
        lat: `Lat ${id}`,
        lng: `Lng ${id}`,
      },
    },
    phone: `Phone ${id}`,
  };
  return Promise.resolve(data);
};

const fetchUser = async (id) => {
  if (id < 1 || id > 10) {
    throw new Error(`Invalid user ID: ${id}`);
  }

  const dbToAccess = await central(id); 

  if (!dbs.hasOwnProperty(dbToAccess)) {
    throw new Error(`Invalid database identifier: ${dbToAccess}`);
  }

  const basicInfoPromise = dbs[dbToAccess](id); 
  const personalInfoPromise = vault(id); 

  try {
    const [basicInfo, personalInfo] = await Promise.all([
      basicInfoPromise,
      personalInfoPromise,
    ]);

    const user = {
      id,
      name: personalInfo.name,
      username: basicInfo.username,
      email: personalInfo.email,
      address: personalInfo.address,
      phone: personalInfo.phone,
      website: basicInfo.website,
      company: basicInfo.company,
    };

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};


const testFetchUser = async () => {
  try {
    for (let id = 1; id <= 10; id++) {
      const user = await fetchUser(id);
      console.log(user);
    }

    const invalidIds = [0, 11, 100, -5];
    for (const id of invalidIds) {
      try {
        const user = await fetchUser(id);
        console.log(user);
      } catch (error) {
        console.log(error.message);
      }
    }

    const invalidTypes = ['user', true, false];
    for (const id of invalidTypes) {
      try {
        const user = await fetchUser(id);
        console.log(user);
      } catch (error) {
        console.log(error.message);
      }

    }
  } catch (error) {
    console.log(error);
  }
};

testFetchUser();

/**Here's the scenario: you are a developer in a very large corporation that splits its data across multiple databases. Your job is to assemble this information into a single function that takes an id parameter and returns a promise with a user object as data.

The object must contain all of the following information:

{
    id: number,
    name: string,
    username: string,
    email: string,
    address: {
      street: string,
      suite: string,
      city: string,
      zipcode: string,
      geo: {
        lat: string,
        lng: string
      }
    },
    phone: string,
    website: string,
    company: {
      name: string,
      catchPhrase: string,
      bs: string
    }
}
This information, however, is stored in many different databases, as follows.

For the purposes of this lab, you do not need to understand how the databases work behind the scenes. However, they have been included in the CodeSandbox under the file "databases.js." After the lesson on AJAX and data fetching, which will introduce you to working with external APIs, feel free to return to this lab and examine how things work in the background. This lab serves as a bridge between these two concepts.

central: There are too many users to store in a single database, so the central database identifies which database the users are stored within. The central database will return a string that identifies which database to access for that particular user's information. You can access the central database like so:

const returnedValue = await central(id);
// or
central(id).then((returnedValue) => { ... });
While we are pretending we have a massive database of users, in reality there are only ten user values. As such, you should test your function using id arguments between 1 and 10 (inclusive). Test values outside of this range for error cases!

db1, db2, and db3: These databases contain the user's basic information, including username, website, and company. Accessing these databases will return an object with these properties. If one of these databases encounters an error, your function should return a rejected promise indicating which database failed. You can access these databases like so:

const returnedValue = await db1(id);
// or
db1(id).then((returnedValue) => { ... });
As a small hint, we've included a dbs object within the CodeSandbox that will allow you to access the db databases directly from the string returned from central by using bracket notation, e.g. dbs[valueReturnedFromCentral](id), which can circumvent some if/else logic.

vault: The personal data for each user is contained within the vault database, since its access and usage is restricted by law. The vault will return an object with the user's name, email, address, and phone, and can be accessed like so:

const returnedValue = await vault(id);
// or
vault(id).then((returnedValue) => { ... });
You should also make use of Promise.all to handle some of these requests concurrently. Imagine that each database takes 100ms to complete a request, but our function must complete in 200ms or less. There are three databases, so how would we handle that? Remember that promises only need to be sequential if they depend on the previous promises' results.

You can choose to tackle this problem using either promise chaining with then() and catch(), or with async/await; both are valid approaches. As an added challenge, try to refactor your code into the opposite solution if you have enough time, and save both versions.

When complete, test your code thoroughly by passing it many different values for id:

Valid numbers, 1 through 10.
Invalid numbers, 0- and 11+.
Invalid data types, strings and booleans.
 */
     