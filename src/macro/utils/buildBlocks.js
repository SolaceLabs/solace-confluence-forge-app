const states = { 1: "Draft", 2: "Released", 3: "Deprecated", 4: "Retired" }
const approvalTypes = { 'automatic': "Automatic", 'manual': "Manual" }
const publishStates = { 'unset': "Unset", 'published': "Published" }

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const niceBytes = (x) => {
  let l = 0, n = parseInt(x, 10) || 0;
  while(n >= 1024 && ++l){
      n = n/1024;
  }
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

export const buildDomainBlocks = (results, domain) => {
  let data = [];
  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].id + "/applications"; 
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.uniqueTopicAddressEnforcementEnabled = results[i].uniqueTopicAddressEnforcementEnabled;
    block.topicDomainEnforcementEnabled = results[i].topicDomainEnforcementEnabled;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    if (results[i].stats) {
      block.applicationCount = results[i].stats.applicationCount;
      block.applicationCountUrl = "https://" + domain + "/ep/designer/domains/" 
                                    + results[i].id + "/applications?domainName=" + results[i].name;
      block.eventCount = results[i].stats.eventCount;
      block.eventCountUrl = "https://" + domain + "/ep/designer/domains/" 
                                    + results[i].id + "/events?domainName=" + results[i].name;
      block.schemaCount = results[i].stats.schemaCount;
      block.schemaCountUrl = "https://" + domain + "/ep/designer/domains/" 
                                    + results[i].id + "/schemas?domainName=" + results[i].name;
      block.enumCount = results[i].stats.enumCount;
      block.enumCountUrl = "https://" + domain + "/ep/designer/domains/" 
                                    + results[i].id + "/enums?domainName=" + results[i].name;
      block.eventApiCount = results[i].stats.eventApiCount;
      block.eventApiCountUrl = "https://" + domain + "/ep/designer/domains/" 
                                    + results[i].id + "/eventApis?domainName=" + results[i].name;
      block.eventApiProductCount = results[i].stats.eventApiProductCount;
      block.eventApiProductCountUrl = "https://" + domain + "/ep/designer/domains/" 
                                    + results[i].id + "/eventApiProducts?domainName=" + results[i].name;
    }

    block.domainId = results[i].id;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/" + results[i].id + "/applications";
    
    data.push(block);
  }

  return data;
}

export const buildApplicationBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId 
                + "/applications/" + results[i].id;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    block.domainId = results[i].applicationDomainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications";
    block.versionsCount = results[i].numberOfVersions;
    block.versionsUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications/" + results[i].id;
    block.applicationType = results[i].applicationType;
    block.brokerType = results[i].brokerType;
    
    data.push(block);
  }

  return data;
}

