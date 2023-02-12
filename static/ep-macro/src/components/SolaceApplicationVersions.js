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

const ApplicationVersion = (props) => {
  const { application, navigate } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (application.hasOwnProperty('displayName')) 
    rows.push({name: 'Application Version', 
                value: (application.displayName ? application.version + " [" + application.displayName + "]" : application.version), 
                type: 'String', url: application.versionUrl});
  else
    rows.push({name: 'Application Version', value: application.version, type: 'String', url: application.versionUrl});

  if (application.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(application.description), type: 'String'});
  if (application.hasOwnProperty('applicationName')) rows.push({name: 'Application Name', value: application.applicationName, type: 'String', url: application.applicationUrl, navigate: navigate});
  if (application.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: application.domainName, type: 'String', url: application.domainUrl});
  

  if (application.customAttributes && application.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + application.customAttributes.length + ') found</i>', type: 'String'});
    application.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  if (application.producedEvents && application.producedEvents.length) {
    rows.push({name: 'Produced Events', value: '<i>(' + application.producedEvents.length + ') found</i>', type: 'String'});
    application.producedEvents.map(ca => {
      const caRows = [];
      caRows.push({name: 'Name', value: ca.eventName, type: 'String', url: ca.eventUrl});      
      if (application.hasOwnProperty('versionName')) 
        caRows.push({name: 'Version', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: ca.versionUrl});
      else
        caRows.push({name: 'Version', value: ca.version, type: 'String', url: ca.versionUrl});
      rows.push({name: '', value: caRows, type: 'Table'});
    })
  }

  if (application.consumedEvents && application.consumedEvents.length) {
    rows.push({name: 'Consumed Events', value: '<i>(' + application.consumedEvents.length + ') found</i>', type: 'String'});
    application.consumedEvents.map(ca => {
      const caRows = [];
      caRows.push({name: 'Name', value: ca.eventName, type: 'String', url: ca.eventUrl});      
      if (application.hasOwnProperty('versionName')) 
        caRows.push({name: 'Version', value: ca.version + " [" + ca.versionName + "]", type: 'String', url: application.versionUrl});
      else
        caRows.push({name: 'Version', value: ca.version, type: 'String', url: ca.versionUrl});
      rows.push({name: '', value: caRows, type: 'Table'});
    })
  }

  if (application.consumers && application.consumers.length) {
    rows.push({name: 'Consumers', value: '<i>(' + application.consumers.length + ') found</i>', type: 'String'});
    const caRows = [];
    application.consumers.map(ca => {
      caRows.push({name: 'Name', value: ca.name, type: 'String'});
      caRows.push({name: 'Broker Type', value: ca.brokerType, type: 'String'});
      caRows.push({name: 'Consumer Type', value: ca.consumerType, type: 'String'});
      caRows.push({name: 'Type', value: ca.type, type: 'String'});
    
      if (ca.subscriptions && ca.subscriptions.length) {
        caRows.push({name: 'Subscriptions:', value: '', type: 'String'});
        ca.subscriptions.map((caa, index) => {
          caRows.push({name: ' - ', value: caa.value + ' (' + caa.subscriptionType + ')', type: 'String'});
        });
      }
      caRows.push({name: 'Created Time', value: new Date(ca.createdTime).toLocaleString(), type: 'String'});
      caRows.push({name: 'Updated Time', value: new Date(ca.updatedTime).toLocaleString(), type: 'String'});
    })
    rows.push({name: '', value: caRows, type: 'Table'});

    if (application.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(application.createdTime).toLocaleString(), type: 'String'});
    if (application.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(application.updatedTime).toLocaleString(), type: 'String'});
  }

  return (
    <ResourceTile 
      name={{name: 'Application Version', value: application.name, url: application.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceApplicationVersions = (props) => {
  const { command, homeUrl, token, paginate, navigate, page, setIsBlanketVisible} = props;
  const [applicationVersions, setApplications] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      console.log('SolaceApplicationVersions Token', token);
      (async () => {
        const applicationVersions = await invoke('get-ep-resource', {command, token: token.value});
        console.log(applicationVersions);
        setApplications(applicationVersions);
        setIsBlanketVisible(false);
      })();
    } catch (err) {
      setLoadFailed(true);
      setIsBlanketVisible(false);
    }
  }, [ page ]);

  if (!applicationVersions && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Application Versions <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Application Versions</p>
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

console.log('IN SOLACE APPLICATION VERSIONS', applicationVersions?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Application Versions</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {applicationVersions?.data.length && applicationVersions.data.map((application, index) => {
              return <ApplicationVersion key={index} navigate={goHome} application={application} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter>
        <SummaryCount>
          {applicationVersions.meta && applicationVersions.meta.pagination &&
            getPageButtons(applicationVersions.meta.pagination.totalPages)}
          {(!applicationVersions.meta || !applicationVersions.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
          {command.url !== homeUrl && 
            <Button appearance="primary" onClick={() => navigate(homeUrl)}>Back</Button>}
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
