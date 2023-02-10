import { useEffect, useState, Fragment } from "react"
import { invoke } from '@forge/bridge';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import Pagination from '@atlaskit/pagination';
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

const EventApi = (props) => {
  const { eventApi, navigate } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (eventApi.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(eventApi.description), type: 'String'});
  if (eventApi.hasOwnProperty('versionsCount')) rows.push({name: 'Number of Versions', value: eventApi.versionsCount, type: 'Version', url: eventApi.versionsUrl, navigate: navigate, title: 'Fetch Version(s)'});
  if (eventApi.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: eventApi.domainName, type: 'String', url: eventApi.domainUrl});
  if (eventApi.hasOwnProperty('shared')) rows.push({name: 'Shared', value: eventApi.shared ? 'True' : 'False', type: 'String'});
  if (eventApi.hasOwnProperty('type')) rows.push({name: 'Type', value: eventApi.type, type: 'String'});
  if (eventApi.hasOwnProperty('contentType')) rows.push({name: 'Content Type', value: eventApi.contentType, type: 'String'});
  if (eventApi.hasOwnProperty('eventApiType')) rows.push({name: 'EventApi Type', value: eventApi.eventApiType, type: 'String'});
  if (eventApi.hasOwnProperty('eventVersionRefCount')) rows.push({name: 'Referring Event Versions count', value: '' + eventApi.eventVersionRefCount, type: 'String'});
  if (eventApi.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(eventApi.createdTime).toLocaleString(), type: 'String'});
  if (eventApi.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(eventApi.updatedTime).toLocaleString(), type: 'String'});
  console.log('REFCOUNT', eventApi.eventVersionRefCount);
  if (eventApi.customAttributes && eventApi.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + eventApi.customAttributes.length + ') found</i>', type: 'String'});
    eventApi.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'EventApi', value: eventApi.name, url: eventApi.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEventApis = (props) => {
  const { command, token, paginate, navigate, page, setIsBlanketVisible} = props;
  const [eventApis, setEventApis] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      console.log('SolaceEventApis Token', token);
      (async () => {
        const eventApis = await invoke('get-ep-resource', {command, token: token.value});
        console.log(eventApis);
        setEventApis(eventApis);
        setIsBlanketVisible(false);
      })();
    } catch (err) {
      setLoadFailed(true);
      setIsBlanketVisible(false);
    }
  }, [ page ]);

  if (!eventApis && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Event APIs <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load EventApis</p>
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

  const fetchVersions = (url) => {
    let vUrl = url.replace('eventApis', 'eventApiVersions');
    navigate(vUrl);
  }
console.log('IN SOLACE EVENTAPIS', eventApis?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Event Apis</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {eventApis?.data.length && eventApis.data.map((eventApi, index) => {
              return <EventApi key={index} navigate={fetchVersions} eventApi={eventApi} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {eventApis.meta && eventApis.meta.pagination &&
            getPageButtons(eventApis.meta.pagination.totalPages)}
          {(!eventApis.meta || !eventApis.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