export const buildApplicationVersionBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].domainId 
                  + "/applications/" + results[i].applicationId + "?selectedVersionId=" + results[i].id;
    block.version = results[i].version;
    block.displayName = results[i].displayName;
    block.type = results[i].type;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    block.domainId = results[i].domainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications";
    
    block.applicationId = results[i].applicationId;
    block.applicationName = results[i].applicationName;
    block.applicationUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications/" + results[i].applicationId;

    block.name = (block.displayName ? (block.version + ' [' + block.displayName + ']') : (block.version));

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    if (results[i].declaredProducedEventVersionIds && results[i].declaredProducedEventVersionIds.length) {
      block.producedEvents = [];
      for (let j=0; j<results[i].declaredProducedEventVersionIds.length; j++) {
        let event = results[i].events[results[i].declaredProducedEventVersionIds[j]];
        let eventVersion = results[i].eventVersions[results[i].declaredProducedEventVersionIds[j]];

        block.producedEvents.push({
          eventId: event.id,
          eventName: event.name,
          eventUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id,
          versionId: eventVersion.id,
          versionName: eventVersion.name,
          version: eventVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id + "?selectedVersionId=" + eventVersion.id,
        });
      }
    }

    if (results[i].declaredConsumedEventVersionIds && results[i].declaredConsumedEventVersionIds.length) {
      block.consumedEvents = [];
      for (let j=0; j<results[i].declaredConsumedEventVersionIds.length; j++) {
        let event = results[i].events[results[i].declaredConsumedEventVersionIds[j]];
        let eventVersion = results[i].eventVersions[results[i].declaredConsumedEventVersionIds[j]];

        block.consumedEvents.push({
          eventId: event.id,
          eventName: event.name,
          eventUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id,
          versionId: eventVersion.id,
          versionName: eventVersion.name,
          version: eventVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id + "?selectedVersionId=" + eventVersion.id,
        });
      }
    }

    if (results[i].consumers && results[i].consumers.length) {
      block.consumers = [];
      for (let j=0; j<results[i].consumers.length; j++) {
        let subscriptions = [];
        if (results[i].consumers[j].hasOwnProperty('subscriptions') && results[i].consumers[j].subscriptions.length) {
          for (let k=0; k<results[i].consumers[j].subscriptions.length; k++) {
            subscriptions.push({
              subscriptionType: results[i].consumers[j].subscriptions[k].subscriptionType,
              value: results[i].consumers[j].subscriptions[k].value,
            });
          }
        }

        block.consumers.push({
          id: results[i].consumers[j].id,
          name: results[i].consumers[j].name,
          brokerType: results[i].consumers[j].brokerType,
          consumerType: results[i].consumers[j].consumerType,
          type: results[i].consumers[j].type,
          createdTime: results[i].consumers[j].createdTime,
          updatedTime: results[i].consumers[j].updatedTime,
          subscriptions: subscriptions
        });
      }
    }
    
    data.push(block);
  }

  return data;
}

export const buildEventBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId 
                  + "/events/" + results[i].id;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.shared = results[i].shared;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    block.domainId = results[i].applicationDomainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications";
    block.versionsCount = results[i].numberOfVersions;
    block.versionsUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/events/" + results[i].id;
    
    data.push(block);
  }

  return data;
}

export const buildEventVersionBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].domainId 
                  + "/events/" + results[i].eventId + "?selectedVersionId=" + results[i].id;
    block.version = results[i].version;
    block.displayName = results[i].displayName;
    block.type = results[i].type;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.name = (block.displayName ? (block.version + ' [' + block.displayName + ']') : (block.version));

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }
    block.domainId = results[i].domainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications";
    
    block.eventId = results[i].eventId;
    block.eventName = results[i].eventName;
    block.eventUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + results[i].eventId;
    if (results[i].schemaVersion) {
      block.schemaVersionId = results[i].schemaVersion.id;
      block.schemaVersionName = results[i].schemaVersion.displayName ? (results[i].schemaVersion.version + '[' + results[i].schemaVersion.displayName + ']') : results[i].schemaVersion.version;
      block.schemaVersionUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/schemas/" + results[i].schemaVersion.schemaId + "?selectedVersionId=" + results[i].schemaVersion.id;
    }

    if (results[i].schema) {
      block.schemaId = results[i].schema.id;
      block.schemaName = results[i].schema.name;
      block.schemaUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/schemas/" + results[i].schema.id;
    }

    block.schemaPrimitiveType = results[i].schemaPrimitiveType;
    block.state = states[results[i].stateId];

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }
    if (results[i].declaredProducingApplicationVersionIds && results[i].declaredProducingApplicationVersionIds.length) {
      block.producerApplications = [];
      for (let j=0; j<results[i].declaredProducingApplicationVersionIds.length; j++) {
        let application = results[i].apps[results[i].declaredProducingApplicationVersionIds[j]];
        let applicationVersion = results[i].appVersions[results[i].declaredProducingApplicationVersionIds[j]];

        block.producerApplications.push({
          applicationId: application.id,
          applicationName: application.name,
          applicationUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications/" + application.id,
          versionId: applicationVersion.id,
          versionName: applicationVersion.name,
          version: applicationVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications/" + application.id + "?selectedVersionId=" + applicationVersion.id,
        });
      }
    }

    if (results[i].declaredConsumingApplicationVersionIds && results[i].declaredConsumingApplicationVersionIds.length) {
      block.consumerApplications = [];
      for (let j=0; j<results[i].declaredConsumingApplicationVersionIds.length; j++) {
        let application = results[i].apps[results[i].declaredConsumingApplicationVersionIds[j]];
        let applicationVersion = results[i].appVersions[results[i].declaredConsumingApplicationVersionIds[j]];

        block.consumerApplications.push({
          applicationId: application.id,
          applicationName: application.name,
          applicationUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications/" + application.id,
          versionId: applicationVersion.id,
          versionName: applicationVersion.name,
          version: applicationVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications/" + application.id + "?selectedVersionId=" + applicationVersion.id,
        });
      }
    }
    
    data.push(block);
  }

  return data;
}

