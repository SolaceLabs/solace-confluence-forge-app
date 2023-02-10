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
  SummaryActions, SummaryCount, SummaryFooter, ScrollContainer, TitleContainer
} from '../Styles';
import { ResourceTile } from "./ResourceTile";
var showdown = require('showdown');

const Domain = (props) => {
  const { domain } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (domain.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(domain.description), type: 'String'});
  if (domain.hasOwnProperty('uniqueTopicAddressEnforcementEnabled')) rows.push({name: 'Unique Topic Enforcement Enabled', value: domain.uniqueTopicAddressEnforcementEnabled ? 'True' : 'False', type: 'String'});
  if (domain.hasOwnProperty('topicDomainEnforcementEnabled')) rows.push({name: 'Topic Domain Enforcement Enabled', value: domain.topicDomainEnforcementEnabled ? 'True' : 'False', type: 'String'});
  if (domain.hasOwnProperty('type')) rows.push({name: 'Type', value: domain.type, type: 'String'});
  
  if (domain.hasOwnProperty('applicationCount') && domain.applicationCount > 0) 
    rows.push({name: 'Application Count', value: domain.applicationCount, type: 'String', url: domain.applicationCountUrl});
  if (domain.hasOwnProperty('eventCount') && domain.eventCount > 0) 
    rows.push({name: 'Event Count', value: domain.eventCount, type: 'String', url: domain.eventCountUrl});
  if (domain.hasOwnProperty('schemaCount') && domain.schemaCount > 0) 
    rows.push({name: 'Schema Count', value: domain.schemaCount, type: 'String', url: domain.schemaCountUrl});
  if (domain.hasOwnProperty('enumCount') && domain.enumCount > 0) 
    rows.push({name: 'Enum Count', value: domain.enumCount, type: 'String', url: domain.enumCountUrl});
  if (domain.hasOwnProperty('eventApiCount') && domain.eventApiCount > 0) 
    rows.push({name: 'Event Api Count', value: domain.eventApiCount, type: 'String', url: domain.eventApiCountUrl});
  if (domain.hasOwnProperty('eventApiProductCount') && domain.eventApiProductCount > 0) 
    rows.push({name: 'Event Api Product Count', value: domain.eventApiProductCount, type: 'String', url: domain.eventApiProductCountUrl});
  
  if (domain.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(domain.createdTime).toLocaleString(), type: 'String'});
  if (domain.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(domain.updatedTime).toLocaleString(), type: 'String'});

  if (domain.customAttributes && domain.customAttributes.length) {
    const caRows = [];
    domain.customAttributes.map(ca => {
      caRows.push({name: ca.name, value: ca.value, type: 'String'});      
    })
    rows.push({name: 'Custom Attributes', value: caRows, type: 'Table'});
  }

  return (
    <ResourceTile 
      name={{name: 'Application Domain', value: domain.name, url: domain.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceDomains = (props) => {
  const { command, token, paginate, page, setIsBlanketVisible} = props;
  const [domains, setDomains] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      console.log('SolaceDomains Token', token);
      (async () => {
        const domains = await invoke('get-ep-resource', {command, token: token.value});
        console.log(domains);
        setDomains(domains);
        setIsBlanketVisible(false);
      })();
    } catch (err) {
      setLoadFailed(true);
      setIsBlanketVisible(false);
    }
  }, [ page ]);

  if (!domains && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Application Domains <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Application Domains</p>
      </SectionMessage>
    )  
  }

  const getPageButtons = (num) => {
    if (num <= 1)
      return "";

    let arr = [];
    for (let i=0; i<num; i++)
      arr.push(i+1)
    
    return <Pagination testId="page" pages={arr} selectedIndex={page-1} onChange={paginate} />
  }
console.log('IN SOLACE DOMAINS', domains?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Application Domains</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {domains?.data.length && domains.data.map((domain, index) => {
              return <Domain key={index} domain={domain} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {domains.meta && domains.meta.pagination &&
            getPageButtons(domains.meta.pagination.totalPages)}
          {(!domains.meta || !domains.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>    
    </div>
  )
}
