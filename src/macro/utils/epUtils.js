const {
  getApplicationDomains,
  getApplicationDomainByID,
  getApplicationDomainName,
  getApplications,
  getApplicationByID,
  getApplicationVersions,
  getApplicationVersionByID,
  getEvents,
  getEventByID,
  getEventVersions,
  getEventVersionByID,
  getSchemas,
  getSchemaByID,
  getSchemaVersionByID,
  getSchemaVersions,
  getEnums,
  getEnumByID,
  getEnumVersionByID,
  getEnumVersions,
  getEventApis,
  getEventApiByID,
  getEventApiVersionByID,
  getEventApiVersions,
  getEventApiProducts,
  getEventApiProductByID,
  getEventApiProductVersionByID,
  getEventApiProductVersions
} = require('./eventPortal');

const {
  buildDomainBlocks,
  buildApplicationBlocks,
  buildApplicationVersionBlocks,
  buildEventBlocks,
  buildEventVersionBlocks,
  buildSchemaBlocks,
  buildSchemaVersionBlocks,
  buildEnumBlocks,
  buildEnumVersionBlocks,
  buildEventApiBlocks,
  buildEventApiVersionBlocks,
  buildEventApiProductBlocks,
  buildEventApiProductVersionBlocks
} = require('./buildBlocks');

const isSolaceURL = (url) => {
  const regex = /https:\/\/(.*)\.solace\.cloud\/ep\/designer(($|\/domains$|\/domains\/[a-zA-Z0-9]*$)|(\/domains\/[a-zA-Z0-9]*\/applications$|\/domains\/[a-zA-Z0-9]*\/applications\?|\/domains\/[a-zA-Z0-9]*\/applications\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/applications\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/applicationVersions\/[a-zA-Z0-9]*)|(\/domains\/[a-zA-Z0-9]*\/events$|\/domains\/[a-zA-Z0-9]*\/events\?|\/domains\/[a-zA-Z0-9]*\/events\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/events\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/eventVersions\/[a-zA-Z0-9]*)|(\/domains\/[a-zA-Z0-9]*\/schemas$|\/domains\/[a-zA-Z0-9]*\/schemas\?|\/domains\/[a-zA-Z0-9]*\/schemas\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/schemas\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/schemaVersions\/[a-zA-Z0-9]*)|(\/domains\/[a-zA-Z0-9]*\/enums$|\/domains\/[a-zA-Z0-9]*\/enums\?|\/domains\/[a-zA-Z0-9]*\/enums\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/enums\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/enumVersions\/[a-zA-Z0-9]*)|(\/domains\/[a-zA-Z0-9]*\/eventApis$|\/domains\/[a-zA-Z0-9]*\/eventApis\?|\/domains\/[a-zA-Z0-9]*\/eventApis\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/eventApis\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/eventApiVersions\/[a-zA-Z0-9]*)|(\/domains\/[a-zA-Z0-9]*\/eventApiProducts$|\/domains\/[a-zA-Z0-9]*\/eventApiProducts\?|\/domains\/[a-zA-Z0-9]*\/eventApiProducts\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/eventApiProducts\/[a-zA-Z0-9]*|\/domains\/[a-zA-Z0-9]*\/eventApiProductVersions\/[a-zA-Z0-9]*))/
  return regex.test(url);
}