export const buildSchemaBlocks = (results, domain) => {
  let data = [];
console.log('Schemas:', results);
  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId 
                  + "/schemas/" + results[i].id;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.shared = results[i].shared;
    block.contentType = results[i].contentType;
    block.schemaType = results[i].schemaType;
    block.type = results[i].type;
    block.eventVersionRefCount = results[i].eventVersionRefCount;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    block.domainId = results[i].applicationDomainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications";
    block.versionsCount = results[i].numberOfVersions;
    block.versionsUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/schemas/" + results[i].id;
    
    data.push(block);
  }

  return data;
}

export const buildSchemaVersionBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].domainId 
                  + "/schemas/" + results[i].schemaId + "?selectedVersionId=" + results[i].id;
    block.version = results[i].version;
    block.displayName = results[i].displayName;
    block.type = results[i].type;
    block.content = results[i].content;
    block.contentSize = results[i].content ? niceBytes(results[i].content.length) : 'Not specified';
    block.contentUrl = results[i].content ? 
          "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/schemaContent/" + results[i].schemaId + "?selectedVersionId=" + results[i].id :
          null;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.name = (block.displayName ? (block.version + ' [' + block.displayName + ']') : (block.version));

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }
    block.domainId = results[i].domainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications";
    
    block.schemaId = results[i].schemaId;
    block.schemaName = results[i].schemaName;
    block.schemaUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/schemas/" + results[i].schemaId;
    block.state = states[results[i].stateId];

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    if (results[i].referencedByEventVersionIds && results[i].referencedByEventVersionIds.length) {
      block.referringEvents = [];
      for (let j=0; j<results[i].referencedByEventVersionIds.length; j++) {
        let eventVersion = results[i].eventVersions[results[i].referencedByEventVersionIds[j]];
        let event = results[i].events[eventVersion.id];

        block.referringEvents.push({
          eventId: event.id,
          eventName: event.name,
          eventUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id,
          versionId: eventVersion.id,
          versionName: eventVersion.name,
          version: eventVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id + "?selectedVersionId=" + eventVersion.id,
        });
      }
    }
    
    data.push(block);
  }

  return data;
}


export const buildEnumBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId 
                  + "/enums/" + results[i].id;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.shared = results[i].shared;
    block.eventVersionRefCount = results[i].eventVersionRefCount;
    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    block.domainId = results[i].applicationDomainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications";
    block.versionsCount = results[i].numberOfVersions;
    block.versionsUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/enums/" + results[i].id;
    
    data.push(block);
  }

  return data;
}

