import api, { fetch } from '@forge/api';

const invokeEventPortalAPI = async (token, method, endpoint, data = {}) => {
  try {
    if (!token || !method || !endpoint) {
      throw new Error('You must pass a SolaceCloud Token, method, and endpoint')
    };
    const url = `https://api.solace.cloud/api/v2/architecture/${endpoint}`;
    console.log('In EP API URL - ', method, endpoint, url);
    const response = await api.fetch(url, {
      method,
      body: data,
      headers: {
        Authorization: `Bearer ${
          token
        }`
      }
    });
    // console.log('In EP API Response JSON- ', response.status, response.statusText);
    // console.log('DEBUG: ', response);
    if (response.status !== 200)
      throw new Error(response.statusText);

    return response.json()
  } catch (error) {
    console.log('In EP API Error - ', error, ' - ', error.message, ' - ', error.errorId, ' - ', error.toString());
    return {
      status: false,
      error: error.toString(),
      method, 
      endpoint,
      meta: {},
      data: []
    }
  }
}

/**
* Retrieve a list of application domains that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of application domains to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {String} params.name Name to be used to match the application domain
* @param {Array.<String>} params.ids Match only application domains with the given IDs separated by commas.
* @param {Array.<String>} params.include Specify extra data to be included, options are: stats
* @returns {Object} ApplicationDomainsResponse
*/  
export const getApplicationDomains = async (token, params=null) => {
  try {
    console.log(`Fetching getApplicationDomains`)
    let endpoint = `applicationDomains`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}

/**
* Retrieve a single application domain by its ID
* @param {String} The ID of the application domain object
* @returns {Object} ApplicationDomainResponse
*/  
export const getApplicationDomainByID = async (token, domainId, params=null) => {
  try {
    console.log(`Fetching getApplicationDomainByID`)
    let endpoint = `applicationDomains/${domainId}`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Get Application Domain Name.
* @param  {String} domainID - Application DomainID.
*/
export const getApplicationDomainName = async (token, domainId, params=null) => {
  try {
    console.log(`Fetching getApplicationDomainName`)
    let endpoint = `applicationDomains/${domainId}`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response?.data.name;
  } catch (error) {
    throw new Error(error)
  }
}

/**
* Retrieve a list of applications that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of applications to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {String} params.name Name of the application to match on.
* @param {String} params.applicationDomainId Match only applications in the given application domain.
* @param {Array.<String>} params.ids Match only applications with the given IDs separated by commas.
* @param {String} params.applicationType Match only applications with the given applicationType.
* @param {String} params.sort 
* @returns {Object} ApplicationsResponse
*/  
export const getApplications = async (token, params=null) => {
  try {
    console.log(`Fetching getApplications`)
    let endpoint = `applications`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}

/**
* Retrieve a single application by its ID
* @param {String} applicationId The ID of the application object
* @returns {Object} ApplicationResponse
*/  
export const getApplicationByID = async (token, applicationId) => {
  try {
    console.log(`Fetching getApplicationByID`)
    let endpoint = `applications/${applicationId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of application versions that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of application versions to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @returns {Object} ApplicationVersionResponse
*/  
export const getApplicationVersions = async (token, params=null) => {
  try {
    console.log(`Fetching getApplicationVersions`)
    let endpoint = `applicationVersions`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}

/**
* Retrieve a single application version by its ID
* @param {String} applicationId The ID of the application object
* @returns {Object} ApplicationVersionResponse
*/  
export const getApplicationVersionByID = async (token, versionId) => {
  try {
    console.log(`Fetching getApplicationVersionByID`)
    let endpoint = `applicationVersions/${versionId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
      return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of events that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of events to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {String} params.name Name of the event to match on.
* @param {Boolean} params.shared Match only with shared or unshared events
* @param {String} params.applicationDomainId Match only events in the given application domain
* @param {Array.<String>} params.applicationDomainIds Match only events in the given application domain ids
* @param {Array.<String>} params.ids Match only events with the given IDs separated by commas
* @param {String} params.sort 
* @returns {Object} EventsResponse
*/  
export const getEvents = async (token, params=null) => {
  try {
    console.log(`Fetching getEvents`)
    let endpoint = `events`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single event by its ID
* @param {String} eventId The ID of the event object
* @returns {Object} EventResponse
*/  
export const getEventByID = async (token, eventId) => {
  try {
    console.log(`Fetching getEventByID`)
    let endpoint = `events/${eventId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of event versions that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of events to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {Array.<String>} params.ids Match only event versions with the given IDs separated by commas
* @returns {Object} EventVersionsResponse
*/  
export const getEventVersions = async (token, params=null) => {
  try {
    console.log(`Fetching getEventVersions`)
    let endpoint = `eventVersions`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single event version by its ID
* @param {String} versionId The ID of the event version object
* @returns {Object} EventVersionResponse
*/  
export const getEventVersionByID = async (token, versionId, params=null) => {
  try {
    console.log(`Fetching getEventVersionByID`)
    let endpoint = `eventVersions/${versionId}`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of schemas that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of schemas to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {String} params.name Name of the schema to match on.
* @param {Boolean} params.shared Match only with shared or unshared schemas
* @param {String} params.applicationDomainId Match only schemas in the given application domain
* @param {Array.<String>} params.applicationDomainIds Match only schemas with the given IDs separated by commas.
* @param {Array.<String>} params.ids Match only schemas with the given IDs separated by commas
* @param {String} params.sort 
* @returns {Object} SchemasResponse
*/  
export const getSchemas = async (token, params=null) => {
  try {
    console.log(`Fetching getSchemas`)
    let endpoint = `schemas`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single schema by its ID
* @param {String} The ID of the schema object
* @returns {Object} SchemaResponse
*/  
export const getSchemaByID = async (token, schemaId) => {
  try {
    console.log(`Fetching getSchemaByID`)
    let endpoint = `schemas/${schemaId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single schema version by its ID.
* @param {String} versionId The ID of the schema version object.
* @returns {Object} SchemaVersionResponse
*/  
export const getSchemaVersionByID = async (token, versionId) => {
  try {
    console.log(`Fetching getSchemaVersionByID`)
    let endpoint = `schemaVersions/${versionId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of schema versions that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of schemas to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {Array.<String>} params.ids Match only schema versions with the given IDs separated by commas
* @returns {Object} SchemaVersionsResponse
*/  
export const getSchemaVersions = async (token, params=null) => {
  try {
    console.log(`Fetching getSchemaVersions`)
    let endpoint = `schemaVersions`;
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}


/**
 * Retrieve a list of enums that match the given parameters
 * @param {Object} params Optional parameters
 * @param {Number} params.pageSize The number of enums to get per page. Min: 1 Max: 100 (default to 20)
 * @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
 * @param {String} params.name Name of the enum to match on.
 * @param {Boolean} params.shared Match only with shared or unshared enums
 * @param {String} params.applicationDomainId Match only enums in the given application domain
 * @param {Array.<String>} params.applicationDomainIds Match only enums with the given IDs separated by commas.
 * @param {Array.<String>} params.ids Match only enums with the given IDs separated by commas
 * @param {String} params.sort 
 * @returns {Object} EnumsResponse
 */  
export const getEnums = async (token, params=null) => {
  try {
    console.log(`Fetching getEnums`)
    let endpoint = `enums`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single enum by its ID
* @param {String} The ID of the enum object
* @returns {Object} EnumResponse
*/  
export const getEnumByID = async (token, enumId) => {
  try {
    console.log(`Fetching getEnumByID`)
    let endpoint = `enums/${enumId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single enum version by its ID.
* @param {String} versionId The ID of the enum version object.
* @returns {Object} EnumVersionResponse
*/  
export const getEnumVersionByID = async (token, versionId) => {
  try {
    console.log(`Fetching getEnumVersionByID`)
    let endpoint = `enumVersions/${versionId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of enum versions that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of enums to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {Array.<String>} params.ids Match only enum versions with the given IDs separated by commas
* @returns {Object} EnumVersionsResponse
*/  
export const getEnumVersions = async (token, params=null) => {
  try {
    console.log(`Fetching getEnumVersions`)
    let endpoint = `enumVersions`;
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Retrieve a list of eventApis that match the given parameters
 * @param {Object} params Optional parameters
 * @param {Number} params.pageSize The number of eventApis to get per page. Min: 1 Max: 100 (default to 20)
 * @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
 * @param {String} params.name Name of the eventApi to match on.
 * @param {Boolean} params.shared Match only with shared or unshared eventApis
 * @param {String} params.applicationDomainId Match only eventApis in the given application domain
 * @param {Array.<String>} params.applicationDomainIds Match only eventApis with the given IDs separated by commas.
 * @param {Array.<String>} params.ids Match only eventApis with the given IDs separated by commas
 * @param {String} params.sort 
 * @returns {Object} EventApisResponse
 */  
export const getEventApis = async (token, params=null) => {
  try {
    console.log(`Fetching getEventApis`)
    let endpoint = `eventApis`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single eventApi by its ID
* @param {String} The ID of the eventApi object
* @returns {Object} EventApiResponse
*/  
export const getEventApiByID = async (token, eventApiId) => {
  try {
    console.log(`Fetching getEventApiByID`)
    let endpoint = `eventApis/${eventApiId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single eventApi version by its ID.
* @param {String} versionId The ID of the eventApi version object.
* @returns {Object} EventApiVersionResponse
*/  
export const getEventApiVersionByID = async (token, versionId) => {
  try {
    console.log(`Fetching getEventApiVersionByID`)
    let endpoint = `eventApiVersions/${versionId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of eventApi versions that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of eventApis to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {Array.<String>} params.ids Match only eventApi versions with the given IDs separated by commas
* @returns {Object} EventApiVersionsResponse
*/  
export const getEventApiVersions = async (token, params=null) => {
  try {
    console.log(`Fetching getEventApiVersions`)
    let endpoint = `eventApiVersions`;
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}


/**
 * Retrieve a list of eventApiProducts that match the given parameters
 * @param {Object} params Optional parameters
 * @param {Number} params.pageSize The number of eventApiProducts to get per page. Min: 1 Max: 100 (default to 20)
 * @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
 * @param {String} params.name Name of the eventApiProduct to match on.
 * @param {Boolean} params.shared Match only with shared or unshared eventApiProducts
 * @param {String} params.applicationDomainId Match only eventApiProducts in the given application domain
 * @param {Array.<String>} params.applicationDomainIds Match only eventApiProducts with the given IDs separated by commas.
 * @param {Array.<String>} params.ids Match only eventApiProducts with the given IDs separated by commas
 * @param {String} params.sort 
 * @returns {Object} EventApiProductsResponse
 */  
export const getEventApiProducts = async (token, params=null) => {
  try {
    console.log(`Fetching getEventApiProducts`, params)
    let endpoint = `eventApiProducts`
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single eventApiProduct by its ID
* @param {String} The ID of the eventApiProduct object
* @returns {Object} EventApiProductResponse
*/  
export const getEventApiProductByID = async (token, eventApiProductId) => {
  try {
    console.log(`Fetching getEventApiProductByID`)
    let endpoint = `eventApiProducts/${eventApiProductId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a single eventApiProduct version by its ID.
* @param {String} versionId The ID of the eventApiProduct version object.
* @returns {Object} EventApiProductVersionResponse
*/  
export const getEventApiProductVersionByID = async (token, versionId) => {
  try {
    console.log(`Fetching getEventApiProductVersionByID`)
    let endpoint = `eventApiProductVersions/${versionId}`
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}  

/**
* Retrieve a list of eventApiProduct versions that match the given parameters
* @param {Object} params Optional parameters
* @param {Number} params.pageSize The number of eventApiProducts to get per page. Min: 1 Max: 100 (default to 20)
* @param {Number} params.pageNumber The page number to get. Min: 1 (default to 1)
* @param {Array.<String>} params.ids Match only eventApiProduct versions with the given IDs separated by commas
* @returns {Object} EventApiProductVersionsResponse
*/  
export const getEventApiProductVersions = async (token, params=null) => {
  try {
    console.log(`Fetching getEventApiProductVersions`)
    let endpoint = `eventApiProductVersions`;
    endpoint = endpoint + (params ? `?${params}` : '');
    const response = await invokeEventPortalAPI(token, 'GET', endpoint, null)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}