export const parseSolaceLink = (link, pageSize, pageNumber) => {
  let cmd = { pageSize: (pageSize ? pageSize : 5), pageNumber: (pageNumber ? pageNumber : 1)};
  if (!link) {
    cmd.error = 'Empty or missing URL';
    console.log(cmd.error);
    return cmd;
  }

  if (!isSolaceURL(link.trim())) {
    cmd.error = 'Invalid Solace Event Portal URL';
    console.log(cmd.error);
    return cmd;
  }

  let url = new URL(link.trim().replace(/&amp;/g, '&'));
  console.log('SOLACE URL', url.pathname);

  cmd.epDomain = url.hostname;
  cmd.url = url;
  if (url.pathname === '/ep/designer') {
    cmd.resource = 'domains';
    cmd.scope = 'all';
    return cmd;
  }
  
  if (!url.pathname.startsWith('/ep/designer/')) {
    cmd.error = 'Invalid Event Portal URL';
    console.log(cmd.error);
    return cmd;
  }

  let vals = url.pathname.split('/');
  for (let j=0; j<vals.length; j++) {
    if (vals[j] === 'domains') {
      cmd.resource = 'domains';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.domainId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'applications') {
      cmd.resource = 'applications';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.applicationId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'applicationVersions') {
      cmd.resource = 'applicationVersions';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.applicationId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'events') {
      cmd.resource = 'events';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.eventId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'eventVersions') {
      cmd.resource = 'eventVersions';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.eventId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'schemas') {
      cmd.resource = 'schemas';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.schemaId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'schemaVersions') {
      cmd.resource = 'schemaVersions';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.schemaId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'enums') {
      cmd.resource = 'enums';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.enumId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'enumVersions') {
      cmd.resource = 'enumVersions';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.enumId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'eventApis') {
      cmd.resource = 'eventApis';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.eventApiId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'eventApiVersions') {
      cmd.resource = 'eventApiVersions';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.eventApiId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }    
    if (vals[j] === 'eventApiProducts') {
      cmd.resource = 'eventApiProducts';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.eventApiProductId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
    if (vals[j] === 'eventApiProductVersions') {
      cmd.resource = 'eventApiProductVersions';            
      if (!vals[j+1]) {
        cmd.scope = 'all';
      } else {
        cmd.scope = 'id';
        cmd.eventApiProductId = vals[j+1];
        cmd.resourceId = vals[j+1];
      }
    }
  }

  if (!cmd.resource) {
    cmd.error = 'Unable to identify Event Portal resource';
    console.log(cmd.error);
    return cmd;
  }

  if (cmd.scope === 'id' && !cmd.resourceId) {
    cmd.error = 'Unable to identify Event Portal resource id';
    console.log(cmd.error);
    return cmd;
  }

  const resources = ['domains', 
                      'applications', 'applicationVersions', 
                      'events', 'eventVersions',
                      'schemas', 'schemaVersions',
                      'enums', 'enumVersions',
                      'eventApis', 'eventApiVersions',
                      'eventApiProducts', 'eventApiProductVersions'];
  for (let i=0; i<resources.length; i++) {
    let res = resources[i];
    if (url.pathname.indexOf(`/${res}/`) > 0 || url.pathname.indexOf(`/${res}?`) > 0 ||url.pathname.endsWith(`/${res}`)) {
      if (url.searchParams.has('selectedDomainId')) {
        cmd.scope = 'id';
        cmd.resource = res;
        cmd[`${res.slice(0, -1)}Id`] = url.searchParams.get('selectedDomainId');
      }
      if (url.searchParams.has('selectedId')) {
        cmd.scope = 'id';
        cmd.resource = res;
        cmd[`${res.slice(0, -1)}Id`] = url.searchParams.get('selectedId');
      }
      if (url.searchParams.has('selectedVersionId')) {
        cmd.scope = 'id';
        cmd.resource = res;
        cmd.versionId = url.searchParams.get('selectedVersionId');
      }
    }
  };
  const versionedResources = {
              'applications': {required: 'applicationId', versionName: 'applicationVersions'},
              'events': {required: 'eventId', versionName: 'eventVersions'},
              'schemas': {required: 'schemaId', versionName: 'schemaVersions'},
              'enums': {required: 'enumId', versionName: 'enumVersions'},
              'eventApis': {required: 'eventApiId', versionName: 'eventApiVersions'},
              'eventApiProducts': {required: 'eventApiProductId', versionName: 'eventApiProductVersions'}
  };
console.log('Versioned Resource', versionedResources);

  if (cmd.versionId && Object.keys(versionedResources).includes(cmd.resource)) {
    const parentResource = cmd.resource;
    cmd.resource = versionedResources[cmd.resource].versionName;
    if (!cmd.versionId) {
      cmd.error = 'Unable to identify Event Portal resource - missing version-id';
      console.log(cmd.error);
      return cmd;
    }
    if (!cmd[versionedResources[parentResource].required]) {
      cmd.error = 'Unable to identify Event Portal resource version - missing resource-id';
      console.log(cmd.error);
      return cmd;
    }
  }
  
  for (const [key, value] of url.searchParams.entries())  
    cmd[key] = value;

  if (!cmd.resource) {
    cmd.error = 'Unable to identify Event Portal resource';
    console.log(cmd.error);
    return cmd;
  }
    
  if (cmd.resource !== 'domains' && !cmd.domainId) {
    cmd.error = 'Unable to identify Event Portal domain';
    console.log(cmd.error);
    return cmd;
  }
  
  console.log('parseSolaceLink cmd:', cmd);

  return cmd;
}

export const getEventPortalResource = async (cmd, solaceCloudToken) => {
  let response = undefined;
  let resource = {
    status: false,
    message: "Not executed"
  };
  console.log('In getEventPortalResource', cmd, solaceCloudToken);

  if (cmd.resource === 'domains') {
    let options = { id: cmd.domainId, versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceApplicationDomains(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find domain";
    } else {
      resource.status = true;
      resource.message = response.data.length + " domains found";
      resource.meta = response.meta;
      resource.data = await buildDomainBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'applications') {
    let options = { id: cmd.applicationId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceApplications(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "No applications found";
    } else {
      resource.status = true;
      resource.message = response.data.length + " applications found";
      resource.meta = response.meta;
      resource.data = await buildApplicationBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'applicationVersions') {
    let options = { id: cmd.applicationId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber};
    response = await getSolaceApplicationVersions(cmd.applicationId, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find application version";
    } else {
      resource.status = true;
      resource.message = response.data.length + " application versions found";
      resource.meta = response.meta;
      resource.data = await buildApplicationVersionBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'events') {
    let options = { id: cmd.eventId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceEvents(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "No events found";
    } else {
      resource.status = true;
      resource.message = response.data.length + " events found";
      resource.meta = response.meta;
      resource.data = await buildEventBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'eventVersions') {
    let options = { id: cmd.eventId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber};
    response = await getSolaceEventVersions(cmd.eventId, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find event version";
    } else {
      resource.status = true;
      resource.message = response.data.length + " event versions found";
      resource.meta = response.meta;
      resource.data = await buildEventVersionBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'schemas') {
    let options = { id: cmd.schemaId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceSchemas(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = "No schemas found";
    } else {
      resource.status = true;
      resource.message = response.data.length + " schemas found";
      resource.meta = response.meta;
      resource.data = await buildSchemaBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'schemaVersions') {
    let options = { id: cmd.schemaId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber};
    response = await getSolaceSchemaVersions(cmd.schemaId, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find schema version";
    } else {
      resource.status = true;
      resource.message = response.data.length + " schema versions found";
      resource.meta = response.meta;
      resource.data = await buildSchemaVersionBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'enums') {
    let options = { id: cmd.enumId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceEnums(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "No enums found";
    } else {
      resource.status = true;
      resource.message = response.data.length + " enums found";
      resource.meta = response.meta;
      resource.data = await buildEnumBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'enumVersions') {
    let options = { id: cmd.enumId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber};
    response = await getSolaceEnumVersions(cmd.enumId, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find enum version";
    } else {
      resource.status = true;
      resource.message = response.data.length + " enum versions found";
      resource.meta = response.meta;
      resource.data = await buildEnumVersionBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'eventApis') {
    let options = { id: cmd.eventApiId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceEventApis(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "No EventApis found";
    } else {
      resource.status = true;
      resource.message = response.data.length + " EventApis found";
      resource.meta = response.meta;
      resource.data = await buildEventApiBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'eventApiVersions') {
    let options = { id: cmd.eventApiId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber};
    response = await getSolaceEventApiVersions(cmd.eventApiId, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find EventApi version";
    } else {
      resource.status = true;
      resource.message = response.data.length + " EventApi versions found";
      resource.meta = response.meta;
      resource.data = await buildEventApiVersionBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'eventApiProducts') {
    let options = { id: cmd.eventApiProductId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber}
    response = await getSolaceEventApiProducts(cmd.scope, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "No Event API Products found";
    } else {
      resource.status = true;
      resource.message = response.data.length + " EventApis found";
      resource.meta = response.meta;
      resource.data = await buildEventApiProductBlocks(response.data, cmd.epDomain); 
    }
  } else if (cmd.resource === 'eventApiProductVersions') {
    let options = { id: cmd.eventApiProductId, domainId: cmd.domainId, domainName: cmd.domainName, 
                    versionId: cmd.versionId, pageSize: (cmd.pageSize ? cmd.pageSize : 5), pageNumber: cmd.pageNumber};
    response = await getSolaceEventApiProductVersions(cmd.eventApiProductId, solaceCloudToken.epToken, options)
    if (!response.data.length) {
      resource.message = response.error ? response.error : "Could not find Event API Product version";
    } else {
      resource.status = true;
      resource.message = response.data.length + " Event API Product versions found";
      resource.meta = response.meta;
      resource.data = await buildEventApiProductVersionBlocks(response.data, cmd.epDomain); 
    }    
  }
  return resource;
}

export const getSolaceApplicationDomains = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  params.append('include', 'stats');
  if (mode === 'name') params.append('name', options.name);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (mode === 'all' || mode === 'name')
    response = await getApplicationDomains(solaceCloudToken, params);
  else if (mode === 'id')
    response = await getApplicationDomainByID(solaceCloudToken, options.id, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  return results;
}

export const getSolaceApplications = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  if (mode === 'name') params.append('name', encodeURIComponent(options.name));
  if (options.hasOwnProperty('domainId')) params.append('applicationDomainId', options.domainId);
  if (options.hasOwnProperty('type')) params.append('applicationType', options.type);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);

  let response = undefined;
  if (mode === 'all' || mode === 'name')
    response = await getApplications(solaceCloudToken, params);
  else if (mode === 'id')
    response = await getApplicationByID(solaceCloudToken, options.id, params);
  console.log('getSolaceApplications response: ', response);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domains = {};
  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = results.data[i].applicationDomainId;
    if (!domains[results.data[i].applicationDomainId]) {
      const domainName = await getApplicationDomainName(solaceCloudToken, results.data[i].applicationDomainId);
      if (!domainName)
        domains[results.data[i].applicationDomainId] = domainName;
    }
    results.data[i].domainName = domains[results.data[i].applicationDomainId];
  }

  console.log('getSolaceApplications results: ', results);
  return results;
}

export const getSolaceApplicationVersions = async (applicationId, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  params.append('applicationIds', applicationId);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (options.hasOwnProperty('versionId') && options.versionId)
    response = await getApplicationVersionByID(solaceCloudToken, options.versionId, params);
  else
    response = await getApplicationVersions(solaceCloudToken, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domain = undefined;
  let application = undefined;
  if (results.data.length > 0) {
    response = await getApplicationByID(solaceCloudToken, applicationId);
    application = response.data;
    response = await getApplicationDomainByID(solaceCloudToken, application.applicationDomainId);
    domain = response.data;
  }

  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = domain.id;
    results.data[i].domainName = domain.name;
    results.data[i].applicationId = application.id;
    results.data[i].applicationName = application.name;
  }

  let allEvents = {};
  let allEventVersions = {};
  for (let i=0; i<results.data.length; i++) {
    let events = {};
    let eventVersions = {};
    for (let j=0; j<results.data[i].declaredProducedEventVersionIds.length; j++) {
      if (!allEvents[results.data[i].declaredProducedEventVersionIds[j]]) {
        if (!allEventVersions[results.data[i].declaredProducedEventVersionIds[j]]) {
          response = await getEventVersionByID(solaceCloudToken, results.data[i].declaredProducedEventVersionIds[j]);
          allEventVersions[results.data[i].declaredProducedEventVersionIds[j]] = response.data;
        }
        if (!allEvents[results.data[i].declaredProducedEventVersionIds[j]]) {
          response = await getEventByID(solaceCloudToken, allEventVersions[results.data[i].declaredProducedEventVersionIds[j]].eventId);
          allEvents[results.data[i].declaredProducedEventVersionIds[j]] = response.data;
        }
      }

      if (!eventVersions[results.data[i].declaredProducedEventVersionIds[j]])
        eventVersions[results.data[i].declaredProducedEventVersionIds[j]] = allEventVersions[results.data[i].declaredProducedEventVersionIds[j]]
      if (!events[results.data[i].declaredProducedEventVersionIds[j]])
        events[results.data[i].declaredProducedEventVersionIds[j]] = allEvents[results.data[i].declaredProducedEventVersionIds[j]]

    }
    for (let j=0; j<results.data[i].declaredConsumedEventVersionIds.length; j++) {
      if (!allEvents[results.data[i].declaredConsumedEventVersionIds[j]]) {
        if (!allEventVersions[results.data[i].declaredConsumedEventVersionIds[j]]) {
          response = await getEventVersionByID(solaceCloudToken, results.data[i].declaredConsumedEventVersionIds[j]);
          allEventVersions[results.data[i].declaredConsumedEventVersionIds[j]] = response.data;
        }
        if (!allEvents[results.data[i].declaredConsumedEventVersionIds[j]]) {
          response = await getEventByID(solaceCloudToken, allEventVersions[results.data[i].declaredConsumedEventVersionIds[j]].eventId);;
          allEvents[results.data[i].declaredConsumedEventVersionIds[j]] = response.data;
        }
      }

      if (!eventVersions[results.data[i].declaredConsumedEventVersionIds[j]])
        eventVersions[results.data[i].declaredConsumedEventVersionIds[j]] = allEventVersions[results.data[i].declaredConsumedEventVersionIds[j]]
      if (!events[results.data[i].declaredConsumedEventVersionIds[j]])
        events[results.data[i].declaredConsumedEventVersionIds[j]] = allEvents[results.data[i].declaredConsumedEventVersionIds[j]]

    }
    results.data[i].events = events;
    results.data[i].eventVersions = eventVersions;
  }
  return results;
}

export const getSolaceEvents = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  if (mode === 'name') params.append('name', options.name);
  if (options.hasOwnProperty('domainId')) params.append('applicationDomainId', options.domainId);
  if (options.hasOwnProperty('shared')) params.append('shared', options.shared);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);

  let response = null;
  if (mode === 'all' || mode === 'name') {
    response = await getEvents(solaceCloudToken, params);
  } else if (mode === 'id') {
    if (!options.versionId)
      response = await getEventByID(solaceCloudToken, options.id, params);
    else
      response = await getEventVersionByID(solaceCloudToken, options.versionId, params);
  }
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domains = {};
  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = results.data[i].applicationDomainId;
    if (!domains[results.data[i].applicationDomainId]) {
      const domainName = await getApplicationDomainName(solaceCloudToken, results.data[i].applicationDomainId);
      if (!domainName)
        domains[results.data[i].applicationDomainId] = domainName;
    }
    results.data[i].domainName = domains[results.data[i].applicationDomainId];
  }

  return results;
}

export const getSolaceEventVersions = async (eventId, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  params.append('eventIds', eventId);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (options.hasOwnProperty('versionId') && options.versionId)
    response = await getEventVersionByID(solaceCloudToken, options.versionId, params);
  else
    response = await getEventVersions(solaceCloudToken, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domain = undefined;
  let event = undefined;
  if (results.data.length > 0) {
    response = await getEventByID(solaceCloudToken, eventId);
    event = response.data;
    response = await getApplicationDomainByID(solaceCloudToken, event.applicationDomainId);
    domain = response.data;
  }

  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = domain.id;
    results.data[i].domainName = domain.name;
    results.data[i].eventId = event.id;
    results.data[i].eventName = event.name;
  }

  let schemas = {};
  let schemaVersions = {};
  for (let i=0; i<results.data.length; i++) {    
    if (results.data[i].schemaVersionId) {
      if (!schemaVersions[results.data[i].schemaVersionId]) {
        response = await getSchemaVersionByID(solaceCloudToken, results.data[i].schemaVersionId);
        schemaVersions[results.data[i].schemaVersionId] = response.data;
      }
      if (!schemas[results.data[i].schemaVersionId]) {
        response = await getSchemaByID(solaceCloudToken, schemaVersions[results.data[i].schemaVersionId].schemaId);
        schemas[results.data[i].schemaVersionId] = response.data;
      }
    }

    results.data[i].schemaVersion = results.data[i].schemaVersionId ? schemaVersions[results.data[i].schemaVersionId] : undefined;
    results.data[i].schema = results.data[i].schemaVersionId ? schemas[results.data[i].schemaVersionId] : undefined;
  }

  let allAppVersions = {};
  let allApps = {};

  for (let i=0; i<results.data.length; i++) {
    let appVersions = {};
    let apps = {};
    
    for (let j=0; j<results.data[i].declaredProducingApplicationVersionIds.length; j++) {
      if (!allApps[results.data[i].declaredProducingApplicationVersionIds[j]]) {
        if (!allAppVersions[results.data[i].declaredProducingApplicationVersionIds[j]]) {
          response = await getApplicationVersionByID(solaceCloudToken, results.data[i].declaredProducingApplicationVersionIds[j]);;
          allAppVersions[results.data[i].declaredProducingApplicationVersionIds[j]] = response.data;
        }
        if (!allApps[results.data[i].declaredProducingApplicationVersionIds[j]]) {
          response = await getApplicationByID(solaceCloudToken, allAppVersions[results.data[i].declaredProducingApplicationVersionIds[j]].applicationId);
          allApps[results.data[i].declaredProducingApplicationVersionIds[j]] = response.data;
        }
      }

      if (!appVersions[results.data[i].declaredProducingApplicationVersionIds[j]])
        appVersions[results.data[i].declaredProducingApplicationVersionIds[j]] = allAppVersions[results.data[i].declaredProducingApplicationVersionIds[j]]
      if (!apps[results.data[i].declaredProducingApplicationVersionIds[j]])
        apps[results.data[i].declaredProducingApplicationVersionIds[j]] = allApps[results.data[i].declaredProducingApplicationVersionIds[j]]
    }
    for (let j=0; j<results.data[i].declaredConsumingApplicationVersionIds.length; j++) {
      if (!allApps[results.data[i].declaredConsumingApplicationVersionIds[j]]) {
        if (!allAppVersions[results.data[i].declaredConsumingApplicationVersionIds[j]]) {
          response = await getApplicationVersionByID(solaceCloudToken, results.data[i].declaredConsumingApplicationVersionIds[j]);
          allAppVersions[results.data[i].declaredConsumingApplicationVersionIds[j]] = response.data;
        }
        if (!allApps[results.data[i].declaredConsumingApplicationVersionIds[j]]) {
          response = await getApplicationByID(solaceCloudToken, allAppVersions[results.data[i].declaredConsumingApplicationVersionIds[j]].applicationId);
          allApps[results.data[i].declaredConsumingApplicationVersionIds[j]] = response.data;
        }
      }
      if (!appVersions[results.data[i].declaredConsumingApplicationVersionIds[j]])
        appVersions[results.data[i].declaredConsumingApplicationVersionIds[j]] = allAppVersions[results.data[i].declaredConsumingApplicationVersionIds[j]]
      if (!apps[results.data[i].declaredConsumingApplicationVersionIds[j]])
        apps[results.data[i].declaredConsumingApplicationVersionIds[j]] = allApps[results.data[i].declaredConsumingApplicationVersionIds[j]]
    }

    results.data[i].apps = apps;
    results.data[i].appVersions = appVersions;
  }

  let allEventApiVersions = {};
  let allEventApis = {};

  for (let i=0; i<results.data.length; i++) {
    let eventApiVersions = {};
    let eventApis = {};
    
    for (let j=0; j<results.data[i].producingEventApiVersionIds.length; j++) {
      if (!allEventApis[results.data[i].producingEventApiVersionIds[j]]) {
        if (!allEventApiVersions[results.data[i].producingEventApiVersionIds[j]]) {
          response = await getEventApiVersionByID(solaceCloudToken, results.data[i].producingEventApiVersionIds[j]);;
          allEventApiVersions[results.data[i].producingEventApiVersionIds[j]] = response.data;
        }
        if (!allEventApis[results.data[i].producingEventApiVersionIds[j]]) {
          response = await getEventApiByID(solaceCloudToken, allEventApiVersions[results.data[i].producingEventApiVersionIds[j]].eventApiId);
          allEventApis[results.data[i].producingEventApiVersionIds[j]] = response.data;
        }
      }

      if (!eventApiVersions[results.data[i].producingEventApiVersionIds[j]])
        eventApiVersions[results.data[i].producingEventApiVersionIds[j]] = allEventApiVersions[results.data[i].producingEventApiVersionIds[j]]
      if (!eventApis[results.data[i].producingEventApiVersionIds[j]])
        eventApis[results.data[i].producingEventApiVersionIds[j]] = allEventApis[results.data[i].producingEventApiVersionIds[j]]
    }
    for (let j=0; j<results.data[i].consumingEventApiVersionIds.length; j++) {
      if (!allEventApis[results.data[i].consumingEventApiVersionIds[j]]) {
        if (!allEventApiVersions[results.data[i].consumingEventApiVersionIds[j]]) {
          response = await getEventApiVersionByID(solaceCloudToken, results.data[i].consumingEventApiVersionIds[j]);
          allEventApiVersions[results.data[i].consumingEventApiVersionIds[j]] = response.data;
        }
        if (!allEventApis[results.data[i].consumingEventApiVersionIds[j]]) {
          response = await getEventApiByID(solaceCloudToken, allEventApiVersions[results.data[i].consumingEventApiVersionIds[j]].eventApiId);
          allEventApis[results.data[i].consumingEventApiVersionIds[j]] = response.data;
        }
      }
      if (!eventApiVersions[results.data[i].consumingEventApiVersionIds[j]])
        eventApiVersions[results.data[i].consumingEventApiVersionIds[j]] = allEventApiVersions[results.data[i].consumingEventApiVersionIds[j]]
      if (!eventApis[results.data[i].consumingEventApiVersionIds[j]])
        eventApis[results.data[i].consumingEventApiVersionIds[j]] = allEventApis[results.data[i].consumingEventApiVersionIds[j]]
    }

    results.data[i].eventApis = eventApis;
    results.data[i].eventApiVersions = eventApiVersions;
  }

  return results;
}

export const getSolaceSchemas = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  if (mode === 'name') params.append('name', options.name);
  if (options.hasOwnProperty('domainId')) params.append('applicationDomainId', options.domainId);
  if (options.hasOwnProperty('shared')) params.append('shared', options.shared);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);

  if (mode === 'all' || mode === 'name') {
    let response = await getSchemas(solaceCloudToken, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  } else if (mode === 'id') {
    let response = await getSchemaByID(solaceCloudToken, options.id, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  }

  let domains = {};
  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = results.data[i].applicationDomainId;
    if (!domains[results.data[i].applicationDomainId]) {
      const domainName = await getApplicationDomainName(solaceCloudToken, results.data[i].applicationDomainId);
      if (!domainName)
        domains[results.data[i].applicationDomainId] = domainName;
    }
    results.data[i].domainName = domains[results.data[i].applicationDomainId];
  }

  return results;
}

export const getSolaceSchemaVersions = async (schemaId, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();


  params.append('schemaIds', schemaId);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (options.hasOwnProperty('versionId') && options.versionId)
    response = await getSchemaVersionByID(solaceCloudToken, options.versionId, params);
  else
    response = await getSchemaVersions(solaceCloudToken, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domain = undefined;
  let schema = undefined;
  if (results.data.length > 0) {
    response = await getSchemaByID(solaceCloudToken, schemaId);
    schema = response.data;
    response = await getApplicationDomainByID(solaceCloudToken, schema.applicationDomainId);
    domain = response.data;
  }

  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = domain.id;
    results.data[i].domainName = domain.name;
    results.data[i].schemaId = schema.id;
    results.data[i].schemaName = schema.name;
  }

  let allEventVersions = {};
  let allEvents = {};

  for (let i=0; i<results.data.length; i++) {
    results.data[i].schema = schema;

    let eventVersions = {};
    let events = {};
    
    if (results.data[i].referencedByEventVersionIds) {
      for (let j=0; j<results.data[i].referencedByEventVersionIds.length; j++) {
        if (!allEvents[results.data[i].referencedByEventVersionIds[j]]) {
          if (!allEventVersions[results.data[i].referencedByEventVersionIds[j]]) {
            response = await getEventVersionByID(solaceCloudToken, results.data[i].referencedByEventVersionIds[j]);
            allEventVersions[results.data[i].referencedByEventVersionIds[j]] = response.data;
          }
          if (!allEvents[results.data[i].referencedByEventVersionIds[j]]) {
            response = await getEventByID(solaceCloudToken, allEventVersions[results.data[i].referencedByEventVersionIds[j]].eventId);
            allEvents[results.data[i].referencedByEventVersionIds[j]] = response.data;
          }
        }

        eventVersions[results.data[i].referencedByEventVersionIds[j]] = allEventVersions[results.data[i].referencedByEventVersionIds[j]]
        events[results.data[i].referencedByEventVersionIds[j]] = allEvents[results.data[i].referencedByEventVersionIds[j]]
      }
    }

    results.data[i].events = events;
    results.data[i].eventVersions = eventVersions;
  }


  return results;
}

export const getSolaceEnums = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  if (mode === 'name') params.append('name', options.name);
  if (options.hasOwnProperty('domainId')) params.append('applicationDomainId', options.domainId);
  if (options.hasOwnProperty('shared')) params.append('shared', options.shared);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);

  if (mode === 'all' || mode === 'name') {
    let response = await getEnums(solaceCloudToken, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  } else if (mode === 'id') {
    let response = await getEnumByID(solaceCloudToken, options.id, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  }

  let domains = {};
  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = results.data[i].applicationDomainId;
    if (!domains[results.data[i].applicationDomainId]) {
      const domainName = await getApplicationDomainName(solaceCloudToken, results.data[i].applicationDomainId);
      if (!domainName)
        domains[results.data[i].applicationDomainId] = domainName;
    }
    results.data[i].domainName = domains[results.data[i].applicationDomainId];
  }

  return results;
}

export const getSolaceEnumVersions = async (enumId, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  params.append('enumIds', enumId);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (options.hasOwnProperty('versionId') && options.versionId)
    response = await getEnumVersionByID(solaceCloudToken, options.versionId, params);
  else
    response = await getEnumVersions(solaceCloudToken, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domain = undefined;
  let ennum = undefined;
  if (results.data.length > 0) {
    response = await getEnumByID(solaceCloudToken, enumId);
    ennum = response.data;
    response = await getApplicationDomainByID(solaceCloudToken, ennum.applicationDomainId);
    domain = response.data;
  }

  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = domain.id;
    results.data[i].domainName = domain.name;
    results.data[i].enumId = ennum.id;
    results.data[i].enumName = ennum.name;
  }

  let allEventVersions = {};
  let allEvents = {};

  for (let i=0; i<results.data.length; i++) {
    results.data[i].ennum = ennum;

    let eventVersions = {};
    let events = {};
    
    if (results.data[i].referencedByEventVersionIds) {
      for (let j=0; j<results.data[i].referencedByEventVersionIds.length; j++) {
        if (!allEvents[results.data[i].referencedByEventVersionIds[j]]) {
          if (!allEventVersions[results.data[i].referencedByEventVersionIds[j]]) {
            response = await getEventVersionByID(solaceCloudToken, results.data[i].referencedByEventVersionIds[j]);
            allEventVersions[results.data[i].referencedByEventVersionIds[j]] = response.data;
          }
          if (!allEvents[results.data[i].referencedByEventVersionIds[j]]) {
            response = await getEventByID(solaceCloudToken, allEventVersions[results.data[i].referencedByEventVersionIds[j]].eventId);
            allEvents[results.data[i].referencedByEventVersionIds[j]] = response.data;
          }
        }

        eventVersions[results.data[i].referencedByEventVersionIds[j]] = allEventVersions[results.data[i].referencedByEventVersionIds[j]]
        events[results.data[i].referencedByEventVersionIds[j]] = allEvents[results.data[i].referencedByEventVersionIds[j]]
      }
    }

    results.data[i].events = events;
    results.data[i].eventVersions = eventVersions;
  }


  return results;
}

export const getSolaceEventApis = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  if (mode === 'name') params.append('name', options.name);
  if (options.hasOwnProperty('domainId')) params.append('applicationDomainId', options.domainId);
  if (options.hasOwnProperty('shared')) params.append('shared', options.shared);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);

  if (mode === 'all' || mode === 'name') {
    let response = await getEventApis(solaceCloudToken, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  } else if (mode === 'id') {
    let response = await getEventApiByID(solaceCloudToken, options.id, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  }
  let domains = {};
  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = results.data[i].applicationDomainId;
    if (!domains[results.data[i].applicationDomainId]) {
      const domainName = await getApplicationDomainName(solaceCloudToken, results.data[i].applicationDomainId);
      if (!domainName)
        domains[results.data[i].applicationDomainId] = domainName;
    }
    results.data[i].domainName = domains[results.data[i].applicationDomainId];
  }

  return results;
}

export const getSolaceEventApiVersions = async (eventApiId, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();

  params.append('eventApiIds', eventApiId);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (options.hasOwnProperty('versionId') && options.versionId)
    response = await getEventApiVersionByID(solaceCloudToken, options.versionId, params);
  else
    response = await getEventApiVersions(solaceCloudToken, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};

  let domain = undefined;
  let eventApi = undefined;
  if (results.data.length > 0) {
    response = await getEventApiByID(solaceCloudToken, eventApiId);
    eventApi = response.data;
    response = await getApplicationDomainByID(solaceCloudToken, eventApi.applicationDomainId);
    domain = response.data;
  }

  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = domain.id;
    results.data[i].domainName = domain.name;
    results.data[i].eventApiId = eventApi.id;
    results.data[i].eventApiName = eventApi.name;
  }

  let allEventVersions = {};
  let allEvents = {};
  let allEventApiProducts = {};
  let allEventApiProductVersions = {};

  for (let i=0; i<results.data.length; i++) {
    results.data[i].eventApi = eventApi;

    let eventVersions = {};
    let events = {};
    let eventApiProducts = {};
    let eventApiProductVersions = {};
    
    if (results.data[i].producedEventVersionIds) {
      for (let j=0; j<results.data[i].producedEventVersionIds.length; j++) {
        if (!allEvents[results.data[i].producedEventVersionIds[j]]) {
          if (!allEventVersions[results.data[i].producedEventVersionIds[j]]) {
            response = await getEventVersionByID(solaceCloudToken, results.data[i].producedEventVersionIds[j]);
            allEventVersions[results.data[i].producedEventVersionIds[j]] = response.data;
          }
          if (!allEvents[results.data[i].producedEventVersionIds[j]]) {
            response = await getEventByID(solaceCloudToken, allEventVersions[results.data[i].producedEventVersionIds[j]].eventId);
            allEvents[results.data[i].producedEventVersionIds[j]] = response.data;
          }
        }

        eventVersions[results.data[i].producedEventVersionIds[j]] = allEventVersions[results.data[i].producedEventVersionIds[j]]
        events[results.data[i].producedEventVersionIds[j]] = allEvents[results.data[i].producedEventVersionIds[j]]
      }
    }

    if (results.data[i].consumedEventVersionIds) {
      for (let j=0; j<results.data[i].consumedEventVersionIds.length; j++) {
        if (!allEvents[results.data[i].consumedEventVersionIds[j]]) {
          if (!allEventVersions[results.data[i].consumedEventVersionIds[j]]) {
            response = await getEventVersionByID(solaceCloudToken, results.data[i].consumedEventVersionIds[j]);
            allEventVersions[results.data[i].consumedEventVersionIds[j]] = response.data;
          }
          if (!allEvents[results.data[i].consumedEventVersionIds[j]]) {
            response = await getEventByID(solaceCloudToken, allEventVersions[results.data[i].consumedEventVersionIds[j]].eventId);
            allEvents[results.data[i].consumedEventVersionIds[j]] = response.data;
          }
        }

        eventVersions[results.data[i].consumedEventVersionIds[j]] = allEventVersions[results.data[i].consumedEventVersionIds[j]]
        events[results.data[i].consumedEventVersionIds[j]] = allEvents[results.data[i].consumedEventVersionIds[j]]
      }
    }

    results.data[i].events = events;
    results.data[i].eventVersions = eventVersions;

    if (results.data[i].declaredEventApiProductVersionIds) {
      for (let j=0; j<results.data[i].declaredEventApiProductVersionIds.length; j++) {
        if (!allEventApiProducts[results.data[i].declaredEventApiProductVersionIds[j]]) {
          if (!allEventApiProductVersions[results.data[i].declaredEventApiProductVersionIds[j]]) {
            response = await getEventApiProductVersionByID(solaceCloudToken, results.data[i].declaredEventApiProductVersionIds[j]);
            allEventApiProductVersions[results.data[i].declaredEventApiProductVersionIds[j]] = response.data;
          }
          if (!allEventApiProducts[results.data[i].declaredEventApiProductVersionIds[j]]) {
            response = await getEventApiProductByID(solaceCloudToken, allEventApiProductVersions[results.data[i].declaredEventApiProductVersionIds[j]].eventApiProductId);
            allEventApiProducts[results.data[i].declaredEventApiProductVersionIds[j]] = response.data;
          }
        }

        eventApiProductVersions[results.data[i].declaredEventApiProductVersionIds[j]] = allEventApiProductVersions[results.data[i].declaredEventApiProductVersionIds[j]]
        eventApiProducts[results.data[i].declaredEventApiProductVersionIds[j]] = allEventApiProducts[results.data[i].declaredEventApiProductVersionIds[j]]
      }
    }

    
    results.data[i].eventApiProducts = eventApiProducts;
    results.data[i].eventApiProductVersions = eventApiProductVersions;
  }


  return results;
}

export const getSolaceEventApiProducts = async (mode, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();
  console.log(mode, solaceCloudToken, options);

  if (mode === 'name') params.append('name', options.name);
  if (options.hasOwnProperty('domainId')) params.append('applicationDomainId', options.domainId);
  if (options.hasOwnProperty('shared')) params.append('shared', options.shared);
  if (options.hasOwnProperty('sort')) params.append('sort', 'name:'+options.sort);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);

  if (mode === 'all' || mode === 'name') {
    let response = await getEventApiProducts(solaceCloudToken, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  } else if (mode === 'id') {
    let response = await getEventApiProductByID(solaceCloudToken, options.id, params);
    results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  }
  let domains = {};
  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = results.data[i].applicationDomainId;
    if (!domains[results.data[i].applicationDomainId]) {
      const domainName = await getApplicationDomainName(solaceCloudToken, results.data[i].applicationDomainId);
      if (!domainName)
        domains[results.data[i].applicationDomainId] = domainName;
    }
    results.data[i].domainName = domains[results.data[i].applicationDomainId];
  }

  return results;
}

export const getSolaceEventApiProductVersions = async (eventApiProductId, solaceCloudToken, options=null) => {
  let results = [];
  let params = new URLSearchParams();
console.log(eventApiProductId, solaceCloudToken, options);
  params.append('eventApiProductIds', eventApiProductId);
  if (options.hasOwnProperty('pageSize')) params.append('pageSize', options.pageSize);
  if (options.hasOwnProperty('pageNumber')) params.append('pageNumber', options.pageNumber);
  
  let response = undefined;
  if (options.hasOwnProperty('versionId') && options.versionId)
    response = await getEventApiProductVersionByID(solaceCloudToken, options.versionId, params);
  else
    response = await getEventApiProductVersions(solaceCloudToken, params);
  results = {data: results.concat(response.data), meta: response.meta, status: response.status, error: response.error};
  let domain = undefined;
  let eventApiProduct = undefined;
  if (results.data.length > 0) {
    response = await getEventApiProductByID(solaceCloudToken, eventApiProductId);
    eventApiProduct = response.data;
    response = await getApplicationDomainByID(solaceCloudToken, eventApiProduct.applicationDomainId);
    domain = response.data;
  }

  for (let i=0; i<results.data.length; i++) {
    results.data[i].domainId = domain.id;
    results.data[i].domainName = domain.name;
    results.data[i].eventApiProductId = eventApiProduct.id;
    results.data[i].eventApiProductName = eventApiProduct.name;
  }

  let allEventApiVersions = {};
  let allEventApis = {};

  for (let i=0; i<results.data.length; i++) {
    let eventApiVersions = {};
    let eventApis = {};
    
    if (results.data[i].eventApiVersionIds) {
      for (let j=0; j<results.data[i].eventApiVersionIds.length; j++) {
        if (!allEventApiVersions[results.data[i].eventApiVersionIds[j]]) {
          if (!allEventApiVersions[results.data[i].eventApiVersionIds[j]]) {
            response = await getEventApiVersionByID(solaceCloudToken, results.data[i].eventApiVersionIds[j]);
            allEventApiVersions[results.data[i].eventApiVersionIds[j]] = response.data;
          }
          if (!allEventApis[results.data[i].eventApiVersionIds[j]]) {
            response = await getEventApiByID(solaceCloudToken, allEventApiVersions[results.data[i].eventApiVersionIds[j]].eventApiId);
            allEventApis[results.data[i].eventApiVersionIds[j]] = response.data;
          }
        }

        eventApiVersions[results.data[i].eventApiVersionIds[j]] = allEventApiVersions[results.data[i].eventApiVersionIds[j]]
        eventApis[results.data[i].eventApiVersionIds[j]] = allEventApis[results.data[i].eventApiVersionIds[j]]
      }
    }

    results.data[i].eventApis = eventApis;
    results.data[i].eventApiVersions = eventApiVersions;

    if (results.data[i].plans) {
      let productPlans = [];
      for (let j=0; j<results.data[i].plans.length; j++) {
        productPlans.push({
          name: results.data[i].plans[i].name,
          deliveryMode: results.data[i].plans[i]. solaceClassOfServicePolicy.deliveryMode,
          accessType: results.data[i].plans[i]. solaceClassOfServicePolicy.accessType,
          maximumTimeToLive: results.data[i].plans[i]. solaceClassOfServicePolicy.maximumTimeToLive,
          queueType: results.data[i].plans[i]. solaceClassOfServicePolicy.queueType,
          maxMsgSpoolUsage: results.data[i].plans[i]. solaceClassOfServicePolicy.maxMsgSpoolUsage,
        })
      }
    }
  }


  return results;
}