export const buildEnumVersionBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].domainId 
                  + "/enums/" + results[i].enumId + "?selectedVersionId=" + results[i].id;
    block.version = results[i].version;
    block.displayName = results[i].displayName;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
      block.name = (block.displayName ? (block.version + ' [' + block.displayName + ']') : (block.version));

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }
    block.domainId = results[i].domainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications";
    
    block.enumId = results[i].enumId;
    block.enumName = results[i].enumName;
    block.enumUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/enums/" + results[i].enumId;
    block.state = states[results[i].stateId];

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    if (results[i].values && results[i].values.length) {
      block.values = [];
      for (let j=0; j<results[i].values.length; j++) {
        block.values.push({
          label: results[i].values[j].label,
          value: results[i].values[j].value,
          createdTime: results[i].values[j].createdTime,
          updatedTime: results[i].values[j].updatedTime
        });
      }
    }

    if (results[i].referencedByEventVersionIds && results[i].referencedByEventVersionIds.length) {
      block.referringEvents = [];
      for (let j=0; j<results[i].referencedByEventVersionIds.length; j++) {
        let eventVersion = results[i].eventVersions[results[i].referencedByEventVersionIds[j]];
        let event = results[i].events[eventVersion.id];

        block.referringEvents.push({
          eventId: event.id,
          eventName: event.name,
          eventUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id,
          versionId: eventVersion.id,
          versionName: eventVersion.name,
          version: eventVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id + "?selectedVersionId=" + eventVersion.id,
        });
      }
    }
    
    data.push(block);
  }

  return data;
}

export const buildEventApiBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId 
                  + "/eventApis/" + results[i].id;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.shared = results[i].shared;
    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }
    
    block.domainId = results[i].applicationDomainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications";
    block.versionsCount = results[i].numberOfVersions;
    block.versionsUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/eventApis/" + results[i].id;
    
    data.push(block);
  }

  return data;
}

export const buildEventApiVersionBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].domainId 
                  + "/eventApis/" + results[i].eventApiId + "?selectedVersionId=" + results[i].id;
    block.version = results[i].version;
    block.displayName = results[i].displayName;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
      block.name = (block.displayName ? (block.version + ' [' + block.displayName + ']') : (block.version));

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }
    block.domainId = results[i].domainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications";
    
    block.eventApiId = results[i].eventApiId;
    block.eventApiName = results[i].eventApiName;
    block.eventApiUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/eventApis/" + results[i].eventApiId;
    block.state = states[results[i].stateId];

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }

    if (results[i].producedEventVersionIds && results[i].producedEventVersionIds.length) {
      block.producedEvents = [];
      for (let j=0; j<results[i].producedEventVersionIds.length; j++) {
        let eventVersion = results[i].eventVersions[results[i].producedEventVersionIds[j]];
        let event = results[i].events[eventVersion.id];

        block.producedEvents.push({
          eventId: event.id,
          eventName: event.name,
          eventUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id,
          versionId: eventVersion.id,
          versionName: eventVersion.name,
          version: eventVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id + "?selectedVersionId=" + eventVersion.id,
        });
      }
    }

    if (results[i].consumedEventVersionIds && results[i].consumedEventVersionIds.length) {
      block.consumedEvents = [];
      for (let j=0; j<results[i].consumedEventVersionIds.length; j++) {
        let eventVersion = results[i].eventVersions[results[i].consumedEventVersionIds[j]];
        let event = results[i].events[eventVersion.id];

        block.consumedEvents.push({
          eventId: event.id,
          eventName: event.name,
          eventUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id,
          versionId: eventVersion.id,
          versionName: eventVersion.name,
          version: eventVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/events/" + event.id + "?selectedVersionId=" + eventVersion.id,
        });
      }
    }
    if (results[i].declaredEventApiProductVersionIds && results[i].declaredEventApiProductVersionIds.length) {
      block.referringEventApiProducts = [];
      for (let j=0; j<results[i].declaredEventApiProductVersionIds.length; j++) {
        let eventApiProductVersion = results[i].eventApiProductVersions[results[i].declaredEventApiProductVersionIds[j]];
        let eventApiProduct = results[i].eventApiProducts[eventApiProductVersion.id];

        block.referringEventApiProducts.push({
          eventApiProductId: eventApiProduct.id,
          eventApiProductName: eventApiProduct.name,
          eventApiProductUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/eventApiProducts/" + eventApiProduct.id,
          versionId: eventApiProductVersion.id,
          versionName: eventApiProductVersion.name,
          version: eventApiProductVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/eventApiProducts/" + eventApiProduct.id + "?selectedVersionId=" + eventApiProductVersion.id,
        });
      }
    }
    
    data.push(block);
  }

  return data;
}

