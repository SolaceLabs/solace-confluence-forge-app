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

const Application = (props) => {
  const { application, navigate, container } = props;
  const counts = [];
  const rows = [];
  const converter = new showdown.Converter();
  
  if (application.hasOwnProperty('description')) rows.push({name: 'Description', value: converter.makeHtml(application.description), type: 'String'});
  if (application.hasOwnProperty('versionsCount')) rows.push({name: 'Number of Versions', value: '<i>(' + application.versionsCount + ') found</i>', type: 'Version', url: application.versionsUrl, navigate: navigate, title: 'Fetch Version(s)'});
  if (application.hasOwnProperty('domainName')) rows.push({name: 'Domain', value: application.domainName, type: 'String', url: application.domainUrl});
  if (application.hasOwnProperty('brokerType')) rows.push({name: 'Broker Type', value: application.brokerType, type: 'String'});
  if (application.hasOwnProperty('applicationType')) rows.push({name: 'Application Type', value: application.applicationType, type: 'String'});
  if (application.hasOwnProperty('createdTime')) rows.push({name: 'Created Time', value: new Date(application.createdTime).toLocaleString(), type: 'String'});
  if (application.hasOwnProperty('updatedTime')) rows.push({name: 'Updated Time', value: new Date(application.updatedTime).toLocaleString(), type: 'String'});

  if (application.customAttributes && application.customAttributes.length) {
    rows.push({name: 'Custom Attributes', value: '<i>(' + application.customAttributes.length + ') found</i>', type: 'String'});
    application.customAttributes.map(ca => {
      rows.push({name: "", type: "Table", value: [
        {name: 'Name:', value: ca.name, type: 'String'},
        {name: 'Value:', value: ca.value, type: 'String'}
      ]});
    })
  }

  return (
    <ResourceTile 
      name={{name: 'Application', value: application.name, url: application.url}} 
      counts={counts} 
      rows={rows} />
  )
}

export const SolaceApplications = (props) => {
  const { command, token, paginate, navigate, page, setIsBlanketVisible, setFetchError} = props;
  const [applications, setApplications] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const applications = await invoke('get-ep-resource', {command, token: token.value});
      console.log(applications);
      if (applications.status === false) {
        setLoadFailed(true);
        setIsBlanketVisible(false);
        setError(applications.message);
      } else {
        setApplications(applications);
        setIsBlanketVisible(false);
      }
    })();
  }, [ page ]);

  if (error) {
    setFetchError(error);
    return <div/>;
  }

  if (!applications && !loadFailed) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <p>Loading Applications <Spinner size="medium" interactionName="load" /></p>
      </div>
    )  
  }

  if (loadFailed) {
    return (
      <SectionMessage appearance="error">
        <p>Failed to load Applications</p>
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
    let vUrl = url.replace('applications', 'applicationVersions');
    navigate(vUrl);
  }
  
  // console.log('IN SOLACE APPLICATIONS', applications?.data);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TitleContainer>Applications</TitleContainer>
      <PageLayout>
        <Content>
          <Main>
          <ScrollContainer>
          <Fragment>            
            {applications?.data.length && applications.data.map((application, index) => {
              return <Application key={index} navigate={fetchVersions} application={application} />
            })}
          </Fragment>
          </ScrollContainer>
          </Main>
        </Content>
      </PageLayout>      
      <SummaryFooter  style={{display:'flex',justifyContent:'center'}}>
        <SummaryCount>
          {applications.meta && applications.meta.pagination &&
            getPageButtons(applications.meta.pagination.totalPages)}
          {(!applications.meta || !applications.meta.pagination) &&
            getPageButtons(1)}
        </SummaryCount>
        <SummaryActions>
        </SummaryActions>
      </SummaryFooter>             
    </div>
  )
}
