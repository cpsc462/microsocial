const { axios } = require('axios')

// library of user services intended for use within other services
// as an alternative to direct fetches
// convenient wrapper around axios

const {USERS_SERVICE} = require("./common")

// returns (err,user)
async function fetch_user(id) {
  axios.get(USERS_SERVICE(`/user/${id}`))
  .then( function (res) {
    return (null, res.data)
  } )
   .catch(function (error) {
    console.log({message: `Cannot retrieve user ${id} from Users service`, error})
    return (error,null)
  });
}

module.exports.fetch_user = fetch_user;