export const buildEventApiProductBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.name = results[i].name;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId 
                  + "/eventApiProducts/" + results[i].id;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.shared = results[i].shared;
    block.brokerType = results[i].brokerType;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }
    
    block.domainId = results[i].applicationDomainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/applications";
    block.versionsCount = results[i].numberOfVersions;
    block.versionsUrl = "https://" + domain + "/ep/designer/domains/" + results[i].applicationDomainId + "/eventApiProducts/" + results[i].id;
    
    data.push(block);
  }

  return data;
}

export const buildEventApiProductVersionBlocks = (results, domain) => {
  let data = [];

  for (let i = 0; i < results.length; i++) {
    let block = {};

    block.id = results[i].id;
    block.url = "https://" + domain + "/ep/designer/domains/" + results[i].domainId 
                  + "/eventApiProducts/" + results[i].eventApiProductId + "?selectedVersionId=" + results[i].id;
    block.version = results[i].version;
    block.displayName = results[i].displayName;
    block.createdTime = results[i].createdTime;
    block.updatedTime = results[i].updatedTime;
    block.name = (block.displayName ? (block.version + ' [' + block.displayName + ']') : (block.version));
    block.displayName = results[i].displayName;
    block.summary = results[i].summary;

    if (results[i].description) {
      let desc = (results[i].description ? results[i].description.split(/\r?\n/) : []);
      if (results[i].description) {
        desc.forEach((line, index) => desc[index] = ((line && line.length > 0) ? line : ""));
        desc = desc.length ? desc.join("\n") : ""
      }
      block.description = desc;
    }
    block.domainId = results[i].domainId;
    block.domainName = results[i].domainName;
    block.domainUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/applications";
    
    block.eventApiProductId = results[i].eventApiProductId;
    block.eventApiProductName = results[i].eventApiProductName;
    block.eventApiProductUrl = "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/eventApiProducts/" + results[i].eventApiProductId;
    block.state = states[results[i].stateId];
    block.approvalType = approvalTypes[results[i].approvalType];
    block.publishState = publishStates[results[i].publishState]
    block.state = states[results[i].stateId];
    block.stateId = states[results[i].stateId];

    if (results[i].customAttributes && results[i].customAttributes.length) {
      block.customAttributes = [];
      for (let j=0; j<results[i].customAttributes.length; j++) {
        block.customAttributes.push({
          name: results[i].customAttributes[j].customAttributeDefinitionName,
          value: results[i].customAttributes[j].value
        });
      }
    }
console.log('RESULTS', results);
    if (results[i].eventApiVersionIds && results[i].eventApiVersionIds.length) {
      console.log('RESULTS results[i].eventApiVersions', results[i].eventApiVersions);
      console.log('RESULTS results[i].eventApis', results[i].eventApis);
      block.eventApis = [];
      for (let j=0; j<results[i].eventApiVersionIds.length; j++) {
        let eventApiVersion = results[i].eventApiVersions[results[i].eventApiVersionIds[j]];
        let eventApi = results[i].eventApis[eventApiVersion.id];

        block.eventApis.push({
          eventApiId: eventApi.id,
          eventApiName: eventApi.name,
          eventApiUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/eventApis/" + eventApi.id,
          versionId: eventApiVersion.id,
          versionName: eventApiVersion.name,
          version: eventApiVersion.version,
          versionUrl:  "https://" + domain + "/ep/designer/domains/" + results[i].domainId + "/eventApis/" + eventApi.id + "?selectedVersionId=" + eventApiVersion.id,
        });
      }
    }

    block.eventApiProductRegistrations = block.eventApiProductRegistrations
    block.plans = results[i].plans;
    block.solaceMessagingServices = results[i].solaceMessagingServices;
    block.filters = results[i].filters;

    data.push(block);
  }

  return data;
}
