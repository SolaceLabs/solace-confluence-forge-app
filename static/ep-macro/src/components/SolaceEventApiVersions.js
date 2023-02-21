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

const EventApiVersion = (props) => {
  const { eventApi, navigate, homeUrl } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();

  rows.push({name: 'EventApi Name', value: eventApi.eventApiName, type: 'String', url: eventApi.eventApiUrl});

  if (eventApi.hasOwnProperty('displayName')) 
    rows.push({name: 'EventApi Version', 
                value: (eventApi.displayName ? eventApi.version + " [" + eventApi.displayName + "]" : eventApi.version), 
                type: 'String', url: eventApi.versionUrl});
  else
    rows.push({name: 'EventApi Version', value: eventApi.version, type: 'String', url: eventApi.versionUrl});
  
  if (eventApi.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(eventApi.description), type: 'String'});
  if (eventApi.hasOwnProperty('state')) rows.push({name: 'State', value: eventApi.state, type: 'String'});
  if (eventApi.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: eventApi.domainName, type: 'String', url: eventApi.domainUrl});
  
  if (eventApi.customAttributes && eventApi.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + eventApi.customAttributes.length + ') found</i>', type: 'String'});
    eventApi.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    });
  }

  if (eventApi.producedEventVersionIds && eventApi.producedEventVersionIds.length) {
    rows.push({name: 'Produced Events', value: '<i>(' + eventApi.producedEventVersionIds.length + ') found</i>', type: 'String'});
    eventApi.producedEvents.map(ca => {
      if (!ca.eventId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventName, type: 'String', url: ca.eventUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  if (eventApi.consumedEventVersionIds && eventApi.consumedEventVersionIds.length) {
    rows.push({name: 'Consumed Events', value: '<i>(' + eventApi.consumedEventVersionIds.length + ') found</i>', type: 'String'});
    eventApi.consumedEvents.map(ca => {
      if (!ca.eventId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventName, type: 'String', url: ca.eventUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  if (eventApi.declaredEventApiProductVersionIds && eventApi.declaredEventApiProductVersionIds.length) {
    rows.push({name: 'Declared Event Api Products', value: '<i>(' + eventApi.declaredEventApiProductVersionIds.length + ') found</i>', type: 'String'});
    eventApi.referringEventApiProducts.map(ca => {
      if (!ca.eventApiProductId)
        return;

      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.eventApiProductName, type: 'String', url: ca.eventApiProductUrl},
        (ca.hasOwnProperty('versionName') ?
          {name: 'Version:', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl} :
          {name: 'Version:', value: ca.version, type: 'String', url: ca.versionUrl})
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'EventApi Version', value: eventApi.name, url: eventApi.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEventApiVersions = (props) => {
  const { command, homeUrl, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [eventApiVersions, setEventApisVersions] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const eventApiVersions = await invoke('get-ep-resource', {command, token: token.value});
      if (eventApiVersions.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(eventApiVersions.message);
      } else {
        setEventApisVersions(eventApiVersions);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!eventApiVersions && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Event API Versions <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load EventApi Versions</p>
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

console.log('IN SOLACE EVENTAPI VERSIONS', eventApiVersions?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>EventApi Versions</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {eventApiVersions?.data.length && eventApiVersions.data.map((eventApi, index) => {
              return <EventApiVersion key={index} navigate={goHome} eventApi={eventApi} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter>
        <SummaryCount>
          {eventApiVersions.meta && eventApiVersions.meta.pagination &&
            getPageButtons(eventApiVersions.meta.pagination.totalPages)}
          {(!eventApiVersions.meta || !eventApiVersions.meta.pagination) &&
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
