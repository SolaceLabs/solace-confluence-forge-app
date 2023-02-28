import api, { route } from "@forge/api";

export const getCurrentUser = async () => {
  try {
    const response = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const user = await response.json();
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const registerUserEPToken = async (payload) => {
  let registeredToken = null;
  var bodyData = {
    "value": payload.token
  };
  await api.asUser().requestConfluence(route`/wiki/rest/api/user/${payload.accountId}/property/eptoken`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
    .then(async response => {
      if (response.status !== 201)
        return null;
      registeredToken = await getUserEPToken(payload.accountId);
      console.log('Token registered');
    })
    .catch(err => {
      console.log(err);
      return null;
    });

  return registeredToken;
}

export const updateUserEPToken = async (payload) => {
  let updatedToken = null;
  var bodyData = {
    "value": payload.token
  };

  
  await api.asUser().requestConfluence(route`/wiki/rest/api/user/${payload.accountId}/property/eptoken`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
    .then(async response => {
      if (response.status !== 204)
        return null;
      updatedToken = await getUserEPToken(payload.accountId);
      console.log('Token updated');
    })
    .catch(err => {
      console.log(err);
      return null;
    });

  return updatedToken;
}

export const getUserEPToken = async (accountId) => {  
  let token = null;
  await api.asUser().requestConfluence(route`/wiki/rest/api/user/${accountId}/property/eptoken`, {
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.status !== 200)
        return null;
      return response.text();
    })
    .then(text => {
      if (!text) {
        console.log('No token registered');
      } else {
        token = JSON.parse(text);
        console.log('Token found');
      }
    })
    .catch(err => {
      console.log(err);
    });

  return token;
}

export const deleteUserEPToken = async (accountId) => {  
  await api.asUser().requestConfluence(route`/wiki/rest/api/user/${accountId}/property/eptoken`, {
    method: 'DELETE',
  })
    .then(async response => {
      if (response.status !== 204)
        return false;
      console.log('Token deleted');
    })
    .catch(err => {
      console.log(err);
      return false;
    });

    return true;
}

// exports = {
//   getCurrentUser,
//   createUserEPToken,
//   updateUserEPToken,
//   getUserEPToken,
//   deleteUserEPToken
// }

