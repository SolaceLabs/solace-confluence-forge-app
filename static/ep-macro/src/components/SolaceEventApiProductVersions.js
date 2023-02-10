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
import ReactHtmlParser from 'react-html-parser'; 
import '../common/stati.css';

import {
  SummaryActions, SummaryCount, SummaryFooter, ScrollContainer, TitleContainer,
} from '../Styles';
import { ResourceTile } from "./ResourceTile";
var showdown = require('showdown');

const EventApiProductVersion = (props) => {
  const { eventApiProduct, navigate, homeUrl } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();

  rows.push({name: 'Event API Product Name', value: eventApiProduct.eventApiProductName, type: 'String', url: eventApiProduct.eventApiProductUrl});

  if (eventApiProduct.hasOwnProperty('displayName')) 
    rows.push({name: 'Event API Product Version', 
                value: (eventApiProduct.displayName ? eventApiProduct.version + " [" + eventApiProduct.displayName + "]" : eventApiProduct.version), 
                type: 'String', url: eventApiProduct.versionUrl});
  else
    rows.push({name: 'Event API Product Version', value: eventApiProduct.version, type: 'String', url: eventApiProduct.versionUrl});
  
  if (eventApiProduct.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(eventApiProduct.description), type: 'String'});
  if (eventApiProduct.hasOwnProperty('state')) rows.push({name: 'State', value: eventApiProduct.state, type: 'String'});
  if (eventApiProduct.hasOwnProperty('publishState')) rows.push({name: 'Publish State', value: eventApiProduct.publishState, type: 'String'});
  if (eventApiProduct.hasOwnProperty('approvalType')) rows.push({name: 'Approval Type', value: eventApiProduct.approvalType, type: 'String'});
  if (eventApiProduct.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: eventApiProduct.domainName, type: 'String', url: eventApiProduct.domainUrl});
  
  if (eventApiProduct.customAttributes && eventApiProduct.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + eventApiProduct.customAttributes.length + ') found</i>', type: 'String'});
    eventApiProduct.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    });
  }

  if (eventApiProduct.eventApis && eventApiProduct.eventApis.length) {
    rows.push({name: 'Referred Event APIs', value: '<i>(' + eventApiProduct.eventApis.length + ') found</i>', type: 'String'});
    eventApiProduct.eventApis.map(ca => {
      const caRows = [];
      caRows.push({name: 'Name', value: ca.eventApiName, type: 'String', url: ca.eventApiUrl});      
      caRows.push({name: 'Version', value: ca.version, type: 'String', url: ca.versionUrl});
      rows.push({name: '', value: caRows, type: 'Table'});
    })
  }

  if (eventApiProduct.plans && eventApiProduct.plans.length) {
    rows.push({name: 'Plans', value: '<i>(' + eventApiProduct.plans.length + ') found</i>', type: 'String'});
    eventApiProduct.plans.map(plan => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Policy Name:', value: plan.name, type: 'String'},
        {name: 'Class of Service:', value: '', type: 'String'},
        {name: ReactHtmlParser('&nbsp;&nbsp;&nbsp;&nbsp;Queue Type:'), value: plan.solaceClassOfServicePolicy.queueType, type: 'String'},
        {name: ReactHtmlParser('&nbsp;&nbsp;&nbsp;&nbsp;Access Type:'), value: plan.solaceClassOfServicePolicy.accessType, type: 'String'},
        {name: ReactHtmlParser('&nbsp;&nbsp;&nbsp;&nbsp;Delivery Mode:'), value: plan.solaceClassOfServicePolicy.messageDeliveryMode, type: 'String'},
        {name: ReactHtmlParser('&nbsp;&nbsp;&nbsp;&nbsp;Max TTL:'), value: plan.solaceClassOfServicePolicy.maximumTimeToLive, type: 'String'},
        {name: ReactHtmlParser('&nbsp;&nbsp;&nbsp;&nbsp;Max Message Spool Size:'), value: plan.solaceClassOfServicePolicy.maxMsgSpoolUsage, type: 'String'}
      ]});
    });
  }

  if (eventApiProduct.filters && eventApiProduct.filters.length) {
    rows.push({name: 'Event Filters', value: '<i>(' + eventApiProduct.filters.length + ') found</i>', type: 'String'});
  }
  if (eventApiProduct.eventApiProductRegistrations && eventApiProduct.eventApiProductRegistrations.length) {
    rows.push({name: 'Event API Product Registrations', value: '<i>(' + eventApiProduct.eventApiProductRegistrations.length + ') found</i>', type: 'String'});
  }

  return (
    <ResourceTile 
      name={{name: 'Event API Product Version', value: eventApiProduct.name, url: eventApiProduct.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEventApiProductVersions = (props) => {
  const { command, homeUrl, token, paginate, navigate, page, setIsBlanketVisible} = props;
  const [eventApiProductVersions, setEventApiProductVersions] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const eventApiProductVersions = await invoke('get-ep-resource', {command, token: token.value});
        setEventApiProductVersions(eventApiProductVersions);
        setIsBlanketVisible(false);
      })();
    } catch (err) {
      setLoadFailed(true);
      setIsBlanketVisible(false);
    }
  }, [ page ]);

  if (!eventApiProductVersions && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Event API Product Versions <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Event API Product Versions</p>
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

console.log('IN SOLACE EVENTAPIPRODUCT VERSIONS', eventApiProductVersions?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Event API Product Versions</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {eventApiProductVersions?.data.length && eventApiProductVersions.data.map((eventApiProduct, index) => {
              return <EventApiProductVersion key={index} navigate={goHome} eventApiProduct={eventApiProduct} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter>
        <SummaryCount>
          {eventApiProductVersions.meta && eventApiProductVersions.meta.pagination &&
            getPageButtons(eventApiProductVersions.meta.pagination.totalPages)}
          {(!eventApiProductVersions.meta || !eventApiProductVersions.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
          {command.url !== homeUrl && 
            <Button appearance="subtle" onClick={() => navigate(homeUrl)}>Back</Button>}
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
