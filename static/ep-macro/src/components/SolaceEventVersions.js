import { useEffect, useState, Fragment } from "react"
import { invoke } from '@forge/bridge';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import Pagination from '@atlaskit/pagination';
import Button from '@atlaskit/button';  
import {
  Content,
  Main,
  PageLayout,
} from '@atlaskit/page-layout';
import '../common/stati.css';

import {
  SummaryActions, SummaryCount, SummaryFooter, ScrollContainer, TitleContainer,
} from '../Styles';
import { ResourceTile } from "./ResourceTile";
var showdown = require('showdown');

const EventVersion = (props) => {
  const { event, navigate, homeUrl } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();

  if (event.hasOwnProperty('displayName')) 
    rows.push({name: 'Event Version', 
                value: (event.displayName ? event.version + " [" + event.displayName + "]" : event.version), 
                type: 'String', url: event.versionUrl});
  else
    rows.push({name: 'Event Version', value: event.version, type: 'String', url: event.versionUrl});
  
  if (event.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(event.description), type: 'String'});
  if (event.hasOwnProperty('state')) rows.push({name: 'State', value: event.state, type: 'String'});
  if (event.hasOwnProperty('eventName')) rows.push({name: 'Event Name', value: event.eventName, type: 'String', url: event.eventUrl, navigate: navigate});
  if (event.hasOwnProperty('schemaName')) {
    rows.push({name: "Schema", type: "Table", value: [
      {name: 'Name:', value: event.schemaName, type: 'String', url: event.schemaUrl},
      {name: 'Value:', value: event.schemaVersionName, type: 'String', url: event.schemaVersionUrl}
    ]});
  }

  if (event.hasOwnProperty('schemaPrimitiveType') && event.schemaPrimitiveType) rows.push({name: 'Schema Primitive Type', value: event.schemaPrimitiveType, type: 'String'});
  if (event.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: event.domainName, type: 'String', url: event.domainUrl});
  
  if (event.customAttributes && event.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + event.customAttributes.length + ') found</i>', type: 'String'});
    event.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    });
  }

  if (event.declaredProducingApplicationVersionIds && event.declaredProducingApplicationVersionIds.length) {
    rows.push({name: 'Declared Producer Applications', value: '<i>(' + event.producerApplications.length + ') found</i>', type: 'String'});
    event.producerApplications.map(ca => {
      if (!ca.applicationId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.applicationName, type: 'String', url: ca.applicationUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  if (event.declaredConsumingApplicationVersionIds && event.declaredConsumingApplicationVersionIds.length) {
    rows.push({name: 'Declared Consumer Applications', value: '<i>(' + event.consumerApplications.length + ') found</i>', type: 'String'});
    event.consumerApplications.map(ca => {
      if (!ca.applicationId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.applicationName, type: 'String', url: ca.applicationUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  if (event.producingEventApiVersionIds && event.producingEventApiVersionIds.length) {
    rows.push({name: 'Publishing Event Apis', value: '<i>(' + event.producingEventApiVersionIds.length + ') found</i>', type: 'String'});
    event.producerEventApis.map(ca => {
      if (!ca.eventApiId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventApiName, type: 'String', url: ca.eventApiUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  if (event.consumingEventApiVersionIds && event.consumingEventApiVersionIds.length) {
    rows.push({name: 'Consuming Event Apis', value: '<i>(' + event.consumingEventApiVersionIds.length + ') found</i>', type: 'String'});
    event.consumerEventApis.map(ca => {
      if (!ca.eventApiId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventApiName, type: 'String', url: ca.eventApiUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }
  
  return (
    <ResourceTile 
      name={{name: 'Event Version', value: event.name, url: event.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEventVersions = (props) => {
  const { command, homeUrl, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [eventVersions, setEventVersions] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const eventVersions = await invoke('get-ep-resource', {command, token: token.value});
      console.log(eventVersions);
      if (eventVersions.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(eventVersions.message);
      } else {
        setEventVersions(eventVersions);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!eventVersions && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Event Versions <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Event Versions</p>
      </SectionMessage>
    )  
  }

  const getPageButtons = (num) => {
    if (num <= 1)
      return "";

    let arr = [];
    for (let i=0; i<num; i++)
      arr.push(i+1)
    
    return <Pagination pages={arr} selectedIndex={page-1} onChange={paginate} />
  }

  const goHome = () => {
    navigate(homeUrl);
  }

console.log('IN SOLACE EVENT VERSIONS', eventVersions?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Event Versions</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {eventVersions?.data.length && eventVersions.data.map((event, index) => {
              return <EventVersion key={index} navigate={goHome} event={event} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter>
        <SummaryCount>
          {eventVersions.meta && eventVersions.meta.pagination &&
            getPageButtons(eventVersions.meta.pagination.totalPages)}
          {(!eventVersions.meta || !eventVersions.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
          {command.url !== homeUrl && homeUrl.indexOf('selectedVersionId') < 0 &&
            <Button appearance="primary" onClick={() => navigate(homeUrl)}>Back</Button>}
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
