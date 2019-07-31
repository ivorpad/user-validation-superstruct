import { superstruct } from 'superstruct'
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const user = superstruct({
  types: {
    user_id: value => typeof value === 'number' ? true : 'must be a number',
    username: value => {
      if(value.length > 0 && value.length < 5) {
        return 'too short'
      }
      return typeof value === 'string'
    }
  }
})

const User = user({
  id: 'user_id',
  user: 'username',
})

const validUser = (data) => new Promise((resolve, reject) => {
  try {
    const user = User(data);
    //console.log(user)
    resolve(user)
  } catch(e) {
    const { message, path, data, type, value } = e;
    const [username] = path;
    reject(e)
  }
});

export {validUser, getCircularReplacer }