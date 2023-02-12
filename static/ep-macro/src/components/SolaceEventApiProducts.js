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

const EventApiProduct = (props) => {
  const { eventApiProduct, navigate } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (eventApiProduct.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(eventApiProduct.description), type: 'String'});
  if (eventApiProduct.hasOwnProperty('versionsCount')) rows.push({name: 'Number of Versions', value: '<i>(' + eventApiProduct.versionsCount + ') found</i>', type: 'Version', url: eventApiProduct.versionsUrl, navigate: navigate, title: 'Fetch Version(s)'});
  if (eventApiProduct.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: eventApiProduct.domainName, type: 'String', url: eventApiProduct.domainUrl});
  if (eventApiProduct.hasOwnProperty('shared')) rows.push({name: 'Shared', value: eventApiProduct.shared ? 'True' : 'False', type: 'String'});
  if (eventApiProduct.hasOwnProperty('brokerType')) rows.push({name: 'Broker Type', value: eventApiProduct.brokerType, type: 'String'});
  console.log('REFCOUNT', eventApiProduct.eventVersionRefCount);
  if (eventApiProduct.customAttributes && eventApiProduct.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + eventApiProduct.customAttributes.length + ') found</i>', type: 'String'});
    eventApiProduct.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  if (eventApiProduct.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(eventApiProduct.createdTime).toLocaleString(), type: 'String'});
  if (eventApiProduct.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(eventApiProduct.updatedTime).toLocaleString(), type: 'String'});

  return (
    <ResourceTile 
      name={{name: 'Event API Product', value: eventApiProduct.name, url: eventApiProduct.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceEventApiProducts = (props) => {
  const { command, token, paginate, navigate, page, setIsBlanketVisible} = props;
  const [eventApiProducts, setEventApiProducts] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      console.log('SolaceEventApiProducts Token', token);
      (async () => {
        const eventApiProducts = await invoke('get-ep-resource', {command, token: token.value});
        console.log(eventApiProducts);
        setEventApiProducts(eventApiProducts);
        setIsBlanketVisible(false);
      })();
    } catch (err) {
      setLoadFailed(true);
      setIsBlanketVisible(false);
    }
  }, [ page ]);

  if (!eventApiProducts && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Event API Products <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load EventApiProducts</p>
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
    let vUrl = url.replace('eventApiProducts', 'eventApiProductVersions');
    navigate(vUrl);
  }
console.log('IN SOLACE EVENTAPIPRODUCTS', eventApiProducts?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Event Product APIs</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {eventApiProducts?.data.length && eventApiProducts.data.map((eventApiProduct, index) => {
              return <EventApiProduct key={index} navigate={fetchVersions} eventApiProduct={eventApiProduct} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {eventApiProducts.meta && eventApiProducts.meta.pagination &&
            getPageButtons(eventApiProducts.meta.pagination.totalPages)}
          {(!eventApiProducts.meta || !eventApiProducts.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
