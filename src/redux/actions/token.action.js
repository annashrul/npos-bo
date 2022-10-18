import { TOKEN } from "./_constants"
// import axios from 'axios';


export function getToken(token) {
  return {
    type: TOKEN.GET,
    token
  }
}

export const gettingToken = () => {
  return (dispatch) => {

//     const secretkey = "56c8624d6a62e1ab22f0d9915ff2d43c"
// fetch(`https://api.tiket.com/apiv1/payexpress?method=getToken&secretkey=${secretkey}&output=json`)
//   .then(response => response.json())
//   .then(data => dispatch(getToken(data.token)))
    // axios.get(`https://api.tiket.com/apiv1/payexpress?method=getToken&secretkey=${secretkey}&output=json`)
    // .then(function (response) {
    //   dispatch(getToken(response.data.token))
    // })
    // .catch(function (error) {
    //   // handle error
    //   
    // })
  }
}