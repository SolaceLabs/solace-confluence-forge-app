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

const Event = (props) => {
  const { event, navigate } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (event.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(event.description), type: 'String'});
  if (event.hasOwnProperty('versionsCount')) rows.push({name: 'Number of Versions', value: '<i>(' + event.versionsCount + ') found</i>', type: 'Version', url: event.versionsUrl, navigate: navigate, title: 'Fetch Version(s)'});
  if (event.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: event.domainName, type: 'String', url: event.domainUrl});
  if (event.hasOwnProperty('shared')) rows.push({name: 'Shared', value: event.shared ? 'True' : 'False', type: 'String'});
  if (event.hasOwnProperty('type')) rows.push({name: 'Type', value: event.type, type: 'String'});
  if (event.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(event.createdTime).toLocaleString(), type: 'String'});
  if (event.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(event.updatedTime).toLocaleString(), type: 'String'});

  if (event.customAttributes && event.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + event.customAttributes.length + ') found</i>', type: 'String'});
    event.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'Event', value: event.name, url: event.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEvents = (props) => {
  const { command, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [events, setEvents] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const events = await invoke('get-ep-resource', {command, token: token.value});
      console.log(events);
      if (events.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(events.message);
      } else {
        setEvents(events);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!events && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Events <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Events</p>
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
    let vUrl = url.replace('events', 'eventVersions');
    navigate(vUrl);
  }
console.log('IN SOLACE EVENTS', events?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Events</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {events?.data.length && events.data.map((event, index) => {
              return <Event key={index} navigate={fetchVersions} event={event} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {events.meta && events.meta.pagination &&
            getPageButtons(events.meta.pagination.totalPages)}
          {(!events.meta || !events.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
